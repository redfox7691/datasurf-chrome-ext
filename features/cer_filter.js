// features/cer_filter.js
// Feature: filtro Pericoloso / Non Pericoloso / Tutti per l'anagrafica rifiuti di Datasurf.
//
// Si registra sul kernel per la rotta /apps/rifiuti/products.
// Gira nel main world (dichiarato in manifest.json) — nessun import/export.
//
// Dipende da:
//   - CER_PERICOLOSI  (globale, definito in pericolosi_cer.js)
//   - kernel          (globale, definito in content_script.js)
//
// NOTA SULL'ORDINE DI CARICAMENTO:
// Il manifest carica: pericolosi_cer.js → features/cer_filter.js → content_script.js
// Questo file chiama kernel.registerFeature() in coda microtask (dopo DOMContentLoaded),
// ma poiché content_script.js fa il primo routing anch'esso su DOMContentLoaded,
// usiamo un trick: definiamo la feature in una variabile globale __cerFilterFeature
// e la registriamo in fondo a questo file; il kernel viene costruito dopo,
// ma kernel.registerFeature è chiamata subito dopo la costruzione del kernel
// (content_script.js usa un IIFE, quindi kernel è già disponibile quando
// il parser finisce di eseguire content_script.js).
// In realtà l'ordine di parsing è: 1→2→3, quindi quando features/cer_filter.js
// viene parsato, `kernel` non esiste ancora. Usiamo un array globale di callback
// __dsextPendingRegistrations che content_script.js scarica dopo aver costruito kernel.
//
// ALTERNATIVA PIÙ SEMPLICE (implementata qui):
// Usiamo window.__dsextPendingRegistrations come coda. Il kernel la svuota
// subito dopo la propria costruzione. Se il kernel non è ancora pronto,
// le registrazioni vengono messe in coda.

// ─── Stato locale della feature ──────────────────────────────────────────────

// Filtro corrente: 'tutti' | 'pericolosi' | 'non_pericolosi'
let _filtroCorrente = 'tutti';

// ID del listener fetch (per deregistrazione in unmount)
let _fetchListenerId = null;

// Funzione per fermare il MutationObserver del widget
let _stopWidgetObserver = null;


// ─── Logica pericolosità ──────────────────────────────────────────────────────

function _isPericoloso(record) {
  // Usa codice_famiglia se presente, altrimenti prende la parte prima di '_'
  // (Datasurf usa suffissi aziendali tipo "040222_CAMPIONARI")
  const codiceBase = (record.codice_famiglia || record.codice || '').split('_')[0].trim();
  return CER_PERICOLOSI.has(codiceBase);
}


// ─── Applicazione del filtro ──────────────────────────────────────────────────

// FLAG: impostare a true manualmente in DevTools se Datasurf usa virtual scroll
// (verificare aprendo DevTools → Elements: se scorrendo la lista le <tr>
// spariscono e vengono ricreate, Angular usa virtual scroll e il filtro DOM
// diretto non funziona — in quel caso serve il filtro sulla Response JSON).
//
// Come attivare il virtual scroll mode:
//   1. Apri DevTools su app.datasurf.it/apps/rifiuti/products
//   2. Vai in Console
//   3. Digita: window.__cerVirtualScroll = true
//   4. Ricarica la pagina (il filtro userà la strategia JSON invece di DOM)
window.__cerVirtualScroll = false;

function applyFilter() {
  if (window.__cerVirtualScroll) {
    _applyFilterVirtualScroll();
  } else {
    _applyFilterDOM();
  }
}

