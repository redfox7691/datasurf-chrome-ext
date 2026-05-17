#!/bin/bash
# Genera il pacchetto di distribuzione per Datasurf CER Filter.
# Produce uno zip con tutti i file dell'estensione + LEGGIMI.txt.
# Uso: ./pack.sh

set -e

VERSIONE=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")
NOME="datasurf-cer-filter-v${VERSIONE}"
TMPDIR=$(mktemp -d)
DEST="${TMPDIR}/${NOME}"

mkdir -p "${DEST}/features" "${DEST}/icons"

# File dell'estensione
cp manifest.json content_script.js pericolosi_cer.js styles.css "${DEST}/"
cp features/cer_filter.js "${DEST}/features/"
cp icons/icon16.png icons/icon48.png icons/icon128.png "${DEST}/icons/"

# Istruzioni installazione
cat > "${DEST}/LEGGIMI.txt" << 'EOF'
=======================================================
  Datasurf CER Filter — Estensione Chrome per IoRecupero
=======================================================

Questa estensione aggiunge il filtro "Pericoloso / Non Pericoloso / Tutti"
all'anagrafica rifiuti di Datasurf.

REQUISITI
---------
- Google Chrome (versione 110 o superiore)

INSTALLAZIONE (da fare una sola volta)
---------------------------------------
1. Estrarre questo file zip in una cartella sul proprio PC.
   Esempio: C:\Utenti\Mario\datasurf-cer-filter\

2. Aprire Google Chrome e digitare nella barra degli indirizzi:
     chrome://extensions

3. In alto a destra attivare "Modalità sviluppatore" (interruttore).

4. Cliccare "Carica estensione non pacchettizzata".

5. Selezionare la cartella estratta al punto 1.

6. L'estensione è installata. Comparirà il nome "Datasurf CER Filter"
   nell'elenco delle estensioni.

UTILIZZO
--------
1. Aprire Datasurf e andare su:
     Anagrafica → Rifiuti (o il menu prodotti/rifiuti)

2. Nella testata della lista comparirà il widget:
     Filtro CER: [Tutti] [Pericolosi] [Non pericolosi]

3. Cliccare il filtro desiderato. Il filtro si applica alla pagina corrente;
   cambiando pagina si riapplica automaticamente.

AGGIORNAMENTO
-------------
Quando viene distribuita una nuova versione:
1. Sostituire il contenuto della cartella con i nuovi file.
2. Aprire chrome://extensions e cliccare l'icona ↺ (Ricarica)
   accanto a "Datasurf CER Filter".

DISINSTALLAZIONE
----------------
Aprire chrome://extensions → cliccare "Rimuovi" sotto "Datasurf CER Filter".

PROBLEMI
--------
Contattare: claudio.bizzarri@gmail.com
EOF

# Zip
cd "${TMPDIR}"
zip -r "${NOME}.zip" "${NOME}" -x "*.DS_Store" > /dev/null
cd - > /dev/null

mv "${TMPDIR}/${NOME}.zip" .
rm -rf "${TMPDIR}"

echo "Pacchetto creato: ${NOME}.zip"
