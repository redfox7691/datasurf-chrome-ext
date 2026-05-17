// pericolosi_cer.js
// Lookup table normativa: codici CER pericolosi secondo il Catalogo Europeo dei Rifiuti
// (CER 2002, recepito in Italia con D.Lgs. 152/2006 All. D Parte IV)
//
// I codici pericolosi nella norma sono marcati con asterisco (*).
// Qui li memorizziamo SENZA asterisco per matchare il formato di Datasurf,
// che normalizza rimuovendo l'asterisco da tutti i codici.
//
// La lista è normativa e stabile: cambia solo con aggiornamenti legislativi europei.
// Fonte: Decisione 2000/532/CE e successive modifiche (2014/955/UE).
//
// NOTA: questa variabile è globale (main world) — non usare export.

const CER_PERICOLOSI = new Set([

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 01 — Rifiuti da prospezione, estrazione, trattamento di
  //               minerali e materiali di cava
  // ─────────────────────────────────────────────────────────────────────
  "010304", // fanghi acidi o soluzioni acide da lavorazione del solfuro
  "010305", // altri fanghi e rifiuti solidi contenenti sostanze pericolose
  "010307", // altri rifiuti contenenti sostanze pericolose da lavorazione fisica e chimica di minerali metalliferi
  "010408", // ghiaia e frantumato contenente sostanze pericolose
  "010410", // polveri e residui contenenti sostanze pericolose
  "010503", // fanghi da perforazione contenenti olio
  "010504", // fanghi e rifiuti da perforazione di pozzi per acqua dolce
  "010505", // fanghi e rifiuti da perforazione contenenti olio

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 02 — Rifiuti da produzione, trattamento e preparazione
  //               di alimenti (agricoltura, silvicoltura, pesca, acquacoltura)
  // ─────────────────────────────────────────────────────────────────────
  // (nessun codice pericoloso nel capitolo 02)

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 03 — Rifiuti della lavorazione del legno e della produzione
  //               di carta, polpa, cartone, pannelli e mobili
  // ─────────────────────────────────────────────────────────────────────
  "030104", // segatura, trucioli, residui di taglio, legno, pannelli di particelle e piallacci contenenti sostanze pericolose
  "030105", // segatura, trucioli, residui di taglio, legno, pannelli di particelle e piallacci contenenti sostanze pericolose
  "030201", // conservanti del legno organici alogenati
  "030202", // conservanti del legno organici clorurati
  "030203", // conservanti del legno organici contenenti metalli
  "030204", // conservanti del legno inorganici

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 04 — Rifiuti della produzione conciaria e tessile
  // ─────────────────────────────────────────────────────────────────────
  "040103", // rifiuti di sgrassatura contenenti solventi senza fase liquida
  "040114", // fanghi provenienti da operazioni di finitura, contenenti solventi organici
  "040215", // fanghi da operazioni di finitura, contenenti sostanze pericolose
  "040219", // fanghi da trattamento effluenti, contenenti sostanze pericolose
  "040220", // altri fanghi da trattamento effluenti in loco, contenenti sostanze pericolose
  "040221", // rifiuti da fibre tessili grezze non lavorate, contenenti sostanze pericolose
  "040222", // rifiuti da fibre tessili lavorate, contenenti sostanze pericolose

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 05 — Rifiuti della raffinazione del petrolio, della
  //               purificazione del gas naturale e del trattamento pirolitico del carbone
  // ─────────────────────────────────────────────────────────────────────
  "050103", // fanghi da serbatoi
  "050104", // fanghi acidi di alchilazione
  "050105", // perdite di olio
  "050106", // fanghi oleosi da manutenzione di impianti e apparecchiature
  "050107", // acidi di catrame
  "050108", // altri catrami
  "050109", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "050111", // rifiuti da pulitura combustibili con basi
  "050112", // acidi contenenti olio
  "050114", // rifiuti da colonne di raffreddamento
  "050115", // argille da filtrazione esaurite
  "050601", // acidi di catrame
  "050603", // altri catrami
  "050605", // fanghi da serbatoi di stoccaggio
  "050702", // rifiuti contenenti zolfo

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 06 — Rifiuti dei processi chimici inorganici
  // ─────────────────────────────────────────────────────────────────────
  "060101", // acido solforico ed acido solforoso
  "060102", // acido cloridrico
  "060103", // acido fluoridrico
  "060104", // acido fosforico e acido fosforoso
  "060105", // acido nitrico e acido nitroso
  "060106", // altri acidi
  "060201", // idrossido di calcio
  "060203", // idrossido di ammonio
  "060204", // idrossido di sodio e di potassio
  "060205", // altre basi
  "060311", // sali e soluzioni contenenti cianuri
  "060313", // sali e soluzioni contenenti metalli pesanti
  "060315", // ossidi di metalli contenenti metalli pesanti
  "060404", // rifiuti contenenti mercurio
  "060405", // rifiuti contenenti altri metalli pesanti
  "060502", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "060602", // rifiuti contenenti solfuri pericolosi
  "060701", // rifiuti di elettrolisi contenenti amianto
  "060702", // carbone attivo dalla produzione di cloro
  "060703", // fanghi di solfato di bario contenenti mercurio
  "060704", // soluzioni e acidi, es. acido di contatto
  "060802", // rifiuti contenenti clorosilani pericolosi
  "060902", // scorie fosforiche
  "060904", // composti del calcio contenenti o contaminati da sostanze pericolose
  "061001", // rifiuti contenenti sostanze pericolose
  "061101", // rifiuti contenenti sostanze pericolose da produzione di biossido di titanio
  "061301", // prodotti fitosanitari inorganici, biocidi e conservanti del legno
  "061302", // carbone attivo esaurito (tranne 060702)
  "061303", // nerofumo
  "061304", // rifiuti da lavorazione dell'amianto
  "061305", // fuliggine

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 07 — Rifiuti dei processi chimici organici
  // ─────────────────────────────────────────────────────────────────────
  "070101", // acque di lavaggio e soluzioni madri acquose
  "070103", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070104", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070107", // residui di reazione e di distillazione alogenati
  "070108", // altri residui di reazione e di distillazione
  "070109", // residui di filtrazione e assorbenti esauriti alogenati
  "070110", // altri residui di filtrazione e assorbenti esauriti
  "070111", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070201", // acque di lavaggio e soluzioni madri acquose
  "070203", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070204", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070207", // residui di reazione e di distillazione alogenati
  "070208", // altri residui di reazione e di distillazione
  "070209", // residui di filtrazione e assorbenti esauriti alogenati
  "070210", // altri residui di filtrazione e assorbenti esauriti
  "070211", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070213", // rifiuti plastici contenenti sostanze pericolose
  "070215", // rifiuti da additivi, contenenti sostanze pericolose
  "070217", // rifiuti contenenti siliconi pericolosi
  "070301", // acque di lavaggio e soluzioni madri acquose
  "070303", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070304", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070307", // residui di reazione e di distillazione alogenati
  "070308", // altri residui di reazione e di distillazione
  "070309", // residui di filtrazione e assorbenti esauriti alogenati
  "070310", // altri residui di filtrazione e assorbenti esauriti
  "070311", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070401", // acque di lavaggio e soluzioni madri acquose
  "070403", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070404", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070407", // residui di reazione e di distillazione alogenati
  "070408", // altri residui di reazione e di distillazione
  "070409", // residui di filtrazione e assorbenti esauriti alogenati
  "070410", // altri residui di filtrazione e assorbenti esauriti
  "070411", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070413", // rifiuti solidi contenenti sostanze pericolose
  "070501", // acque di lavaggio e soluzioni madri acquose
  "070503", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070504", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070507", // residui di reazione e di distillazione alogenati
  "070508", // altri residui di reazione e di distillazione
  "070509", // residui di filtrazione e assorbenti esauriti alogenati
  "070510", // altri residui di filtrazione e assorbenti esauriti
  "070511", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070513", // rifiuti solidi contenenti sostanze pericolose
  "070601", // acque di lavaggio e soluzioni madri acquose
  "070603", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070604", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070607", // residui di reazione e di distillazione alogenati
  "070608", // altri residui di reazione e di distillazione
  "070609", // residui di filtrazione e assorbenti esauriti alogenati
  "070610", // altri residui di filtrazione e assorbenti esauriti
  "070611", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070701", // acque di lavaggio e soluzioni madri acquose
  "070703", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070704", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070707", // residui di reazione e di distillazione alogenati
  "070708", // altri residui di reazione e di distillazione
  "070709", // residui di filtrazione e assorbenti esauriti alogenati
  "070710", // altri residui di filtrazione e assorbenti esauriti
  "070711", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 08 — Rifiuti della produzione, formulazione, fornitura
  //               ed uso di rivestimenti, sigillanti, adesivi, inchiostri
  // ─────────────────────────────────────────────────────────────────────
  "080111", // pitture e vernici di scarto, contenenti solventi organici o altre sostanze pericolose
  "080113", // fanghi prodotti da pitture o vernici, contenenti solventi organici o altre sostanze pericolose
  "080115", // fanghi acquosi contenenti pitture o vernici, contenenti solventi organici o altre sostanze pericolose
  "080117", // rifiuti da sgrassatura contenenti solventi organici o altre sostanze pericolose
  "080119", // sospensioni acquose contenenti pitture o vernici, con solventi organici o altre sostanze pericolose
  "080121", // residui di vernici o di primers
  "080123", // sospensioni acquose contenenti vernici o primers
  "080312", // rifiuti di inchiostri, contenenti sostanze pericolose
  "080314", // fanghi di inchiostri, contenenti sostanze pericolose
  "080316", // rifiuti di soluzioni per incisione
  "080317", // rifiuti di toner per stampa, contenenti sostanze pericolose
  "080319", // oli dispersi
  "080409", // rifiuti di adesivi e sigillanti, contenenti solventi organici o altre sostanze pericolose
  "080411", // fanghi di adesivi e sigillanti, contenenti solventi organici o altre sostanze pericolose
  "080413", // fanghi acquosi contenenti adesivi o sigillanti, contenenti solventi organici o altre sost. per.
  "080415", // rifiuti liquidi acquosi contenenti adesivi o sigillanti, contenenti solventi organici o altre sost. per.
  "080417", // olio di resina

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 09 — Rifiuti dell'industria fotografica
  // ─────────────────────────────────────────────────────────────────────
  "090101", // soluzioni di sviluppo e pre-stampa a base acquosa
  "090102", // soluzioni di sviluppo per lastre offset a base acquosa
  "090103", // soluzioni di sviluppo a base di solventi
  "090104", // soluzioni di fissaggio
  "090105", // soluzioni di lavaggio e soluzioni di arresto e di fissaggio
  "090106", // rifiuti contenenti argento da trattamento in loco di rifiuti fotografici
  "090111", // macchine fotografiche monouso contenenti batterie
  "090113", // acque di lavaggio da recupero in loco di argento, contenenti sostanze pericolose

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 10 — Rifiuti provenienti da processi termici
  // ─────────────────────────────────────────────────────────────────────
  "100103", // ceneri volanti da torba e da legno non trattato (se contengono sostanze pericolose)
  "100109", // acido solforico
  "100113", // ceneri volanti da idrocarburi emulsionati usati come combustibili
  "100115", // ceneri pesanti, scorie e polveri da caldaia da coincenerimento, contenenti sostanze pericolose
  "100117", // ceneri volanti da coincenerimento, contenenti sostanze pericolose
  "100119", // rifiuti da depurazione gas, contenenti sostanze pericolose
  "100121", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "100123", // fanghi acquosi da pulitura caldaie, contenenti sostanze pericolose
  "100125", // rifiuti dell'approvvigionamento e trattamento combustibile per centrali termoelettriche
  "100126", // rifiuti da trattamento acque di raffreddamento
  "100201", // rifiuti da processo di scorie d'altoforno
  "100204", // altri fanghi e filtri, contenenti sostanze pericolose
  "100209", // scorie di fusione contenenti sostanze pericolose
  "100210", // incrostazioni di laminatoio
  "100213", // fanghi e residui di filtrazione del trattamento gas, contenenti sostanze pericolose
  "100215", // altri fanghi e residui di filtrazione
  "100217", // rifiuti solidi da depurazione gas contenenti sostanze pericolose
  "100219", // rifiuti da trattamento acque contenenti sostanze pericolose
  "100301", // catrame e rifiuti contenenti catrame
  "100303", // scorie del processo
  "100305", // rifiuti di allumina
  "100308", // scorie saline della fusione secondaria
  "100309", // scorie nere della fusione secondaria
  "100311", // rifiuti contenenti catrame dalla produzione di anodi, diversi da quelli di cui alla voce 100309
  "100313", // rifiuti contenenti catrame dalla produzione di anodi
  "100315", // schiume infiammabili o che emettono gas pericolosi per reazione con acqua
  "100317", // rifiuti contenenti catrame dalla produzione di anodi
  "100319", // polveri di gas di scarico contenenti sostanze pericolose
  "100321", // altre polveri e particolati (incluse polveri di molatura) contenenti sostanze pericolose
  "100323", // rifiuti solidi da depurazione gas contenenti sostanze pericolose
  "100325", // fanghi e residui di filtrazione da depurazione gas, contenenti sostanze pericolose
  "100327", // rifiuti da trattamento acque di raffreddamento contenenti sostanze pericolose
  "100401", // scorie, loppe, colaticci dalla produzione primaria
  "100403", // arsenico di calcio
  "100404", // polveri di gas di scarico
  "100405", // altri residui in forma di particolato e polvere
  "100406", // rifiuti solidi da depurazione gas
  "100407", // fanghi e residui di filtrazione da depurazione gas
  "100409", // rifiuti da trattamento acque di raffreddamento contenenti sostanze pericolose
  "100503", // polveri di gas di scarico
  "100505", // rifiuti solidi da depurazione gas
  "100506", // fanghi e residui di filtrazione da depurazione gas
  "100508", // rifiuti da trattamento acque di raffreddamento contenenti sostanze pericolose
  "100509", // rifiuti da trattamento acque di raffreddamento contenenti sostanze pericolose
  "100603", // polveri di gas di scarico (nere)
  "100606", // rifiuti solidi da depurazione gas
  "100607", // fanghi e residui di filtrazione da depurazione gas
  "100609", // rifiuti da trattamento acque di raffreddamento contenenti sostanze pericolose
  "100701", // catrame e rifiuti contenenti catrame (dalla produzione di gas di carbone)
  "100703", // rifiuti solidi da depurazione gas
  "100704", // altri residui di particolato e polvere
  "100705", // fanghi e residui di filtrazione da depurazione gas
  "100707", // rifiuti da trattamento acque di raffreddamento contenenti sostanze pericolose
  "100801", // catrame e rifiuti contenenti catrame
  "100806", // stampi di fusione esauriti pre-colata contenenti sostanze pericolose
  "100808", // scorie saline della fusione primaria e secondaria
  "100810", // scorie nere dalla fusione primaria e secondaria
  "100812", // rifiuti contenenti catrame dalla produzione di anodi
  "100814", // particolato e polvere di anodi
  "100815", // polveri di gas di scarico contenenti sostanze pericolose
  "100817", // fanghi e residui di filtrazione da depurazione gas, contenenti sostanze pericolose
  "100819", // rifiuti da trattamento acque di raffreddamento contenenti sostanze pericolose
  "100903", // scorie di fusione del forno
  "100905", // anime e stampi di fusione, pre-colata, contenenti sostanze pericolose
  "100907", // anime e stampi di fusione, post-colata, contenenti sostanze pericolose
  "100909", // polveri di gas di scarico contenenti sostanze pericolose
  "100911", // altre polveri contenenti sostanze pericolose
  "100913", // rifiuti di agenti leganti contenenti sostanze pericolose
  "100915", // rifiuti di agenti rilevatori di crepe, contenenti sostanze pericolose
  "101003", // scorie di fusione del forno
  "101005", // anime e stampi di fusione, pre-colata, contenenti sostanze pericolose
  "101007", // anime e stampi di fusione, post-colata, contenenti sostanze pericolose
  "101009", // polveri di gas di scarico contenenti sostanze pericolose
  "101011", // altre polveri contenenti sostanze pericolose
  "101013", // rifiuti di agenti leganti contenenti sostanze pericolose
  "101015", // rifiuti di agenti rilevatori di crepe, contenenti sostanze pericolose
  "101017", // rifiuti di agenti rilevatori di crepe, contenenti sostanze pericolose
  "101103", // rifiuti di materiali in fibra di vetro
  "101109", // rifiuti della preparazione della mescola non sottoposta a trattamento termico, contenenti sostanze per.
  "101111", // polveri di piccoli frammenti di vetro e polvere di vetro contenenti metalli pesanti (es. tubi catodici)
  "101113", // fanghi della lucidatura del vetro contenenti sostanze pericolose
  "101115", // rifiuti solidi da depurazione gas contenenti sostanze pericolose
  "101117", // fanghi e residui di filtrazione da depurazione gas contenenti sostanze pericolose
  "101119", // rifiuti da trattamento acque di raffreddamento contenenti sostanze pericolose
  "101201", // rifiuti della preparazione della mescola non sottoposta a trattamento termico
  "101203", // polveri e particolato
  "101209", // rifiuti solidi da depurazione gas contenenti sostanze pericolose
  "101211", // rifiuti da smaltatura contenenti metalli pesanti
  "101213", // fanghi da trattamento in loco degli effluenti contenenti sostanze pericolose
  "101301", // rifiuti della preparazione della mescola non sottoposta a trattamento termico
  "101304", // rifiuti di calcinazione e idratazione della calce
  "101306", // polveri e particolati (tranne voci 101304 e 101305)
  "101309", // rifiuti contenenti amianto da produzione di fibre-cemento
  "101311", // rifiuti di materiali compositi a base di cemento, contenenti sostanze pericolose
  "101313", // rifiuti solidi da depurazione gas contenenti sostanze pericolose
  "101314", // rifiuti e fanghi da calcestruzzo

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 11 — Rifiuti prodotti dal trattamento chimico superficiale
  //               e dal rivestimento di metalli e altri materiali;
  //               idrometallurgia non ferrosa
  // ─────────────────────────────────────────────────────────────────────
  "110101", // rifiuti contenenti cianuri, alcalini, con metalli pesanti diversi dal cromo
  "110102", // rifiuti da processi idrometallurgici dello zinco, inclusi jarosite e goethite
  "110105", // acidi di decapaggio
  "110106", // acidi non specificati altrimenti
  "110107", // basi di decapaggio
  "110108", // fanghi di fosfatazione
  "110109", // fanghi e residui di filtrazione, contenenti sostanze pericolose
  "110111", // acque di risciacquo acquose, contenenti sostanze pericolose
  "110113", // rifiuti da sgrassatura contenenti sostanze pericolose
  "110115", // eluati e fanghi da sistemi a membrana o a scambio ionico, contenenti sostanze pericolose
  "110116", // resine a scambio ionico sature o esaurite
  "110198", // altri rifiuti contenenti sostanze pericolose
  "110201", // rifiuti da processi idrometallurgici dello zinco
  "110202", // fanghi da idrometallurgia dello zinco (inclusi jarosite e goethite)
  "110203", // rifiuti dalla produzione di anodi per processi elettrolitici acquosi
  "110205", // rifiuti da processi idrometallurgici del rame, contenenti sostanze pericolose
  "110207", // altri rifiuti contenenti sostanze pericolose
  "110301", // rifiuti contenenti cianuri
  "110302", // altri rifiuti

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 12 — Rifiuti dalla lavorazione e dal trattamento fisico
  //               e meccanico superficiale di metalli e plastica
  // ─────────────────────────────────────────────────────────────────────
  "120106", // oli minerali per macchinari, contenenti alogeni (tranne emulsioni e soluzioni)
  "120107", // oli minerali per macchinari, non contenenti alogeni (tranne emulsioni e soluzioni)
  "120108", // emulsioni e soluzioni per macchinari contenenti alogeni
  "120109", // emulsioni e soluzioni per macchinari, non contenenti alogeni
  "120110", // oli sintetici per macchinari
  "120112", // cere e grassi esauriti
  "120114", // fanghi di lavorazione contenenti sostanze pericolose
  "120116", // rifiuti di materiale per sabbiatura, contenenti sostanze pericolose
  "120118", // fanghi metallici (fanghi di rettifica, di affilatura e di lappatura) contenenti olio
  "120119", // oli per macchinari facilmente biodegradabili
  "120120", // corpi abrasivi di consumo e materiali di consumo per la rettifica, contenenti sostanze pericolose

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 13 — Oli esauriti e rifiuti di combustibili liquidi
  //               (tranne oli commestibili, 05 e 12)
  // ─────────────────────────────────────────────────────────────────────
  "130101", // oli idraulici contenenti PCB
  "130104", // emulsioni clorurate
  "130105", // emulsioni non clorurate
  "130109", // oli idraulici minerali clorurati
  "130110", // oli idraulici minerali non clorurati
  "130111", // oli idraulici sintetici
  "130112", // oli idraulici facilmente biodegradabili
  "130113", // altri oli idraulici
  "130204", // oli per circuiti di motori, ingranaggi e lubrificazione, minerali clorurati
  "130205", // oli per circuiti di motori, ingranaggi e lubrificazione, minerali non clorurati
  "130206", // oli per circuiti di motori, ingranaggi e lubrificazione, sintetici
  "130207", // oli per circuiti di motori, ingranaggi e lubrificazione, facilmente biodegradabili
  "130208", // altri oli per motori, ingranaggi e lubrificazione
  "130301", // oli isolanti e termovettori contenenti PCB
  "130306", // oli isolanti e termovettori minerali clorurati, diversi da quelli di cui alla voce 130301
  "130307", // oli isolanti e termovettori minerali non clorurati
  "130308", // oli isolanti e termovettori sintetici
  "130309", // oli isolanti e termovettori facilmente biodegradabili
  "130310", // altri oli isolanti e termovettori
  "130401", // oli di sentina della navigazione interna
  "130402", // oli di sentina provenienti da scarichi nei moli
  "130403", // oli di sentina della navigazione marittima
  "130501", // rifiuti solidi da camere a sabbia e da separatori olio-acqua
  "130502", // fanghi da camere a sabbia e da separatori olio-acqua
  "130503", // fanghi da collettori
  "130506", // olio prodotto da separatori olio-acqua
  "130507", // acqua oleosa prodotta da separatori olio-acqua
  "130508", // miscele di rifiuti da camere a sabbia e da separatori olio-acqua
  "130701", // olio combustibile e carburante diesel
  "130702", // benzina
  "130703", // altri combustibili (comprese le miscele)
  "130801", // fanghi e rifiuti solidi da processi di dissalazione
  "130802", // altre emulsioni

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 14 — Solventi organici, refrigeranti e propellenti di scarto
  //               (tranne 07 e 08)
  // ─────────────────────────────────────────────────────────────────────
  "140601", // clorofluorocarburi (CFC), HCFC, HFC
  "140602", // altri solventi e miscele di solventi alogenati
  "140603", // altri solventi e miscele di solventi
  "140604", // fanghi o rifiuti solidi contenenti solventi alogenati
  "140605", // fanghi o rifiuti solidi contenenti altri solventi

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 15 — Imballaggi, assorbenti, stracci, materiali filtranti
  //               e indumenti protettivi (non specificati altrimenti)
  // ─────────────────────────────────────────────────────────────────────
  "150110", // imballaggi contenenti residui di sostanze pericolose o contaminati da tali sostanze
  "150111", // imballaggi metallici contenenti matrici solide porose pericolose (es. amianto), inclusi contenitori a pressione vuoti
  "150202", // assorbenti, materiali filtranti (inclusi filtri dell'olio non specificati altrimenti), stracci e indumenti protettivi, contaminati da sostanze pericolose
  "150203", // assorbenti, materiali filtranti, stracci e indumenti protettivi, diversi da quelli di cui alla voce 150202

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 16 — Rifiuti non specificati altrimenti nell'elenco
  // ─────────────────────────────────────────────────────────────────────
  "160104", // veicoli fuori uso
  "160107", // filtri dell'olio
  "160108", // componenti contenenti mercurio
  "160109", // componenti contenenti PCB
  "160110", // componenti esplosivi (es. airbag)
  "160121", // componenti pericolosi diversi da quelli di cui alle voci da 160107 a 160111 e 160113 e 160114
  "160122", // altri componenti non specificati altrimenti
  "160123", // altri componenti non specificati altrimenti
  "160211", // apparecchiature fuori uso contenenti clorofluorocarburi, HCFC, HFC
  "160212", // apparecchiature fuori uso contenenti amianto in fibre libere
  "160213", // apparecchiature fuori uso contenenti componenti pericolosi, diversi da quelli di cui alle voci 160209 e 160212
  "160214", // apparecchiature fuori uso, diverse da quelle di cui alle voci da 160209 a 160213
  "160215", // componenti pericolosi rimossi da apparecchiature fuori uso
  "160216", // componenti rimossi da apparecchiature fuori uso, diversi da quelli di cui alla voce 160215
  "160303", // rifiuti inorganici contenenti sostanze pericolose
  "160304", // rifiuti inorganici, diversi da quelli di cui alla voce 160303
  "160305", // rifiuti organici contenenti sostanze pericolose
  "160306", // rifiuti organici, diversi da quelli di cui alla voce 160305
  "160401", // munizioni di scarto
  "160402", // rifiuti di fuochi d'artificio
  "160403", // altri rifiuti esplosivi
  "160504", // gas in contenitori a pressione (inclusi gli halon), contenenti sostanze pericolose
  "160505", // gas in contenitori a pressione, diversi da quelli di cui alla voce 160504
  "160506", // sostanze chimiche di laboratorio contenenti o costituite da sostanze pericolose, comprese le miscele di sostanze chimiche di laboratorio
  "160507", // sostanze chimiche inorganiche di scarto contenenti o costituite da sostanze pericolose
  "160508", // sostanze chimiche organiche di scarto contenenti o costituite da sostanze pericolose
  "160509", // sostanze chimiche di scarto, diverse da quelle di cui alle voci 160506, 160507 o 160508
  "160601", // batterie al piombo
  "160602", // batterie al nichel-cadmio
  "160603", // batterie contenenti mercurio
  "160606", // elettroliti di batterie e accumulatori oggetto di raccolta differenziata
  "160708", // rifiuti contenenti olio
  "160709", // rifiuti contenenti altre sostanze pericolose
  "160801", // catalizzatori esauriti contenenti oro, argento, renio, rodio, palladio, iridio o platino (tranne 160807)
  "160802", // catalizzatori esauriti contenenti metalli di transizione pericolosi o composti di metalli di transizione pericolosi
  "160803", // catalizzatori esauriti contenenti metalli di transizione o composti di metalli di transizione non specificati altrimenti
  "160804", // catalizzatori esauriti da cracking catalitico fluidizzato (tranne 160807)
  "160805", // catalizzatori esauriti contenenti acido fosforico
  "160806", // liquidi esauriti usati come catalizzatori
  "160807", // catalizzatori esauriti contaminati da sostanze pericolose
  "160901", // permanganati, ad esempio permanganato di potassio
  "160902", // cromati, ad esempio cromato di potassio, dicromato di potassio o di sodio
  "160903", // perossidi, ad esempio perossido di idrogeno
  "160904", // sostanze ossidanti non specificate altrimenti
  "161001", // soluzioni acquose di scarto contenenti sostanze pericolose
  "161003", // concentrati acquosi contenenti sostanze pericolose
  "161101", // rivestimenti di carbone e refrattari a base di carbonio provenienti da processi metallurgici, contenenti sostanze pericolose
  "161103", // altri rivestimenti e refrattari provenienti da processi metallurgici, contenenti sostanze pericolose
  "161105", // rivestimenti e refrattari provenienti da processi non metallurgici, contenenti sostanze pericolose

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 17 — Rifiuti delle operazioni di costruzione e demolizione
  //               (incluso il terreno proveniente da siti contaminati)
  // ─────────────────────────────────────────────────────────────────────
  "170101", // cemento (se contaminato da sostanze pericolose)
  "170204", // vetro, plastica e legno contenenti o contaminati da sostanze pericolose
  "170301", // miscele bituminose contenenti catrame di carbone
  "170303", // catrame di carbone e prodotti contenenti catrame
  "170401", // rame, bronzo, ottone (se contaminati)
  "170501", // terra e rocce, contenenti sostanze pericolose
  "170503", // terre e rocce, contenenti sostanze pericolose
  "170505", // fanghi di dragaggio, contenenti sostanze pericolose
  "170507", // pietrisco per massicciate ferroviarie, contenente sostanze pericolose
  "170601", // materiali isolanti contenenti amianto
  "170603", // altri materiali isolanti contenenti o costituiti da sostanze pericolose
  "170605", // materiali da costruzione contenenti amianto
  "170801", // materiali da costruzione a base di gesso, contaminati da sostanze pericolose
  "170901", // rifiuti misti dell'attività di costruzione e demolizione, contenenti mercurio
  "170902", // rifiuti misti dell'attività di costruzione e demolizione, contenenti PCB
  "170903", // altri rifiuti misti dell'attività di costruzione e demolizione, contenenti sostanze pericolose

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 18 — Rifiuti prodotti dal settore sanitario e veterinario
  //               o da attività di ricerca collegate (tranne i rifiuti
  //               di cucina e di ristorazione non direttamente legati)
  // ─────────────────────────────────────────────────────────────────────
  "180103", // rifiuti che devono essere raccolti e smaltiti applicando precauzioni particolari per evitare infezioni
  "180106", // sostanze chimiche contenenti o costituite da sostanze pericolose
  "180108", // medicinali citotossici e citostatici
  "180110", // rifiuti di amalgama prodotti da interventi odontoiatrici
  "180202", // rifiuti che devono essere raccolti e smaltiti applicando precauzioni particolari per evitare infezioni
  "180205", // sostanze chimiche contenenti o costituite da sostanze pericolose
  "180207", // medicinali citotossici e citostatici

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 19 — Rifiuti prodotti da impianti di trattamento dei rifiuti,
  //               impianti di trattamento delle acque reflue fuori sito
  //               e dalla potabilizzazione dell'acqua e dalla sua preparazione
  //               per uso industriale
  // ─────────────────────────────────────────────────────────────────────
  "190106", // rifiuti liquidi acquosi da trattamento in loco degli effluenti e acque madri acquose
  "190107", // rifiuti solidi da trattamento in loco degli effluenti
  "190110", // carbone attivo esaurito da trattamento gas di scarico
  "190111", // ceneri pesanti e scorie, contenenti sostanze pericolose
  "190113", // ceneri volanti contenenti sostanze pericolose
  "190115", // polveri di caldaia contenenti sostanze pericolose
  "190117", // rifiuti da pirolisi, contenenti sostanze pericolose
  "190119", // sabbie da letti fluidizzati
  "190203", // rifiuti premiscelati composti esclusivamente da rifiuti non pericolosi
  "190204", // rifiuti premiscelati composti da almeno un rifiuto pericoloso
  "190205", // fanghi da trattamenti fisico-chimici, contenenti sostanze pericolose
  "190207", // olio e concentrati da processi di separazione
  "190208", // rifiuti liquidi combustibili contenenti sostanze pericolose
  "190209", // rifiuti solidi combustibili contenenti sostanze pericolose
  "190210", // rifiuti combustibili diversi da quelli di cui alle voci 190208 e 190209
  "190211", // altri rifiuti contenenti sostanze pericolose
  "190306", // rifiuti stabilizzati classificati come pericolosi
  "190402", // ceneri volanti e altri rifiuti da trattamento gas di scarico
  "190403", // fase solida non vetrificata
  "190404", // fase liquida acquosa da disvetrificazione
  "190501", // rifiuti del compostaggio di rifiuti urbani e assimilati non trattati
  "190502", // rifiuti del compostaggio di rifiuti di origine animale e vegetale non trattati
  "190503", // compost fuori specifica
  "190601", // liquidi prodotti da trattamento anaerobico di rifiuti municipali
  "190602", // fanghi prodotti da trattamento anaerobico di rifiuti municipali
  "190603", // liquori prodotti da trattamento anaerobico di rifiuti di origine animale e vegetale
  "190604", // digestato prodotto dal trattamento anaerobico di rifiuti di origine animale e vegetale
  "190605", // liquidi prodotti da trattamento anaerobico di rifiuti di origine animale e vegetale
  "190606", // digestato prodotto dal trattamento anaerobico di rifiuti di origine animale e vegetale
  "190702", // percolato di discarica, contenente sostanze pericolose
  "190704", // acque di falda e altri liquidi prodotti da discarica, contenenti sostanze pericolose
  "190705", // rifiuti del trattamento del gas di discarica
  "190801", // residui di vagliatura
  "190802", // rifiuti da dissabbiamento
  "190805", // fanghi prodotti dal trattamento delle acque reflue urbane
  "190806", // resine a scambio ionico sature o esaurite
  "190807", // soluzioni e fanghi da rigenerazione delle resine a scambio ionico
  "190808", // rifiuti di sistemi a membrana contenenti metalli pesanti
  "190809", // miscele di grassi e oli da separazione olio/acqua, contenenti solo oli e grassi commestibili
  "190810", // miscele di grassi e oli da separazione olio/acqua, diverse da quelle di cui alla voce 190809
  "190811", // fanghi contenenti sostanze pericolose da trattamento biologico delle acque reflue industriali
  "190812", // fanghi da trattamento biologico delle acque reflue industriali, diversi da quelli della voce 190811
  "190813", // fanghi contenenti sostanze pericolose da altri trattamenti delle acque reflue industriali
  "190814", // fanghi da altri trattamenti delle acque reflue industriali, diversi da quelli della voce 190813
  "190901", // rifiuti solidi prodotti da potabilizzazione dell'acqua
  "190902", // fanghi prodotti da potabilizzazione dell'acqua
  "190903", // fanghi da decarbonatazione
  "190904", // carbone attivo esaurito
  "190905", // resine a scambio ionico sature o esaurite
  "190906", // soluzioni e fanghi da rigenerazione delle resine a scambio ionico
  "191001", // rifiuti di ferro e acciaio
  "191002", // rifiuti di metalli non ferrosi
  "191003", // fluff — frazione leggera e polveri, contenenti sostanze pericolose
  "191004", // fluff — frazione leggera e polveri, diverse da quelle di cui alla voce 191003
  "191005", // altre frazioni, contenenti sostanze pericolose
  "191006", // altre frazioni, diverse da quelle di cui alla voce 191005
  "191101", // argille di filtrazione esaurite
  "191102", // acidi di catrame
  "191103", // rifiuti liquidi acquosi
  "191104", // rifiuti da pulitura combustibili con basi
  "191105", // fanghi da trattamento in loco degli effluenti, contenenti sostanze pericolose
  "191107", // rifiuti da abbattimento dei fumi
  "191201", // carta e cartone
  "191202", // metalli ferrosi
  "191203", // metalli non ferrosi
  "191204", // plastica e gomma
  "191205", // vetro
  "191206", // legno contenente sostanze pericolose
  "191207", // legno, diverso da quello di cui alla voce 191206
  "191208", // prodotti tessili
  "191209", // minerali (ad es. sabbia e rocce)
  "191210", // rifiuti combustibili (CDR — combustibile derivato da rifiuti)
  "191211", // altri rifiuti (compresi materiali misti) da trattamento meccanico, contenenti sostanze pericolose
  "191212", // altri rifiuti (compresi materiali misti) da trattamento meccanico

  // ─────────────────────────────────────────────────────────────────────
  // CAPITOLO 20 — Rifiuti urbani (rifiuti domestici e assimilabili
  //               prodotti da attività commerciali e industriali nonché
  //               dalle istituzioni) inclusi i rifiuti della raccolta
  //               differenziata
  // ─────────────────────────────────────────────────────────────────────
  "200113", // solventi
  "200114", // acidi
  "200115", // sostanze alcaline
  "200117", // prodotti fotochimici
  "200119", // pesticidi
  "200121", // tubi fluorescenti e altri rifiuti contenenti mercurio
  "200123", // apparecchiature fuori uso contenenti clorofluorocarburi
  "200126", // oli e grassi diversi da quelli di cui alla voce 200125
  "200127", // vernici, inchiostri, adesivi e resine contenenti sostanze pericolose
  "200129", // detergenti contenenti sostanze pericolose
  "200131", // medicinali citotossici e citostatici
  "200133", // batterie e accumulatori di cui alle voci 160601, 160602 o 160603 e batterie e accumulatori non suddivisi contenenti tali batterie
  "200135", // apparecchiature elettriche ed elettroniche fuori uso, diverse da quelle di cui alle voci 200121 e 200123, contenenti componenti pericolosi
  "200137", // legno contenente sostanze pericolose

]);
