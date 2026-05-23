// features/soggetti_lookup.js
// Feature: campo di ricerca rapida soggetti per le pagine anagrafiche di Datasurf.
//
// Funzionamento: il widget è una scorciatoia per il filtro nativo di Datasurf
// (bottone "Filtra" → campo "Codice, ragione sociale, email o partita iva").
// Quando l'utente preme Invio o clicca "Cerca":
//   - apre il pannello Filtra di Datasurf (se non è già aperto)
//   - compila il campo di ricerca con il testo inserito
//   - clicca il bottone di conferma del filtro
// Intercetta la risposta API:
//   - 1 risultato  → clicca automaticamente Edit sulla riga
//   - N risultati  → lascia la lista filtrata (Datasurf gestisce già la visualizzazione)
//
// Dipende da: kernel (globale, definito in content_script.js)

(function () {
  'use strict';

  const ROUTE_SOGGETTI = /(soggett|anagrafic|subject|clienti|cliente|fornitori|fornitore|customer|supplier|contact|contatt|partner)/i;

  let fetchListenerId = null;
  let stopObserver    = null;
  let cercaPending    = false;


  // ─── Trigger del filtro nativo Datasurf ───────────────────────────────────

  function cerca(testo) {
    testo = (testo || '').trim();
    if (!testo) return;
    cercaPending = true;

    if (isPannelloFiltroAperto()) {
      compilaEInvia(testo);
    } else {
      const btnFiltra = trovaBtnFiltra();
      if (!btnFiltra) { cercaPending = false; return; }
      btnFiltra.click();
      setTimeout(() => compilaEInvia(testo), 350);
    }
  }

  function compilaEInvia(testo) {
    const input = trovaInputFiltro();
    if (!input) { cercaPending = false; return; }

    // Imposta il valore in modo che Angular riconosca la modifica tramite ngModel
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, testo);
    input.dispatchEvent(new Event('input',  { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.focus();

    setTimeout(() => {
      const btnCerca = trovaBtnCercaFiltro();
      if (btnCerca) {
        btnCerca.click();
      } else {
        // Fallback: invia con Invio sull'input
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      }
    }, 150);
  }

  function isPannelloFiltroAperto() {
    return !!document.querySelector('nz-drawer.ant-drawer-open, .ant-drawer-open');
  }

  function trovaBtnFiltra() {
    // Il bottone che apre il drawer sta dentro .ant-badge nella toolbar
    return document.querySelector('.ant-badge button')
        || Array.from(document.querySelectorAll('button'))
             .find(b => b.textContent.trim() === 'Filtra' && b.offsetParent !== null);
  }

  function trovaInputFiltro() {
    // Input visibile nel pannello filtro, esclude il nostro campo
    const candidati = Array.from(document.querySelectorAll('input[type="text"], input:not([type])'))
      .filter(el => el.id !== 'dssogg-input' && el.offsetParent !== null);

    // Prima priorità: input con placeholder del campo "Codice, ragione sociale..."
    const perPlaceholder = candidati.find(el =>
      /ragione|partita.*iva/i.test(el.placeholder || '')
    );
    if (perPlaceholder) return perPlaceholder;

    // Fallback: secondo input visibile nel drawer (il primo è "ID")
    const nelDrawer = candidati.filter(el =>
      el.closest('nz-drawer, .ant-drawer-body, .ant-drawer-content-wrapper')
    );
    return nelDrawer[1] || nelDrawer[0] || null;
  }

  function trovaBtnCercaFiltro() {
    // I bottoni del drawer sono nel DOM globale (CDK overlay), non dentro nz-drawer.
    // Il "Filtra" che apre il drawer sta dentro .ant-badge; quello che invia il filtro no.
    const tutti = Array.from(document.querySelectorAll('button'))
      .filter(b => b.offsetParent !== null && /^filtra$/i.test(b.textContent.trim()));
    return tutti.find(b => !b.closest('.ant-badge')) || null;
  }


  // ─── Intercettazione risposta API ─────────────────────────────────────────

  function onClientiFetch(url, data) {
    if (!cercaPending) return;
    // La risposta del filtro clienti ha sempre il campo "found"
    if (!data || !data.res || data.found == null) return;

    cercaPending = false;

    if (data.found === 1 && Array.isArray(data.data) && data.data.length === 1) {
      // Unico risultato: apre direttamente l'edit cliccando il bottone nella riga
      setTimeout(clickEditPrimaRiga, 500);
    }
    // Più risultati o zero: Datasurf mostra la lista — non serve fare nulla
  }

  function clickEditPrimaRiga() {
    const righe = document.querySelectorAll('table tbody tr');
    let editBtn = null;
    for (const riga of righe) {
      editBtn = Array.from(riga.querySelectorAll('button, a'))
        .find(el => /^edit$/i.test(el.textContent.trim()));
      if (editBtn) break;
    }
    if (!editBtn) return;

    // Rimuove il filtro prima di navigare: Angular resetta il proprio stato
    // sincronamente, così quando l'utente torna alla lista non trova il filtro attivo.
    const btnRimuovi = Array.from(document.querySelectorAll('button'))
      .find(b => b.offsetParent !== null && /^rimuovi filtri$/i.test(b.textContent.trim()));
    if (btnRimuovi) btnRimuovi.click();

    editBtn.click();
  }


  // ─── Widget ───────────────────────────────────────────────────────────────

  function mountWidget(target) {
    if (document.getElementById('dssogg-card')) return;

    const widget = document.createElement('div');
    widget.id = 'dssogg-card';
    widget.innerHTML = `
      <div class="dssogg-title">Consulta Soggetto</div>
      <div class="dssogg-row">
        <input id="dssogg-input" class="dssogg-input" type="text"
               placeholder="Ragione sociale, P.IVA, CF o email" autocomplete="off">
        <button id="dssogg-cerca" class="dssogg-btn" type="button">Cerca</button>
      </div>
    `;

    const input  = widget.querySelector('#dssogg-input');
    const btnCerca = widget.querySelector('#dssogg-cerca');

    input.addEventListener('keydown', ev => {
      ev.stopPropagation();
      if (ev.key === 'Enter') { ev.preventDefault(); cerca(input.value); }
    });
    input.addEventListener('click', ev => ev.stopPropagation());
    btnCerca.addEventListener('click', ev => {
      ev.preventDefault(); ev.stopPropagation();
      cerca(input.value);
    });

    // Pattern di iniezione standard (identico al CER filter)
    const contenitore = target.closest('nz-card, mat-card, .card, [class*="toolbar"], .list-header')
                     || target.parentElement;
    if (contenitore) {
      contenitore.insertBefore(widget, contenitore.firstChild);
    } else {
      target.parentElement.insertBefore(widget, target);
    }
  }

  function removeWidget() {
    const w = document.getElementById('dssogg-card');
    if (w) w.remove();
  }


  // ─── Mount / Unmount ──────────────────────────────────────────────────────

  function mount() {
    if (typeof kernel === 'undefined') return;

    fetchListenerId = kernel.onFetch('anagrafica/clienti', (url, data) => {
      if (!ROUTE_SOGGETTI.test(location.pathname)) return;
      onClientiFetch(url, data);
    });

    const selettore = ['nz-card-head', '.mat-card-header', '[class*="page-header"]', 'nz-table', 'table'].join(', ');
    // persistente: true → re-inietta il widget ogni volta che Angular ri-renderizza la pagina
    stopObserver = kernel.waitForElement(selettore, el => mountWidget(el), { persistente: true });
  }

  function unmount() {
    if (typeof kernel !== 'undefined' && fetchListenerId !== null) kernel.offFetch(fetchListenerId);
    fetchListenerId = null;
    if (stopObserver) stopObserver();
    stopObserver = null;
    removeWidget();
    cercaPending = false;
  }


  // ─── Registrazione sul kernel ─────────────────────────────────────────────

  const descriptor = { urlPattern: ROUTE_SOGGETTI, mount, unmount };

  if (typeof kernel !== 'undefined') {
    kernel.registerFeature(descriptor);
  } else {
    window.__dsextPendingRegistrations = window.__dsextPendingRegistrations || [];
    window.__dsextPendingRegistrations.push(descriptor);
  }

})();
