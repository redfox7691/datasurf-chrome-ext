# Regole per il Vibe Coding — Datasurf Chrome Extension

Questo file è rivolto a chi usa un assistente AI (Claude, Codex, Copilot, ecc.) per modificare questa estensione.  
**Leggi queste regole prima di iniziare qualsiasi modifica e mostralo al tuo AI prima di dargli istruzioni.**

---

## Cos'è questo progetto

È **una sola estensione Chrome** che modifica le pagine del gestionale Datasurf (https://app.datasurf.it) per le esigenze di IoRecupero SRL.  
Tutte le funzionalità stanno in questa cartella. Non esistono altri repository per questo progetto.

---

## Regola 0 — Leggi prima il CLAUDE.md

Prima di fare qualsiasi cosa, il tuo AI deve leggere il file `CLAUDE.md` in questa cartella.  
Lì ci sono tutte le istruzioni tecniche dettagliate. Queste regole sono un riassunto per non-tecnici; il `CLAUDE.md` è la fonte di verità.

---

## Cosa l'AI PUÒ fare

- Aggiungere una nuova funzionalità creando un file in `features/` (es. `features/mia_feature.js`)
- Modificare i file CSS in `styles.css` per migliorare l'aspetto dei widget
- Correggere bug nei file esistenti
- Aggiornare il numero di versione in `manifest.json`

---

## Cosa l'AI NON DEVE MAI fare

### ❌ Non creare una nuova estensione separata
Se vuoi aggiungere una funzionalità a una nuova pagina di Datasurf, si aggiunge **a questa estensione**, non se ne crea una nuova. Una sola estensione, tutto dentro.

### ❌ Non modificare `pericolosi_cer.js` e `catalogo_cer.js` senza documentazione
Questi file contengono elenchi normativi (codici CER europei). Vanno modificati solo con fonti ufficiali citate. Se hai dubbi, chiedi a Claudio prima.

### ❌ Non usare framework, librerie esterne o npm
Niente React, niente jQuery, niente `npm install`. Solo JavaScript puro. L'estensione deve funzionare offline, senza dipendenze esterne.

### ❌ Non modificare `content_script.js` senza capire cosa fa
Questo è il "motore" dell'estensione. Sbagliarlo rompe tutto. Tocca solo se sei sicuro di capire come funziona (leggi la sezione "Architettura" nel CLAUDE.md).

### ❌ Non cambiare i selettori CSS di iniezione senza testare
I selettori usati per inserire i widget nella pagina Datasurf sono stati scelti con cura dopo molti test. Cambiarli potrebbe far apparire il widget nel posto sbagliato (es. dentro la barra di navigazione blu). Vedi la sezione "Pattern di iniezione standard" nel CLAUDE.md.

### ❌ Non usare `main`, `body` o `[class*="content"]` come selettori
Questi selettori corrispondono anche ai componenti di navigazione di Angular e rompono il layout. Usa solo i selettori indicati nel CLAUDE.md.

### ❌ Non dimenticare di aggiornare il numero di versione
Dopo ogni modifica significativa (nuova funzionalità o bug fix), aggiorna il campo `"version"` in `manifest.json`. Segui lo schema: MAJOR.MINOR.PATCH (es. da `1.2.1` a `1.2.2` per un bug fix, a `1.3.0` per una nuova funzione).

### ❌ Non fare commit con messaggi in inglese
I messaggi di commit devono essere in **italiano**, come tutti gli altri commit del progetto.

---

## Come aggiungere una nuova funzionalità (istruzioni per l'AI)

Istruzioni da dare al tuo AI:

> "Leggi il file CLAUDE.md e segui la sezione 'Aggiungere una nuova feature'. Crea un file in `features/` con un nome descrittivo, usa il pattern di iniezione standard, aggiungi il file in `manifest.json`, aggiorna la versione e aggiorna `CLAUDE.md`."

Il pattern da seguire è quello di `features/cer_filter.js` o `features/soggetti_lookup.js`. L'AI deve copiare quella struttura, non inventarne una nuova.

---

## Prefissi CSS — usali sempre

Ogni funzionalità ha il suo prefisso per i nomi CSS, per evitare conflitti:

| Funzionalità | Prefisso CSS |
|---|---|
| Filtro CER / Consulta CER | `dsext-` |
| Consulta Soggetti | `dssogg-` |
| Nuova funzionalità | scegliere un nuovo prefisso breve (`ds` + nome abbreviato) |

---

## Prima di chiedere all'AI di fare modifiche

1. Assicurati di avere l'ultima versione del repository (`git pull`)
2. Mostra all'AI questo file e il `CLAUDE.md`
3. Descrivi cosa vuoi che faccia **in italiano**
4. Dopo le modifiche, verifica che la versione in `manifest.json` sia stata aggiornata
5. Fai commit e push

---

## Contatti

**Responsabile tecnico del progetto:** Claudio Bizzarri  
Per qualsiasi dubbio su architettura o modifiche importanti, chiedi a Claudio prima di procedere.