// Strategia 1: filtro DOM diretto (default)
// Scorre le righe <tr> della tabella e nasconde/mostra quelle che
// non corrispondono al filtro corrente, confrontando il testo delle celle
// con il codice CER presente nei dati.
function _applyFilterDOM() {
  const dati = window.__cerData && window.__cerData.data;
  if (!dati || !Array.isArray(dati)) return;

  // Costruisce una mappa codice → isPericoloso per lookup rapida
  const mappaPeriodiclosita = new Map();
  dati.forEach(record => {
    const codiceBase = (record.codice_famiglia || record.codice || '').split('_')[0].trim();
    mappaPeriodiclosita.set(codiceBase, _isPericoloso(record));
    // Aggiunge anche il codice con eventuale suffisso per match più ampio
    if (record.codice) mappaPeriodiclosita.set(record.codice, _isPericoloso(record));
    if (record.sku)    mappaPeriodiclosita.set(record.sku,    _isPericoloso(record));
  });

  // Seleziona tutte le righe della tabella (esclude header)
  const righe = document.querySelectorAll('table tbody tr');
  if (righe.length === 0) return;

  righe.forEach(riga => {
    if (_filtroCorrente === 'tutti') {
      riga.style.display = '';
      return;
    }

    // Cerca il codice CER nel testo delle celle della riga
    let codiceRiga = null;
    const celle = riga.querySelectorAll('td');
    for (const cella of celle) {
      const testo = cella.textContent.trim();
      // I codici CER sono 6 cifre, eventualmente con suffisso alfanumerico
      const match = testo.match(/^(\d{6})(?:_[A-Z0-9_]+)?$/);
      if (match) {
        codiceRiga = testo;
        break;
      }
    }

    if (codiceRiga === null) {
      // Riga senza codice CER (es. articoli generici): visibile solo con "Tutti"
      riga.style.display = _filtroCorrente === 'tutti' ? '' : 'none';
      return;
    }

    // Normalizza: prende solo i 6 digit base per il lookup
    const codiceBase = codiceRiga.split('_')[0];
    const pericoloso = mappaPeriodiclosita.get(codiceBase)
                    ?? mappaPeriodiclosita.get(codiceRiga)
                    ?? false;

    let visibile = false;
    if (_filtroCorrente === 'pericolosi')     visibile = pericoloso;
    if (_filtroCorrente === 'non_pericolosi') visibile = !pericoloso;

    riga.style.display = visibile ? '' : 'none';
  });
}

