// features/soggetti_lookup.js
// Feature: card "Consulta Soggetto" per le pagine soggetti/anagrafiche di Datasurf.
// Intercetta tutte le risposte XHR/fetch sulla rotta attiva, accumula un indice
// locale dei soggetti caricati e offre ricerca full-text su nome/P.IVA/CF/tel/email.
//
// Nessuna logica CER, nessun id/classe CER.
// Gira nel main world tramite il kernel di content_script.js.
//
// Dipende da:
//   - kernel  (globale, definito in content_script.js)
//
// Debug in Console:
//   window.__DSSOGG_DEBUG__.size()         → numero soggetti indicizzati
//   window.__DSSOGG_DEBUG__.cerca('borri') → ricerca manuale
//   window.__DSSOGG_DEBUG__.nomi()         → lista nomi
//   window.__DSSOGG_DEBUG__.reset()        → svuota l'indice

(function () {
  'use strict';

  const VERSION = '1.6.2';
  const STORE = new Map();
  let fetchListenerId = null;
  let stopObserver = null;
  let lastInput = '';

  // Attiva la feature sulle rotte che riguardano soggetti / anagrafiche
  const ROUTE_SOGGETTI = /(soggett|anagrafic|subject|clienti|cliente|fornitori|fornitore|customer|supplier|contact|contatt|rubrica|partner|aziende)/i;

  // Pattern per riconoscere i campi nei JSON delle risposte
  const KEY_NAME   = /(ragione|denomin|nomin|nome|cognome|sociale|intest|descrizione|descr|azienda|company|business|display|title|cliente|fornitore|soggetto|anagraf)/i;
  const KEY_VAT    = /(p\.?iva|partita.*iva|partita_iva|vat|iva)/i;
  const KEY_CF     = /(codice.*fisc|cod_fisc|codice_fiscale|fiscale|tax)/i;
  const KEY_EMAIL  = /(mail|email|e-mail)/i;
  const KEY_PEC    = /(^|[_.-])pec($|[_.-]|mail|email)|pec/i;
  const KEY_PHONE  = /(telefono|telefoni|tel$|tel_|_tel|phone|fisso|recapito)/i;
  const KEY_MOBILE = /(cellulare|cell$|cell_|_cell|mobile|mob$|gsm|whatsapp)/i;
  const KEY_ADDR   = /(indirizzo|address|via|localita|localit|comune|citta|citt|provincia|cap|sede)/i;
  const KEY_SKIP   = /(^id$|uuid|guid|created|updated|deleted|token|password|session|avatar|image|logo|color|colore|ordine|rank|sort|page|limit|offset|timestamp)/i;


  // ─── Utility ──────────────────────────────────────────────────────────────────

  function text(v) {
    return String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
  }

  function norm(v) {
    return text(v)
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9@.+\s_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function html(v) {
    return text(v).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function isObject(x) {
    return x && typeof x === 'object' && !Array.isArray(x);
  }

  function addUnique(arr, value, max) {
    const v = text(value);
    if (!v || arr.includes(v)) return;
    if (max && arr.length >= max) return;
    arr.push(v);
  }

  function onlyDigits(v) {
    let d = String(v == null ? '' : v).replace(/[^0-9+]/g, '');
    if (d.startsWith('+39')) d = d.slice(3);
    d = d.replace(/\D/g, '');
    if (d.startsWith('0039')) d = d.slice(4);
    return d;
  }

  function looksPhone(v) {
    const d = onlyDigits(v);
    return d.length >= 6 && d.length <= 13 && /^(0|3)/.test(d);
  }

  function extractEmails(v) {
    const m = String(v || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig);
    return m ? m.map(x => x.trim()) : [];
  }


  // ─── Parsing JSON risposta ─────────────────────────────────────────────────────

  function flatten(obj, prefix, out, depth, seen) {
    if (depth > 3 || obj == null) return;
    const s = seen || new WeakSet();
    if (typeof obj === 'object') {
      if (s.has(obj)) return;
      s.add(obj);
    }
    if (Array.isArray(obj)) {
      obj.slice(0, 15).forEach((x, i) => flatten(x, `${prefix}[${i}]`, out, depth + 1, s));
      return;
    }
    if (!isObject(obj)) return;
    Object.keys(obj).forEach(k => {
      const v = obj[k];
      if (v == null) return;
      const path = prefix ? `${prefix}.${k}` : k;
      // I booleani non sono mai dati utili per un soggetto (es. { piva: false })
      if (typeof v === 'string' || typeof v === 'number') {
        out.push({ key: k, path, value: String(v), depth });
      } else if (typeof v === 'object') {
        flatten(v, path, out, depth + 1, s);
      }
    });
  }

  function walkObjects(root, callback, depth, seen) {
    if (depth > 5 || root == null) return;
    const s = seen || new WeakSet();
    if (typeof root === 'object') {
      if (s.has(root)) return;
      s.add(root);
    }
    if (Array.isArray(root)) {
      root.forEach(item => walkObjects(item, callback, depth + 1, s));
      return;
    }
    if (isObject(root)) {
      callback(root);
      Object.keys(root).forEach(k => {
        const v = root[k];
        if (v && typeof v === 'object') walkObjects(v, callback, depth + 1, s);
      });
    }
  }

  function scoreCandidate(fields) {
    let score = 0;
    if (fields.some(f => KEY_NAME.test(f.key) && text(f.value).length > 2)) score += 3;
    if (fields.some(f => KEY_VAT.test(f.key))) score += 3;
    if (fields.some(f => KEY_CF.test(f.key))) score += 3;
    if (fields.some(f => KEY_EMAIL.test(f.key) || extractEmails(f.value).length)) score += 2;
    if (fields.some(f => (KEY_PHONE.test(f.key) || KEY_MOBILE.test(f.key)) && looksPhone(f.value))) score += 2;
    if (fields.some(f => /soggett|anagraf|cliente|fornitore|subject|customer|supplier/i.test(f.path))) score += 1;
    return score;
  }

  function normalizeRecord(obj, url) {
    if (!isObject(obj)) return null;
    const fields = [];
    flatten(obj, '', fields, 0);
    if (!fields.length) return null;
    if (scoreCandidate(fields) < 3) return null;

    const rec = {
      nome: '', piva: '', cf: '',
      fissi: [], cellulari: [], email: [], pec: [], indirizzo: [],
      fonte: url || '', search: ''
    };
    const nameCandidates = [];

    fields.forEach(f => {
      const k = f.key || '';
      const p = f.path || '';
      const v = text(f.value);
      if (!v || KEY_SKIP.test(k)) return;
      // geo.* contiene dati dell'ente geografico (regione.PEC, regione.SEDE…), non dell'azienda
      if (/^geo\b/.test(p)) return;

      if (KEY_NAME.test(k) && v.length > 1 && !/^\d+$/.test(v)) nameCandidates.push(v);
      if (KEY_VAT.test(k) && !rec.piva) rec.piva = v;
      if (KEY_CF.test(k) && !rec.cf) rec.cf = v;

      const emails = extractEmails(v);
      if (emails.length) {
        emails.forEach(e => {
          const isPec = KEY_PEC.test(k) || KEY_PEC.test(p) || /pec\./i.test(e) || /@pec/i.test(e);
          // La PEC viene raccolta solo dai campi diretti del soggetto (depth ≤ 1),
          // non da sotto-oggetti annidati (es. ente_regionale.pec).
          if (isPec && f.depth <= 1) addUnique(rec.pec, e, 4);
          else if (!isPec) addUnique(rec.email, e, 4);
        });
      }

      if ((KEY_PHONE.test(k) || KEY_MOBILE.test(k) || KEY_PHONE.test(p) || KEY_MOBILE.test(p)) && looksPhone(v)) {
        const d = onlyDigits(v);
        if (KEY_MOBILE.test(k) || KEY_MOBILE.test(p) || d.startsWith('3')) addUnique(rec.cellulari, d, 4);
        else addUnique(rec.fissi, d, 4);
      }

      // Soglia 8 caratteri per escludere frammenti isolati (CAP, sigle provincia)
      if (KEY_ADDR.test(k) && v.length > 8) addUnique(rec.indirizzo, v, 4);
    });

    rec.nome = chooseBestName(nameCandidates, rec);

    if (!rec.nome && (rec.piva || rec.cf || rec.email.length || rec.pec.length)) {
      const fallback = fields.find(f => !KEY_SKIP.test(f.key) && text(f.value).length > 2 && !/^\d+$/.test(text(f.value)));
      if (fallback) rec.nome = text(fallback.value);
    }

    if (!rec.nome && !rec.piva && !rec.cf && !rec.email.length && !rec.pec.length && !rec.fissi.length && !rec.cellulari.length) return null;

    rec.search = norm([rec.nome, rec.piva, rec.cf, rec.email.join(' '), rec.pec.join(' '), rec.fissi.join(' '), rec.cellulari.join(' '), rec.indirizzo.join(' ')].join(' '));
    const key = norm([rec.nome, rec.piva, rec.cf, rec.email[0], rec.pec[0], rec.fissi[0], rec.cellulari[0]].join('|'));
    if (!key || key.length < 3) return null;
    rec.key = key;
    return rec;
  }

  function chooseBestName(candidates, rec) {
    const clean = candidates.map(text).filter(Boolean).filter(v => {
      const n = norm(v);
      if (!n || n.length < 2) return false;
      if (n === norm(rec.piva) || n === norm(rec.cf)) return false;
      if (/^\d+$/.test(n)) return false;
      if (extractEmails(v).length) return false;
      return true;
    });
    clean.sort((a, b) => {
      const diff = nameScore(b) - nameScore(a);
      return diff !== 0 ? diff : b.length - a.length;
    });
    return clean[0] || '';
  }

  function nameScore(v) {
    const n = norm(v);
    let s = 0;
    if (/srl|s\.r\.l|spa|s\.p\.a|snc|sas|societa|ditta|studio|avv|ing|consulting|service/i.test(v)) s += 3;
    if (n.includes(' ')) s += 2;
    if (v.length >= 4 && v.length <= 80) s += 1;
    return s;
  }


  // ─── Indice locale ─────────────────────────────────────────────────────────────

  function mergeRecord(rec) {
    const existing = STORE.get(rec.key);
    if (!existing) { STORE.set(rec.key, rec); return; }
    if (!existing.nome && rec.nome) existing.nome = rec.nome;
    if (!existing.piva && rec.piva) existing.piva = rec.piva;
    if (!existing.cf && rec.cf) existing.cf = rec.cf;
    ['fissi', 'cellulari', 'email', 'pec', 'indirizzo'].forEach(k => {
      rec[k].forEach(v => addUnique(existing[k], v, 4));
    });
    existing.search = norm([existing.nome, existing.piva, existing.cf, existing.email.join(' '), existing.pec.join(' '), existing.fissi.join(' '), existing.cellulari.join(' '), existing.indirizzo.join(' ')].join(' '));
  }

  function processData(url, data) {
    const countBefore = STORE.size;
    walkObjects(data, obj => {
      const rec = normalizeRecord(obj, url);
      if (rec) mergeRecord(rec);
    }, 0);
    if (STORE.size !== countBefore) {
      updateStatus();
      if (lastInput) renderResults();
    }
  }

  function scanDomRows() {
    Array.from(document.querySelectorAll('table tbody tr')).forEach((row, idx) => {
      const t = text(row.innerText || row.textContent || '');
      if (!t || t.length < 3) return;
      const emails = extractEmails(t);
      const phoneMatches = t.match(/(?:\+39|0039)?[\s./-]*(?:0|3)[0-9\s./-]{5,15}/g) || [];
      const hasIdentity = /[A-Za-z]{3,}/.test(t) && (emails.length || phoneMatches.length || /\b[0-9]{11}\b/.test(t));
      if (!hasIdentity) return;
      const lines = t.split(/\n|\s{2,}/).map(text).filter(Boolean);
      const name = lines.find(x => /[A-Za-z]{3,}/.test(x) && !extractEmails(x).length && !looksPhone(x)) || lines[0];
      const rec = {
        nome: name, piva: (t.match(/\b\d{11}\b/) || [''])[0], cf: '',
        fissi: [], cellulari: [], email: [], pec: [], indirizzo: [],
        fonte: 'DOM', key: `dom-${norm(name)}-${idx}`, search: ''
      };
      emails.forEach(e => /pec/i.test(e) ? addUnique(rec.pec, e, 4) : addUnique(rec.email, e, 4));
      phoneMatches.forEach(p => {
        const d = onlyDigits(p);
        if (d.startsWith('3')) addUnique(rec.cellulari, d, 4);
        else if (d.startsWith('0')) addUnique(rec.fissi, d, 4);
      });
      rec.search = norm([rec.nome, rec.piva, rec.cf, rec.email.join(' '), rec.pec.join(' '), rec.fissi.join(' '), rec.cellulari.join(' ')].join(' '));
      if (rec.search.length > 2) mergeRecord(rec);
    });
    updateStatus();
  }


  // ─── Ricerca ───────────────────────────────────────────────────────────────────

  function search(query) {
    const q = norm(query);
    if (!q) return [];
    scanDomRows();
    return Array.from(STORE.values())
      .filter(r => r.search.includes(q))
      .sort((a, b) => rank(b, q) - rank(a, q))
      .slice(0, 12);
  }

  function rank(r, q) {
    let s = 0;
    if (norm(r.nome) === q) s += 100;
    if (norm(r.nome).startsWith(q)) s += 60;
    if (norm(r.nome).includes(q)) s += 40;
    if (norm(r.piva) === q || norm(r.cf) === q) s += 80;
    if (r.cellulari.concat(r.fissi).some(x => norm(x).includes(q))) s += 30;
    if (r.email.concat(r.pec).some(x => norm(x).includes(q))) s += 30;
    return s;
  }


  // ─── Widget ────────────────────────────────────────────────────────────────────

  function mountWidget(target) {
    if (document.getElementById('dssogg-card')) return;
    const widget = document.createElement('div');
    widget.id = 'dssogg-card';
    widget.innerHTML = `
      <div class="dssogg-title">Consulta Soggetto</div>
      <div class="dssogg-row">
        <input id="dssogg-input" class="dssogg-input" type="text" placeholder="Ragione sociale, P.IVA, CF, telefono o email" autocomplete="off">
        <button id="dssogg-clear" class="dssogg-btn" type="button">Pulisci</button>
      </div>
      <div id="dssogg-status" class="dssogg-status">Archivio locale: 0 soggetti indicizzati.</div>
      <div id="dssogg-results" class="dssogg-results dssogg-empty">Scrivi almeno 2 caratteri. La card usa i soggetti già caricati da Datasurf.</div>
    `;

    const input = widget.querySelector('#dssogg-input');
    const clear = widget.querySelector('#dssogg-clear');

    input.addEventListener('input', () => { lastInput = input.value; renderResults(); });
    input.addEventListener('keydown', ev => { ev.stopPropagation(); if (ev.key === 'Enter') renderResults(); });
    input.addEventListener('click', ev => ev.stopPropagation());
    clear.addEventListener('click', ev => {
      ev.preventDefault(); ev.stopPropagation();
      input.value = ''; lastInput = ''; renderResults(); input.focus();
    });

    // Stessa logica del CER filter: risale al contenitore card/toolbar,
    // non usa mai body o elementi generici che potrebbero essere nel nav.
    const contenitore = target.closest('nz-card, mat-card, .card, [class*="toolbar"], .list-header')
                     || target.parentElement;
    if (contenitore) {
      contenitore.insertBefore(widget, contenitore.firstChild);
    } else {
      target.parentElement.insertBefore(widget, target);
    }

    updateStatus();
  }

  function removeWidget() {
    const w = document.getElementById('dssogg-card');
    if (w) w.remove();
  }

  function updateStatus() {
    const status = document.getElementById('dssogg-status');
    if (status) status.textContent = `Archivio locale: ${STORE.size} soggetti indicizzati.`;
  }

  function renderResults() {
    const input = document.getElementById('dssogg-input');
    const box = document.getElementById('dssogg-results');
    if (!input || !box) return;
    const q = input.value.trim();
    lastInput = q;
    if (q.length < 2) {
      box.className = 'dssogg-results dssogg-empty';
      box.textContent = "Scrivi almeno 2 caratteri. La card usa i soggetti già caricati da Datasurf.";
      return;
    }
    const results = search(q);
    if (!results.length) {
      box.className = 'dssogg-results dssogg-warning';
      box.innerHTML = `Nessun soggetto trovato per <strong>${html(q)}</strong>. Apri o cerca il soggetto nella lista Datasurf, poi riprova.`;
      return;
    }
    box.className = 'dssogg-results';
    box.innerHTML = results.map(renderRecord).join('');
  }

  function renderLine(label, value) {
    const values = Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
    if (!values.length) return '';
    return `<div class="dssogg-line"><span>${html(label)}:</span> ${values.map(html).join(' | ')}</div>`;
  }

  function renderRecord(r) {
    return `
      <div class="dssogg-result-card">
        <div class="dssogg-name">${html(r.nome || 'Soggetto senza nome')}</div>
        ${renderLine('P.IVA', r.piva)}
        ${renderLine('CF', r.cf)}
        ${renderLine('Telefono fisso', r.fissi)}
        ${renderLine('Cellulare', r.cellulari)}
        ${renderLine('Email', r.email)}
        ${renderLine('PEC', r.pec)}
        ${renderLine('Indirizzo', r.indirizzo)}
      </div>
    `;
  }


  // ─── Mount / Unmount ──────────────────────────────────────────────────────────

  function mount() {
    if (typeof kernel === 'undefined') return;

    // Intercetta tutte le risposte, ma processa solo quelle sulla rotta soggetti.
    // In questo modo l'indice si arricchisce automaticamente man mano che l'utente
    // naviga Datasurf, senza richiedere azioni manuali.
    fetchListenerId = kernel.onFetch(/./, (url, data) => {
      if (!ROUTE_SOGGETTI.test(location.pathname + location.search + location.hash)) return;
      processData(url, data);
    });

    // Stessi selettori del CER filter: elementi specifici del contenuto,
    // mai 'main', 'body' o classi generiche che matchano il nav Angular.
    const selettore = ['nz-card-head', '.mat-card-header', '[class*="page-header"]', 'nz-table', 'table'].join(', ');
    stopObserver = kernel.waitForElement(selettore, el => {
      mountWidget(el);
      scanDomRows();
    });
  }

  function unmount() {
    if (typeof kernel !== 'undefined' && fetchListenerId !== null) kernel.offFetch(fetchListenerId);
    fetchListenerId = null;
    if (stopObserver) stopObserver();
    stopObserver = null;
    removeWidget();
    lastInput = '';
  }


  // ─── Debug ────────────────────────────────────────────────────────────────────

  window.__DSSOGG_DEBUG__ = {
    version: VERSION,
    size:   () => STORE.size,
    all:    () => Array.from(STORE.values()),
    cerca:  q  => search(q),
    nomi:   () => Array.from(STORE.values()).map(r => r.nome).filter(Boolean).sort(),
    reset:  () => { STORE.clear(); updateStatus(); renderResults(); }
  };


  // ─── Registrazione sul kernel ─────────────────────────────────────────────────

  const descriptor = { urlPattern: ROUTE_SOGGETTI, mount, unmount };

  if (typeof kernel !== 'undefined') {
    kernel.registerFeature(descriptor);
  } else {
    window.__dsextPendingRegistrations = window.__dsextPendingRegistrations || [];
    window.__dsextPendingRegistrations.push(descriptor);
  }

})();
