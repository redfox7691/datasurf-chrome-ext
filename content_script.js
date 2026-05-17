// content_script.js
// Kernel dell'estensione: SPA router, fetch interceptor, MutationObserver helper,
// feature registry. Gira nel main world (dichiarato in manifest.json).
//
// Ordine di caricamento garantito dal manifest:
//   1. pericolosi_cer.js  → definisce CER_PERICOLOSI (globale)
//   2. features/cer_filter.js → chiama kernel.registerFeature(...)
//   3. content_script.js  → costruisce il kernel e attiva il routing
//
// Nessun import/export: tutto è globale nel main world.

const kernel = (() => {

  // ─── Stato interno ───────────────────────────────────────────────────────────

  // Lista di feature registrate: { urlPattern, mount, unmount }
  const featureRegistry = [];

  // Feature attualmente montate (sottoinsieme di featureRegistry)
  const featuresAttive = [];

  // Listener fetch: { pattern, callback, id }
  const fetchListeners = [];
  let fetchListenerIdCounter = 0;

  // Override originale di fetch (salvato prima di qualsiasi modifica)
  const _fetchOriginale = window.fetch;


  // ─── Fetch interceptor ───────────────────────────────────────────────────────

  // Sostituiamo window.fetch con una versione che notifica tutti i listener
  // registrati. La risposta originale viene restituita intatta ad Angular:
  // l'estensione NON modifica mai i dati in transito verso l'app.
  window.fetch = async function (...args) {
    const response = await _fetchOriginale.apply(this, args);

    // Estrae l'URL dalla richiesta (stringa o Request object)
    const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';

    // Notifica tutti i listener che matchano l'URL (in modo asincrono,
    // clonando la risposta per non consumare il body usato da Angular)
    if (fetchListeners.length > 0) {
      const clone = response.clone();
      clone.json().then(data => {
        fetchListeners.forEach(listener => {
          if (_urlMatchaPattern(url, listener.pattern)) {
            try {
              listener.callback(url, data);
            } catch (err) {
              console.warn('[dsext] errore in fetch listener:', err);
            }
          }
        });
      }).catch(() => {
        // Ignora le risposte non-JSON (es. risorse statiche)
      });
    }

    return response; // risposta originale intatta per Angular
  };


  // ─── XHR interceptor ─────────────────────────────────────────────────────────

  // Angular usa XMLHttpRequest tramite Zone.js, non fetch.
  // Patchiamo il prototipo prima che Zone.js lo faccia (run_at: document_start),
  // così Zone.js salva la nostra versione come "originale" e la chiama comunque.

  const _XHROpen = XMLHttpRequest.prototype.open;
  const _XHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (metodo, url) {
    this._dsextUrl = typeof url === 'string' ? url : String(url);
    return _XHROpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    if (this._dsextUrl && fetchListeners.length > 0) {
      const url = this._dsextUrl;
      this.addEventListener('load', function () {
        if (!fetchListeners.some(l => _urlMatchaPattern(url, l.pattern))) return;
        try {
          const data = JSON.parse(this.responseText);
          fetchListeners.forEach(l => {
            if (_urlMatchaPattern(url, l.pattern)) {
              try { l.callback(url, data); } catch (e) { console.warn('[dsext] errore listener XHR:', e); }
            }
          });
        } catch (_) {
          // risposta non JSON, ignora
        }
      });
    }
    return _XHRSend.apply(this, arguments);
  };


  // ─── SPA Router ──────────────────────────────────────────────────────────────

  // Intercetta la navigazione SPA di Angular (pushState / replaceState / popstate)
  // e aggiorna le feature attive ad ogni cambio rotta.

  function _patchHistoryMethod(nomeMetodo) {
    const originale = history[nomeMetodo];
    history[nomeMetodo] = function (...args) {
      const risultato = originale.apply(this, args);
      // Dopo la chiamata originale, location.pathname è già aggiornato
      _gestisciCambioRotta();
      return risultato;
    };
  }

  _patchHistoryMethod('pushState');
  _patchHistoryMethod('replaceState');

  window.addEventListener('popstate', () => _gestisciCambioRotta());

  function _gestisciCambioRotta() {
    const percorsoCorrente = location.pathname;

    // Smonta le feature attive che non corrispondono più alla rotta corrente
    for (let i = featuresAttive.length - 1; i >= 0; i--) {
      const feature = featuresAttive[i];
      if (!_urlMatchaPattern(percorsoCorrente, feature.urlPattern)) {
        try {
          feature.unmount();
        } catch (err) {
          console.warn('[dsext] errore in unmount feature:', err);
        }
        featuresAttive.splice(i, 1);
      }
    }

    // Monta le feature registrate che matchano la rotta corrente
    // e non sono già attive
    featureRegistry.forEach(feature => {
      const giàAttiva = featuresAttive.some(f => f === feature);
      if (!giàAttiva && _urlMatchaPattern(percorsoCorrente, feature.urlPattern)) {
        try {
          feature.mount();
          featuresAttive.push(feature);
        } catch (err) {
          console.warn('[dsext] errore in mount feature:', err);
        }
      }
    });
  }


  // ─── MutationObserver helper ─────────────────────────────────────────────────

  // Aspetta che il selettore CSS appaia nel DOM, poi chiama callback.
  // Se options.persistente = true, continua a osservare (chiama callback
  // ogni volta che l'elemento appare, es. dopo navigazione SPA).
  //
  // Restituisce una funzione stop() per interrompere l'osservazione manualmente.
  function waitForElement(selettore, callback, opzioni) {
    const opts = opzioni || {};
    const persistente = opts.persistente === true;

    // Controlla subito se l'elemento è già nel DOM
    const elementoPresente = document.querySelector(selettore);
    if (elementoPresente) {
      callback(elementoPresente);
      if (!persistente) return _noop;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selettore);
      if (el) {
        callback(el);
        if (!persistente) {
          observer.disconnect();
        }
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }


  // ─── Feature registry ─────────────────────────────────────────────────────────

  // Registra una feature. Viene chiamato prima che il kernel venga costruito
  // (la feature registry viene popolata da features/cer_filter.js durante
  // la fase di parsing, prima che il kernel esegua la prima route detection).
  //
  // { urlPattern: string|RegExp, mount: fn, unmount: fn }
  function registerFeature(descriptor) {
    featureRegistry.push(descriptor);
  }


  // ─── Fetch listener API ───────────────────────────────────────────────────────

  // Registra un listener per risposte fetch che matchano urlPattern.
  // Restituisce un id numerico per deregistrare con offFetch().
  function onFetch(urlPattern, callback) {
    const id = ++fetchListenerIdCounter;
    fetchListeners.push({ pattern: urlPattern, callback, id });
    return id;
  }

  // Rimuove un listener fetch tramite l'id restituito da onFetch().
  function offFetch(id) {
    const idx = fetchListeners.findIndex(l => l.id === id);
    if (idx !== -1) fetchListeners.splice(idx, 1);
  }


  // ─── Utility ──────────────────────────────────────────────────────────────────

  function _urlMatchaPattern(url, pattern) {
    if (pattern instanceof RegExp) return pattern.test(url);
    return url.includes(pattern);
  }

  function _noop() {}


  // ─── Svuota la coda registrazioni pendenti ───────────────────────────────────

  // features/cer_filter.js viene caricato PRIMA di questo file (ordine manifest),
  // quindi non può chiamare kernel.registerFeature() direttamente.
  // Usa window.__dsextPendingRegistrations come coda: la svuotiamo ora,
  // subito dopo la costruzione del kernel, prima di fare il primo routing.
  (window.__dsextPendingRegistrations || []).forEach(descriptor => {
    featureRegistry.push(descriptor);
  });
  window.__dsextPendingRegistrations = [];


  // ─── Avvio: prima route detection ────────────────────────────────────────────

  // Aspettiamo che il DOM sia pronto prima di fare il primo routing,
  // così le feature possono usare waitForElement senza problemi.
  // (document_start: DOM non ancora pronto → usiamo DOMContentLoaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _gestisciCambioRotta);
  } else {
    _gestisciCambioRotta();
  }


  // ─── API pubblica ─────────────────────────────────────────────────────────────

  return {
    registerFeature,
    onFetch,
    offFetch,
    waitForElement,
  };

})();