// Strategia 2: filtro sulla Response JSON (virtual scroll)
// Modifica window.__cerData.data in-place, filtrando i record, poi
// tenta di forzare un aggiornamento Angular tramite click sul paginatore
// (approccio minimale senza accedere a internals Angular).
//
// NOTA: questa strategia è più invasiva perché altera i dati già ricevuti.
// Dopo unmount, i dati originali sono persi fino al prossimo fetch.
// Per un'implementazione più robusta si potrebbe salvare una copia in
// window.__cerDataOriginale prima di modificare.
function _applyFilterVirtualScroll() {
  if (!window.__cerDataOriginale && window.__cerData && window.__cerData.data) {
    // Prima applicazione: salva copia dei dati originali
    window.__cerDataOriginale = JSON.parse(JSON.stringify(window.__cerData));
  }

  const datiOriginali = window.__cerDataOriginale && window.__cerDataOriginale.data;
  if (!datiOriginali) return;

  let datiScelti;
  if (_filtroCorrente === 'tutti') {
    datiScelti = datiOriginali;
  } else if (_filtroCorrente === 'pericolosi') {
    datiScelti = datiOriginali.filter(r => _isPericoloso(r));
  } else {
    datiScelti = datiOriginali.filter(r => !_isPericoloso(r));
  }

  // Sostituisce i dati in-place (Angular osserva questo array)
  if (window.__cerData) {
    window.__cerData.data = datiScelti;
    window.__cerData.total = datiScelti.length;
  }

  // Tenta un re-render forzato: Angular dovrebbe rileggere i dati
  // quando cambia la paginazione. Simuliamo un evento sulla pagina corrente
  // per triggerare il change detection (approccio empirico — potrebbe
  // richiedere aggiustamenti dopo verifica in produzione).
  const paginatore = document.querySelector('.mat-paginator, nz-pagination, [class*="paginator"]');
  if (paginatore) {
    paginatore.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Fallback: notifica generica di cambiamento DOM
  document.dispatchEvent(new CustomEvent('dsext:filtro-applicato', {
    detail: { filtro: _filtroCorrente, totale: datiScelti.length }
  }));
}


// ─── Widget filtro ────────────────────────────────────────────────────────────

// Crea e inietta il widget con i tre bottoni nella toolbar di Datasurf.
// Idempotente: controlla se il widget è già presente prima di inserirlo.
function _iniettaWidget(elementoTarget) {
  if (document.getElementById('dsext-filtro-cer')) return; // già presente

  const widget = document.createElement('div');
  widget.id = 'dsext-filtro-cer';
  widget.className = 'dsext-widget';
  widget.setAttribute('role', 'group');
  widget.setAttribute('aria-label', 'Filtro pericolosità CER');

  widget.innerHTML = `
    <span class="dsext-label">Filtro CER:</span>
    <button class="dsext-btn dsext-btn--attivo" data-filtro="tutti">Tutti</button>
    <button class="dsext-btn" data-filtro="pericolosi">Pericolosi</button>
    <button class="dsext-btn" data-filtro="non_pericolosi">Non pericolosi</button>
  `;

  // Gestione click sui bottoni
  widget.addEventListener('click', evento => {
    const bottone = evento.target.closest('[data-filtro]');
    if (!bottone) return;

    const nuovoFiltro = bottone.dataset.filtro;
    if (nuovoFiltro === _filtroCorrente) return;

    _filtroCorrente = nuovoFiltro;

    // Aggiorna stato attivo visivo
    widget.querySelectorAll('.dsext-btn').forEach(b => {
      b.classList.toggle('dsext-btn--attivo', b.dataset.filtro === _filtroCorrente);
    });

    applyFilter();
  });

  // Inserisce il widget nel DOM: prova a metterlo prima dell'elemento target,
  // o come primo figlio del contenitore padre
  const contenitore = elementoTarget.closest('nz-card, mat-card, .card, [class*="toolbar"], .list-header')
                   || elementoTarget.parentElement;
  if (contenitore) {
    contenitore.insertBefore(widget, contenitore.firstChild);
  } else {
    elementoTarget.parentElement.insertBefore(widget, elementoTarget);
  }
}

// Rimuove il widget dal DOM
function _rimuoviWidget() {
  const widget = document.getElementById('dsext-filtro-cer');
  if (widget) widget.remove();
}


// ─── Mount / Unmount ──────────────────────────────────────────────────────────

function mount() {
  // 1. Registra listener fetch per salvare i dati e applicare il filtro.
  // L'API reale è su v2.srvrhive.com/api/service/anagrafica/articoli/ (POST).
  // La stessa URL viene usata per chiamate diverse: filtriamo solo la risposta
  // che contiene la lista principale (ha 'records' numerico e 'data' come array
  // di oggetti con il campo 'codice_famiglia').
  _fetchListenerId = kernel.onFetch('anagrafica/articoli', (url, data) => {
    if (!data || !Array.isArray(data.data) || data.data.length === 0) return;
    if (!('codice_famiglia' in data.data[0])) return;
    window.__cerData = data;
    // Resetta la copia dei dati originali (nuova pagina o nuovo fetch)
    window.__cerDataOriginale = null;
    applyFilter();
  });

  // 2. Aspetta che la toolbar/intestazione della lista sia nel DOM
  //    e inietta il widget. Il selettore è empirico e potrebbe richiedere
  //    aggiustamenti dopo verifica su app.datasurf.it.
  //    Candidati comuni in Angular Material / NG Zorro:
  //      - 'nz-card-head'       (NG Zorro card header)
  //      - '.mat-toolbar'       (Angular Material toolbar)
  //      - '[class*="header"]'  (classe generica)
  //      - 'nz-table'           (tabella NG Zorro — fallback)
  const selettoreToolbar = [
    'nz-card-head',
    '.mat-card-header',
    '[class*="page-header"]',
    'nz-table',
    'table',
  ].join(', ');

  _stopWidgetObserver = kernel.waitForElement(selettoreToolbar, (elemento) => {
    _iniettaWidget(elemento);
    // Dopo aver iniettato il widget, applica il filtro se ci sono già dati
    if (window.__cerData) applyFilter();
  });
}

function unmount() {
  // Rimuove il listener fetch
  if (_fetchListenerId !== null) {
    kernel.offFetch(_fetchListenerId);
    _fetchListenerId = null;
  }

  // Ferma l'osservatore del widget
  if (_stopWidgetObserver) {
    _stopWidgetObserver();
    _stopWidgetObserver = null;
  }

  // Rimuove il widget dal DOM
  _rimuoviWidget();

  // Ripristina i dati originali se siamo in modalità virtual scroll
  if (window.__cerVirtualScroll && window.__cerDataOriginale && window.__cerData) {
    window.__cerData.data = window.__cerDataOriginale.data;
    window.__cerData.total = window.__cerDataOriginale.total;
    window.__cerDataOriginale = null;
  }

  // Resetta il filtro al default
  _filtroCorrente = 'tutti';
}


// ─── Registrazione sul kernel ─────────────────────────────────────────────────

// Poiché questo file viene caricato PRIMA di content_script.js (che costruisce
// il kernel), usiamo una coda globale. Il kernel la svuota subito dopo la
// propria costruzione (vedi content_script.js).
//
// Se il kernel è già disponibile (caso raro — es. hot reload), registriamo subito.
if (typeof kernel !== 'undefined') {
  kernel.registerFeature({
    urlPattern: '/apps/rifiuti/products',
    mount,
    unmount,
  });
} else {
  // Coda di registrazioni pendenti: content_script.js la svuoterà
  window.__dsextPendingRegistrations = window.__dsextPendingRegistrations || [];
  window.__dsextPendingRegistrations.push({
    urlPattern: '/apps/rifiuti/products',
    mount,
    unmount,
  });
}
