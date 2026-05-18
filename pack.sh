#!/bin/bash
# Genera i pacchetti di distribuzione per l'estensione Datasurf per IoRecupero.
#
# Uso:
#   ./pack.sh            → zip per distribuzione manuale (con LEGGIMI.txt, in sottocartella)
#   ./pack.sh --webstore → zip per Chrome Web Store (file alla radice, senza LEGGIMI.txt)
#   ./pack.sh --tutti    → genera entrambi

set -e

VERSIONE=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")
MODALITA="${1:---manuale}"

_copia_file_estensione() {
  local dest="$1"
  mkdir -p "${dest}/features" "${dest}/icons"
  cp manifest.json content_script.js pericolosi_cer.js catalogo_cer.js styles.css "${dest}/"
  cp features/cer_filter.js features/soggetti_lookup.js "${dest}/features/"
  cp icons/icon16.png icons/icon48.png icons/icon128.png "${dest}/icons/"
}

_pack_manuale() {
  local NOME="datasurf-iorecupero-v${VERSIONE}"
  local TMPDIR
  TMPDIR=$(mktemp -d)
  local DEST="${TMPDIR}/${NOME}"

  _copia_file_estensione "${DEST}"

  cat > "${DEST}/LEGGIMI.txt" << 'EOF'
================================================================
  Datasurf — Estensione Chrome per IoRecupero
================================================================

Estensione che migliora l'interfaccia di Datasurf per le esigenze
operative di Io Recupero SRL.

FUNZIONALITÀ
------------
1. ANAGRAFICA RIFIUTI (pagina Rifiuti/Prodotti)
   - Filtro rapido: [Tutti] [Pericolosi] [Non pericolosi]
   - Card "Consulta CER": digita un codice CER/EER e ottieni
     descrizione ufficiale e classificazione di pericolosità.

2. ANAGRAFICHE SOGGETTI (pagina Soggetti/Clienti/Fornitori)
   - Card "Consulta Soggetto": cerca per ragione sociale, P.IVA,
     codice fiscale, telefono o email tra i soggetti già caricati
     da Datasurf. L'indice si aggiorna in automatico durante la
     navigazione.

REQUISITI
---------
- Google Chrome (versione 110 o superiore)

INSTALLAZIONE (da fare una sola volta)
---------------------------------------
1. Estrarre questo file zip in una cartella sul proprio PC.
   Esempio: C:\Utenti\Mario\datasurf-iorecupero\

2. Aprire Google Chrome e digitare nella barra degli indirizzi:
     chrome://extensions

3. In alto a destra attivare "Modalità sviluppatore" (interruttore).

4. Cliccare "Carica estensione non pacchettizzata".

5. Selezionare la cartella estratta al punto 1.

6. L'estensione è installata. Comparirà il nome "Datasurf CER Filter"
   nell'elenco delle estensioni.

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

  cd "${TMPDIR}"
  zip -r "${NOME}.zip" "${NOME}" -x "*.DS_Store" > /dev/null
  cd - > /dev/null
  mv "${TMPDIR}/${NOME}.zip" .
  rm -rf "${TMPDIR}"
  echo "Pacchetto manuale:   ${NOME}.zip"
}

_pack_webstore() {
  local NOME="datasurf-webstore-v${VERSIONE}"
  local TMPDIR
  TMPDIR=$(mktemp -d)
  local DEST="${TMPDIR}/ext"

  _copia_file_estensione "${DEST}"

  # Lo zip per il Web Store deve avere i file alla radice (niente sottocartella)
  cd "${DEST}"
  zip -r "${NOME}.zip" . -x "*.DS_Store" > /dev/null
  cd - > /dev/null
  mv "${DEST}/${NOME}.zip" .
  rm -rf "${TMPDIR}"
  echo "Pacchetto Web Store: ${NOME}.zip"
}

case "${MODALITA}" in
  --webstore) _pack_webstore ;;
  --tutti)    _pack_manuale; _pack_webstore ;;
  *)          _pack_manuale ;;
esac
