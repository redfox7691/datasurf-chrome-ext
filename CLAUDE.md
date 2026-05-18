# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Progetto: Estensione Chrome Datasurf per IoRecupero

Estensione Chrome che modifica l'interfaccia di Datasurf (`https://app.datasurf.it`) per venire incontro alle esigenze operative di **Io Recupero SRL**, senza toccare il codice di Datasurf.

Datasurf è un SaaS di terze parti (Digibit) senza accesso al sorgente. L'estensione è un applicativo verticale di proprietà di IoRecupero, sviluppato da Claudio Bizzarri con contributi di Massimo Grillini.

## Stack

- Chrome Extension **Manifest V3** (MV3)
- Vanilla JS, nessun framework, nessun bundler, nessun npm
- Distribuzione: zip in modalità sviluppatore (no Chrome Web Store)

## Sviluppo e distribuzione

Nessun build step. Il codice viene caricato direttamente in Chrome:

```
chrome://extensions → Modalità sviluppatore ON → "Carica estensione non pacchettizzata" → seleziona la directory
```

Dopo ogni modifica: **Ricarica** l'estensione in `chrome://extensions`, poi ricaricare la pagina Datasurf.

Per generare il pacchetto zip da distribuire agli utenti: `./pack.sh`

Non esistono test automatici né linter configurati.

## Versionamento

Schema `MAJOR.MINOR.PATCH` in `manifest.json`:
- **PATCH** (es. 1.2.1): bug fix
- **MINOR** (es. 1.3.0): nuova feature o miglioramento visibile
- **MAJOR**: redesign architetturale

Aggiornare sempre la versione in `manifest.json` prima di distribuire o fare commit finale.

## Architettura: kernel + feature modules

L'estensione usa un pattern **kernel + moduli feature**. Il kernel gestisce infrastruttura condivisa; ogni pagina di Datasurf ha il proprio modulo feature.

```
content_script.js          ← kernel (SPA router, XHR/fetch interceptor, MutationObserver helper)
pericolosi_cer.js          ← lookup table CER pericolosi (Set, ~408 codici)
catalogo_cer.js            ← catalogo CER completo (Map, 842 codici con descrizioni)
features/
  cer_filter.js            ← feature: filtro + card consulta CER (/apps/rifiuti/products)
  soggetti_lookup.js       ← feature: card consulta soggetti (/apps/soggetti/*)
styles.css                 ← tutti gli stili (prefissi dsext-* e dssogg-*)
```

### Aggiungere una nuova feature

1. Creare `features/nuova_feature.js` seguendo il pattern di `cer_filter.js`
2. Aggiungere il file in `manifest.json` prima di `content_script.js`
3. La feature si registra su `window.__dsextPendingRegistrations` con `{ urlPattern, mount, unmount }`
4. Aggiungere gli stili in `styles.css` con prefisso CSS univoco (es. `dsnuova-`)
5. Aggiornare `pack.sh` per includere il nuovo file

### API del kernel (disponibile come globale `kernel`)

```javascript
kernel.registerFeature({ urlPattern, mount, unmount })  // urlPattern: stringa o RegExp
kernel.onFetch(urlPattern, callback)   // → id; callback(url, data) su ogni XHR/fetch JSON
kernel.offFetch(id)                    // deregistra listener
kernel.waitForElement(selector, callback, { persistente: false })  // → stopFn
```

### Come funziona Datasurf (target)

- SPA Angular con Zone.js
- **Angular usa `XMLHttpRequest` tramite Zone.js, non `fetch`** — il kernel intercetta entrambi ma in pratica solo XHR viene usato
- Il patch XHR avviene a `document_start`, prima che Zone.js carichi: Zone.js salva la nostra versione come "originale"
- I listener fetch si registrano sull'URL API (`v2.srvrhive.com`), non sull'URL della SPA

**API rifiuti** (verificata da analisi HAR):
`POST https://v2.srvrhive.com/api/service/anagrafica/articoli/`

Struttura risposta lista rifiuti:
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

Articoli senza CER (es. arredi) hanno `codice_famiglia: null`. Vanno nascosti nei filtri Pericolosi/Non pericolosi.

Datasurf normalizza i codici CER **rimuovendo l'asterisco**. La pericolosità non è un campo JSON: va determinata via `CER_PERICOLOSI`.

### Pattern standard di iniezione widget nel DOM

Angular aggiorna il DOM in modo asincrono: usare `kernel.waitForElement` per aspettare l'elemento, poi iniettare il widget una sola volta (idempotente).

**Selettori da usare** (in ordine di preferenza, dal più specifico):
```javascript
const selettore = [
  'nz-card-head',
  '.mat-card-header',
  '[class*="page-header"]',
  'nz-table',
  'table',
].join(', ');
```

**Non usare mai** `main`, `body`, `[class*="content"]`, `[class*="page"]` come selettori di iniezione: sono troppo generici e matchano componenti di navigazione Angular (la barra blu fissa), causando l'iniezione nel nav invece che nel contenuto.

**Logica del contenitore** (uguale per tutte le feature):
```javascript
const contenitore = elementoTarget.closest('nz-card, mat-card, .card, [class*="toolbar"], .list-header')
                 || elementoTarget.parentElement;
if (contenitore) {
  contenitore.insertBefore(widget, contenitore.firstChild);
} else {
  elementoTarget.parentElement.insertBefore(widget, elementoTarget);
}
```

### Logica pericolosità CER

```javascript
const codiceBase = (record.codice_famiglia || record.codice || '').split('_')[0].trim();
const isPericoloso = CER_PERICOLOSI.has(codiceBase);
```

### Caveat: virtual scroll Angular

Se Datasurf usa virtual scroll (solo N righe nel DOM), il filtro DOM diretto non funziona. Attivare con `window.__cerVirtualScroll = true` in Console per passare alla strategia JSON.

### Lookup table CER (`pericolosi_cer.js`, `catalogo_cer.js`)

Dati normativi stabili (Decisione 2014/955/UE). Modificare solo in caso di aggiornamenti legislativi, documentando la modifica in `VERIFICA_CATALOGO_CER.txt`. Non usare `chrome.storage`: sono variabili globali nel JS bundlato.

## Requisiti non funzionali

- L'estensione non modifica mai i dati inviati da/verso Datasurf
- Nessuna richiesta di rete aggiuntiva (tutto offline dopo il caricamento)
- Chrome 110+ (MV3 stabile)
