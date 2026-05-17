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

- SPA Angular con Zone.js. Rotta frontend: `https://app.datasurf.it/apps/rifiuti/products`
- Tutto il rendering è JS-side; il server non invia HTML precompilato
- Lista rifiuti paginata server-side: 10 record/pagina, ~44 pagine (~439 record totali)

**API reale** (scoperta da analisi HAR): `POST https://v2.srvrhive.com/api/service/anagrafica/articoli/`  
Non è l'URL della SPA — è un endpoint separato sul backend `v2.srvrhive.com`.

Struttura risposta:
```json
{
  "res": true,
  "records": 439,
  "data": [
    {
      "id": "1182",
      "codice": "020104",
      "codice_famiglia": "020104",
      "sku": "020104",
      "descrizione": "rifiuti plastici (ad esclusione degli imballaggi)",
      "annullato": 0
    }
  ]
}
```

Gli articoli senza codice CER (es. attrezzature, arredi) hanno `codice_famiglia: null` e `codice` non numerico. Vanno nascosti nei filtri Pericolosi/Non pericolosi e mostrati solo con "Tutti".

Datasurf normalizza i codici CER **rimuovendo l'asterisco**. La pericolosità non è un campo JSON: va determinata tramite lookup table.

### Vincolo critico: main world + intercettazione XHR

Il content script deve girare nel **main world** (`"world": "MAIN"`, `"run_at": "document_start"`).

**Angular usa `XMLHttpRequest` tramite Zone.js, non `fetch`.**  
Il kernel intercetta entrambi (`window.fetch` e `XMLHttpRequest.prototype`), ma in pratica solo XHR viene usato. Il patch XHR deve avvenire prima che Zone.js carichi (garantito da `document_start`): Zone.js salva la nostra versione patchata come "originale" e la chiama regolarmente.

Il listener delle feature si registra con pattern sull'URL API (es. `'anagrafica/articoli'`), non sull'URL della SPA.

### Iniezione widget nel DOM

Angular aggiorna il DOM in modo asincrono: `MutationObserver` aspetta che la toolbar sia renderizzata, poi inietta il widget una sola volta (idempotente). Il selettore toolbar è empirico (`nz-card-head, .mat-card-header, ...`): verificare in DevTools se cambia con aggiornamenti di Datasurf.

### Logica pericolosità

```javascript
const codiceBase = (record.codice_famiglia || record.codice || '').split('_')[0].trim();
const isPericoloso = CER_PERICOLOSI.has(codiceBase);
```

### Caveat: virtual scroll Angular

Se Datasurf usa virtual scroll (solo N righe nel DOM), il filtro DOM diretto non funziona. Attivare con `window.__cerVirtualScroll = true` in Console: la strategia passa a filtro sull'array JSON + tentativo di re-render forzato.

### Lookup table CER pericolosi (`pericolosi_cer.js`)

`Set` globale con tutti i codici CER pericolosi (CER 2002, D.Lgs. 152/2006 All. D Parte IV), senza asterisco, per matchare il formato Datasurf. La lista è normativa e stabile (~400 codici). Va popolata completamente prima del deploy.

Non usare `chrome.storage` per questa lookup table: è statica, va nel JS bundlato.

## Requisiti non funzionali

- L'estensione non modifica mai i dati inviati da/verso Datasurf
- Nessuna richiesta di rete aggiuntiva (tutto offline dopo il caricamento)
- Chrome 110+ (MV3 stabile)
