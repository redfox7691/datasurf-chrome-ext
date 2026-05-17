# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Progetto: Datasurf CER Filter — Chrome Extension

Estensione Chrome per aggiungere un filtro **Pericoloso / Non Pericoloso / Tutti** all'anagrafica rifiuti di Datasurf (`https://app.datasurf.it/apps/rifiuti/products`), senza toccare il codice di Datasurf.

Cliente: **IoRecupero (Massimo Grillini)**. Datasurf è un SaaS di terze parti (Digibit) senza accesso al sorgente. L'estensione è un applicativo verticale di proprietà di IoRecupero.

## Stack

- Chrome Extension **Manifest V3** (MV3)
- Vanilla JS, nessun framework, nessun bundler, nessun npm
- Distribuzione: `.crx` firmato o modalità sviluppatore (no Chrome Web Store)

## Sviluppo e distribuzione

Nessun build step. Il codice viene caricato direttamente in Chrome:

```
chrome://extensions → Modalità sviluppatore ON → "Carica estensione non pacchettizzata" → seleziona la directory
```

Dopo ogni modifica ai file JS/CSS: tasto **Ricarica** sull'estensione in `chrome://extensions`, poi ricaricare la pagina Datasurf.

Per distribuire: `chrome://extensions → Pacchetta estensione` → genera `.crx` + chiave privata `.pem` (conservare la chiave per aggiornamenti futuri).

Non esistono test automatici né linter configurati.

## Architettura

### Come funziona Datasurf (target)

- SPA Angular (versione da determinare; verificare con `ng.version` in DevTools console)
- Tutto il rendering è JS-side; il server non invia HTML precompilato
- Lista rifiuti paginata server-side: 10 record/pagina, ~44 pagine (~439 record totali)
- Endpoint: `GET https://app.datasurf.it/apps/rifiuti/products` con parametri di paginazione

Campi rilevanti per ogni record in `data[]`:
```json
{
  "codice": "030104",
  "sku": "040222_CAMPIONARI",
  "codice_famiglia": "030104",
  "descrizione": "...",
  "annullato": 0
}
```

Datasurf normalizza i codici CER **rimuovendo l'asterisco**. La pericolosità non è un campo JSON: va determinata tramite lookup table.

### Vincolo critico: main world injection

Il content script deve girare nel **main world** (non nell'isolated world predefinito di MV3), perché Angular usa il `fetch` del `window` originale. Configurazione necessaria nel manifest:

```json
"content_scripts": [{
  "world": "MAIN",
  "run_at": "document_start",
  "js": ["pericolosi_cer.js", "content_script.js"]
}]
```

`run_at: document_start` è obbligatorio per fare l'override di `window.fetch` prima che Angular lo chiami.

### Pattern intercettazione fetch

```javascript
const _fetch = window.fetch;
window.fetch = async function(...args) {
  const response = await _fetch.apply(this, args);
  const url = typeof args[0] === 'string' ? args[0] : args[0].url;
  if (url.includes('/apps/rifiuti/products')) {
    response.clone().json().then(data => {
      window.__cerData = data;
      applyCurrentFilter();
    });
  }
  return response; // restituisce la risposta originale intatta ad Angular
};
```

La risposta NON va mai modificata prima di restituirla ad Angular (requisito non funzionale).

### Iniezione widget nel DOM

Angular aggiorna il DOM in modo asincrono: usare `MutationObserver` per aspettare che la toolbar della lista sia renderizzata, poi iniettare il selettore una sola volta (controllare se già presente per idempotenza).

### Logica pericolosità

```javascript
const codiceBase = record.codice_famiglia || record.codice.split('_')[0];
const isPericoloso = CER_PERICOLOSI.has(codiceBase);
```

### Caveat: virtual scroll Angular

Se Datasurf usa virtual scroll (solo N righe nel DOM), il filtro DOM diretto non funziona. In quel caso bisogna restituire una `Response` modificata (filtrata) al posto dell'originale — cambia il pattern fetch sopra. Verificare aprendo DevTools → Elements e scorrendo la lista.

### Lookup table CER pericolosi (`pericolosi_cer.js`)

`Set` globale con tutti i codici CER pericolosi (CER 2002, D.Lgs. 152/2006 All. D Parte IV), senza asterisco, per matchare il formato Datasurf. La lista è normativa e stabile (~400 codici). Va popolata completamente prima del deploy.

Non usare `chrome.storage` per questa lookup table: è statica, va nel JS bundlato.

## Requisiti non funzionali

- L'estensione non modifica mai i dati inviati da/verso Datasurf
- Nessuna richiesta di rete aggiuntiva (tutto offline dopo il caricamento)
- Chrome 110+ (MV3 stabile)
