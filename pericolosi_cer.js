// pericolosi_cer.js
// Lookup table normativa: codici CER/EER pericolosi secondo il Catalogo Europeo dei Rifiuti.
// Base operativa: Decisione 2000/532/CE come modificata dalla Decisione 2014/955/UE.
// I codici pericolosi nella norma sono marcati con asterisco (*).
// Qui sono memorizzati SENZA asterisco per matchare il formato di Datasurf.
// NOTA: variabile globale in main world - non usare export.

const CER_PERICOLOSI = new Set([

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 01 - Rifiuti da prospezione, estrazione, trattamento di minerali e materiali di cava
  // ──────────────────────────────────────────────────────────────────
  "010304", // sterili che possono generare acido prodotti dalla lavorazione di minerale solforoso
  "010305", // altri sterili contenenti sostanze pericolose
  "010307", // altri rifiuti contenenti sostanze pericolose prodotte da trattamenti chimici e fisici di minerali metalliferi
  "010310", // fanghi rossi derivanti dalla produzione di allumina contenenti sostanze pericolose, diversi da quelli di cui alla voce 01 03 07
  "010407", // rifiuti contenenti sostanze pericolose, prodotti da trattamenti chimici e fisici di minerali non metalliferi
  "010505", // fanghi di perforazione e rifiuti contenenti petrolio
  "010506", // fanghi di perforazione ed altri rifiuti di perforazione contenenti sostanze pericolose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 02 - Rifiuti prodotti da agricoltura, orticoltura, acquacoltura, silvicoltura, caccia e pesca; trattamento e preparazione di alimenti
  // ──────────────────────────────────────────────────────────────────
  "020108", // rifiuti agrochimici contenenti sostanze pericolose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 03 - Rifiuti della lavorazione del legno e della produzione di pannelli, mobili, pasta per carta, carta e cartone
  // ──────────────────────────────────────────────────────────────────
  "030104", // segatura, trucioli, residui di taglio, legno, pannelli di truciolare e piallacci contenenti sostanze pericolose
  "030201", // preservanti del legno contenenti composti organici non alogenati
  "030202", // prodotti per i trattamenti conservativi del legno contenenti composti organici clorurati
  "030203", // prodotti per i trattamenti conservativi del legno contenenti composti organometallici
  "030204", // prodotti per i trattamenti conservativi del legno contenenti composti inorganici
  "030205", // altri prodotti per i trattamenti conservativi del legno contenenti sostanze pericolose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 04 - Rifiuti della lavorazione di pelli e pellicce e dell'industria tessile
  // ──────────────────────────────────────────────────────────────────
  "040103", // bagni di sgrassatura esauriti contenenti solventi senza fase liquida
  "040214", // rifiuti provenienti da operazioni di finitura, contenenti solventi organici
  "040216", // tinture e pigmenti contenenti sostanze pericolose
  "040219", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 05 - Rifiuti della raffinazione del petrolio, purificazione del gas naturale e trattamento pirolitico del carbone
  // ──────────────────────────────────────────────────────────────────
  "050102", // fanghi da processi di dissalazione
  "050103", // morchie da fondi di serbatoi
  "050104", // fanghi di alchili acidi
  "050105", // perdite di olio
  "050106", // fanghi oleosi prodotti dalla manutenzione di impianti e apparecchiature
  "050107", // catrami acidi
  "050108", // altri catrami
  "050109", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose
  "050111", // rifiuti prodotti dalla purificazione di carburanti mediante basi
  "050112", // acidi contenenti oli
  "050115", // filtri di argilla esauriti
  "050601", // catrami acidi
  "050603", // altri catrami
  "050701", // rifiuti contenenti mercurio

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 06 - Rifiuti dei processi chimici inorganici
  // ──────────────────────────────────────────────────────────────────
  "060101", // acido solforico e acido solforoso
  "060102", // acido cloridrico
  "060103", // acido fluoridrico
  "060104", // acido fosforico e fosforoso
  "060105", // acido nitrico e acido nitroso
  "060106", // altri acidi
  "060201", // idrossido di calcio
  "060203", // idrossido di ammonio
  "060204", // idrossido di sodio e di potassio
  "060205", // altre basi
  "060311", // sali e loro soluzioni, contenenti cianuri
  "060313", // sali e loro soluzioni, contenenti metalli pesanti
  "060315", // ossidi metallici contenenti metalli pesanti
  "060403", // rifiuti contenenti arsenico
  "060404", // rifiuti contenenti mercurio
  "060405", // rifiuti contenenti altri metalli pesanti
  "060502", // fanghi prodotti dal trattamento in loco di effluenti, contenenti sostanze pericolose
  "060602", // rifiuti contenenti solfuri pericolosi
  "060701", // rifiuti dei processi elettrolitici, contenenti amianto
  "060702", // carbone attivato dalla produzione di cloro
  "060703", // fanghi di solfati di bario, contenenti mercurio
  "060704", // soluzioni ed acidi, ad esempio acido di contatto
  "060802", // rifiuti contenenti clorosilani pericolosi
  "060903", // rifiuti prodotti da reazioni a base di calcio contenenti o contaminati da sostanze pericolose
  "061002", // rifiuti contenenti sostanze pericolose
  "061301", // prodotti fitosanitari, agenti conservativi del legno ed altri biocidi inorganici
  "061302", // carbone attivo esaurito (tranne 06 07 02)
  "061304", // rifiuti derivanti dai processi di lavorazione dell'amianto
  "061305", // Fuliggine

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 07 - Rifiuti dei processi chimici organici
  // ──────────────────────────────────────────────────────────────────
  "070101", // soluzioni acquose di lavaggio e acque madri
  "070103", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070104", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070107", // fondi e residui di reazione, alogenati
  "070108", // altri fondi e residui di reazione
  "070109", // residui di filtrazione e assorbenti esauriti alogenati
  "070110", // altri residui di filtrazione e assorbenti esauriti
  "070111", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070201", // soluzioni acquose di lavaggio e acque madri
  "070203", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070204", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070207", // fondi e residui di reazione, alogenati
  "070208", // altri fondi e residui di reazione
  "070209", // residui di filtrazione e assorbenti esauriti alogenati
  "070210", // altri residui di filtrazione e assorbenti esauriti
  "070211", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070214", // rifiuti prodotti da additivi, contenenti sostanze pericolose
  "070216", // rifiuti contenenti siliconi pericolosi
  "070301", // soluzioni acquose di lavaggio e acque madri
  "070303", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070304", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070307", // fondi e residui di reazione, alogenati
  "070308", // altri fondi e residui di reazione
  "070309", // residui di filtrazione e assorbenti esauriti, alogenati
  "070310", // altri residui di filtrazione e assorbenti esauriti
  "070311", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070401", // soluzioni acquose di lavaggio e acque madri
  "070403", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070404", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070407", // fondi e residui di reazione, alogenati
  "070408", // altri fondi e residui di reazione
  "070409", // residui di filtrazione e assorbenti esauriti alogenati
  "070410", // altri residui di filtrazione e assorbenti esauriti
  "070411", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070413", // rifiuti solidi contenenti sostanze pericolose
  "070501", // soluzioni acquose di lavaggio e acque madri
  "070503", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070504", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070507", // fondi e residui di reazione, alogenati
  "070508", // altri fondi e residui di reazione
  "070509", // residui di filtrazione e assorbenti esauriti alogenati
  "070510", // altri residui di filtrazione e assorbenti esauriti
  "070511", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose
  "070513", // rifiuti solidi contenenti sostanze pericolose
  "070601", // soluzioni acquose di lavaggio e acque madri
  "070603", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070604", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070607", // fondi e residui di reazione, alogenati
  "070608", // altri fondi e residui di reazione
  "070609", // residui di filtrazione e assorbenti esauriti alogenati
  "070610", // altri residui di filtrazione e assorbenti esauriti
  "070611", // fanghi prodotti dal trattamento in loco di effluenti contenenti sostanze pericolose
  "070701", // soluzioni acquose di lavaggio e acque madri
  "070703", // solventi organici alogenati, soluzioni di lavaggio e acque madri
  "070704", // altri solventi organici, soluzioni di lavaggio e acque madri
  "070707", // residui di distillazione e residui di reazione, alogenati
  "070708", // altri residui di distillazione e residui di reazione
  "070709", // residui di filtrazione e assorbenti esauriti alogenati
  "070710", // altri residui di filtrazione e assorbenti esauriti
  "070711", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 08 - Rifiuti da produzione, formulazione, fornitura ed uso di rivestimenti, adesivi, sigillanti e inchiostri
  // ──────────────────────────────────────────────────────────────────
  "080111", // pitture e vernici di scarto, contenenti solventi organici o altre sostanze pericolose
  "080113", // fanghi prodotti da pitture e vernici, contenenti solventi organici o altre sostanze pericolose
  "080115", // fanghi acquosi contenenti pitture e vernici, contenenti solventi organici o altre sostanze pericolose
  "080117", // fanghi prodotti dalla rimozione di pitture e vernici, contenenti solventi organici o altre sostanze perico­ lose
  "080119", // sospensioni acquose contenenti pitture e vernici, contenenti solventi organici o altre sostanze pericolose
  "080121", // residui di pittura o di sverniciatori
  "080312", // scarti di inchiostro, contenenti sostanze pericolose
  "080314", // fanghi di inchiostro, contenenti sostanze pericolose
  "080316", // residui di soluzioni per incisione
  "080317", // toner per stampa esauriti, contenenti sostanze pericolose
  "080319", // oli disperdenti
  "080409", // adesivi e sigillanti di scarto, contenenti solventi organici o altre sostanze pericolose
  "080411", // fanghi di adesivi e sigillanti, contenenti solventi organici o altre sostanze pericolose
  "080413", // fanghi acquosi contenenti adesivi o sigillanti, contenenti solventi organici o altre sostanze pericolose
  "080415", // rifiuti liquidi acquosi contenenti adesivi o sigillanti, contenenti solventi organici o altre sostanze perico­ lose
  "080417", // olio di resina
  "080501", // isocianati di scarto

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 09 - Rifiuti dell'industria fotografica
  // ──────────────────────────────────────────────────────────────────
  "090101", // soluzioni di sviluppo e soluzioni attivanti a base acquosa
  "090102", // soluzioni di sviluppo per lastre offset a base acquosa
  "090103", // soluzioni di sviluppo a base di solventi
  "090104", // soluzioni di fissaggio
  "090105", // soluzioni di lavaggio e di lavaggio del fissatore
  "090106", // rifiuti contenenti argento prodotti dal trattamento in loco di rifiuti fotografici
  "090111", // macchine fotografiche monouso contenenti batterie incluse nelle voci 16 06 01, 16 06 02 o 16 06 03
  "090113", // rifiuti liquidi acquosi prodotti dal recupero in loco dell'argento, diversi da quelli di cui alla voce 09 01 06

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 10 - Rifiuti provenienti da processi termici
  // ──────────────────────────────────────────────────────────────────
  "100104", // ceneri leggere di olio combustibile e polveri di caldaia
  "100109", // acido solforico
  "100113", // ceneri leggere prodotte da idrocarburi emulsionati usati come combustibile
  "100114", // ceneri pesanti, scorie e polveri di caldaia prodotte dal coincenerimento, contenenti sostanze pericolose
  "100116", // ceneri leggere prodotte dal coincenerimento, contenenti sostanze pericolose
  "100118", // rifiuti prodotti dalla depurazione dei fumi, contenenti sostanze pericolose
  "100120", // fanghi prodotti dal trattamento in loco degli effluenti, contenenti sostanze pericolose
  "100122", // fanghi acquosi da operazioni di pulizia di caldaie, contenenti sostanze pericolose
  "100207", // rifiuti solidi prodotti dal trattamento dei fumi, contenenti sostanze pericolose
  "100211", // rifiuti prodotti dal trattamento delle acque di raffreddamento, contenenti oli
  "100213", // fanghi e residui di filtrazione prodotti dal trattamento dei fumi, contenenti sostanze pericolose
  "100304", // scorie della produzione primaria
  "100308", // scorie saline della produzione secondaria
  "100309", // scorie nere della produzione secondaria
  "100315", // schiumature infiammabili o che rilasciano, al contatto con l'acqua, gas infiammabili in quantità pericolose
  "100317", // rifiuti contenenti catrame derivanti dalla produzione di anodi
  "100319", // polveri dei gas di combustione contenenti sostanze pericolose
  "100321", // altri particolati e polveri (compresi quelli prodotti da mulini a palle), contenenti sostanze pericolose
  "100323", // rifiuti solidi prodotti dal trattamento dei fumi, contenenti sostanze pericolose
  "100325", // fanghi e residui di filtrazione prodotti dal trattamento dei fumi, contenenti sostanze pericolose
  "100327", // rifiuti prodotti dal trattamento delle acque di raffreddamento, contenenti oli
  "100329", // rifiuti prodotti dal trattamento di scorie saline e scorie nere, contenenti sostanze pericolose
  "100401", // scorie della produzione primaria e secondaria
  "100402", // scorie e schiumature della produzione primaria e secondaria
  "100403", // arsenato di calcio
  "100404", // polveri di gas di combustione
  "100405", // altre polveri e particolato
  "100406", // rifiuti solidi prodotti dal trattamento dei fumi
  "100407", // fanghi e residui di filtrazione prodotti dal trattamento dei fumi
  "100409", // rifiuti prodotti dal trattamento delle acque di raffreddamento, contenenti oli
  "100503", // polveri di gas di combustione
  "100505", // rifiuti solidi derivanti dal trattamento dei fumi
  "100506", // fanghi e residui di filtrazione prodotti dal trattamento dei fumi
  "100508", // rifiuti prodotti dal trattamento delle acque di raffreddamento, contenenti oli
  "100510", // scorie e schiumature infiammabili o che rilasciano, al contatto con l'acqua, gas infiammabili in quantità pericolose
  "100603", // polveri di gas di combustione
  "100606", // rifiuti solidi prodotti dal trattamento dei fumi
  "100607", // fanghi e residui di filtrazione prodotti dal trattamento dei fumi
  "100609", // rifiuti prodotti dal trattamento delle acque di raffreddamento, contenenti oli
  "100707", // rifiuti prodotti dal trattamento delle acque di raffreddamento, contenenti oli
  "100808", // scorie saline della produzione primaria e secondaria
  "100810", // scorie e schiumature infiammabili o che rilasciano, al contatto con l'acqua, gas infiammabili in quantità pericolose
  "100812", // rifiuti contenenti catrame derivanti dalla produzione di anodi
  "100815", // polveri dei gas di combustione contenenti sostanze pericolose
  "100817", // fanghi e residui di filtrazione prodotti dal trattamento di fumi, contenenti sostanze pericolose
  "100819", // rifiuti prodotti dal trattamento delle acque di raffreddamento, contenenti oli
  "100905", // forme e anime da fonderia inutilizzate, contenenti sostanze pericolose
  "100907", // forme e anime da fonderia utilizzate, contenenti sostanze pericolose
  "100909", // polveri dei gas di combustione contenenti sostanze pericolose
  "100911", // altri particolati contenenti sostanze pericolose
  "100913", // scarti di leganti contenenti sostanze pericolose
  "100915", // scarti di rilevatori di crepe, contenenti sostanze pericolose
  "101005", // forme e anime da fonderia inutilizzate, contenenti sostanze pericolose
  "101007", // forme e anime da fonderia utilizzate, contenenti sostanze pericolose
  "101009", // polveri di gas di combustione contenenti sostanze pericolose
  "101011", // altri particolati contenenti sostanze pericolose
  "101013", // scarti di leganti contenenti sostanze pericolose
  "101015", // scarti di rilevatori di crepe, contenenti sostanze pericolose
  "101109", // residui di miscela di preparazione non sottoposti a trattamento termico, contenenti sostanze pericolose
  "101111", // rifiuti di vetro in forma di particolato e polveri di vetro contenenti metalli pesanti (provenienti ad esempio da tubi a raggi catodici)
  "101113", // fanghi provenienti dalla lucidatura e dalla macinazione del vetro, contenenti sostanze pericolose
  "101115", // rifiuti solidi prodotti dal trattamento di fumi, contenenti sostanze pericolose
  "101117", // fanghi e residui di filtrazione prodotti dal trattamento dei fumi, contenenti sostanze pericolose
  "101119", // rifiuti solidi prodotti dal trattamento in loco di effluenti, contenenti sostanze pericolose
  "101209", // rifiuti solidi prodotti dal trattamento dei fumi, contenenti sostanze pericolose
  "101211", // rifiuti delle operazioni di smaltatura, contenenti metalli pesanti
  "101309", // rifiuti della fabbricazione di cemento-amianto, contenenti amianto
  "101312", // rifiuti solidi prodotti dal trattamento dei fumi, contenenti sostanze pericolose
  "101401", // rifiuti prodotti dalla depurazione dei fumi, contenenti mercurio

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 11 - Rifiuti prodotti dal trattamento chimico superficiale e dal rivestimento di metalli e altri materiali
  // ──────────────────────────────────────────────────────────────────
  "110105", // acidi di decappaggio
  "110106", // acidi non specificati altrimenti
  "110107", // basi di decappaggio
  "110108", // fanghi di fosfatazione
  "110109", // fanghi e residui di filtrazione, contenenti sostanze pericolose
  "110111", // soluzioni acquose di risciacquo, contenenti sostanze pericolose
  "110113", // rifiuti di sgrassaggio contenenti sostanze pericolose
  "110115", // eluati e fanghi di sistemi a membrana o sistemi a scambio ionico, contenenti sostanze pericolose
  "110116", // resine a scambio ionico saturate o esaurite
  "110198", // altri rifiuti contenenti sostanze pericolose
  "110202", // rifiuti da processi idrometallurgici dello zinco (compresi jarosite, goethite)
  "110205", // rifiuti da processi idrometallurgici del rame, contenenti sostanze pericolose
  "110207", // altri rifiuti contenenti sostanze pericolose
  "110301", // rifiuti contenenti cianuro
  "110302", // altri rifiuti
  "110503", // rifiuti solidi prodotti dal trattamento dei fumi
  "110504", // fondente esaurito

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 12 - Rifiuti dalla lavorazione e dal trattamento fisico e meccanico superficiale di metalli e plastica
  // ──────────────────────────────────────────────────────────────────
  "120106", // oli minerali per macchinari, contenenti alogeni (eccetto emulsioni e soluzioni)
  "120107", // oli minerali per macchinari, non contenenti alogeni (eccetto emulsioni e soluzioni)
  "120108", // emulsioni e soluzioni per macchinari, contenenti alogeni
  "120109", // emulsioni e soluzioni per macchinari, non contenenti alogeni
  "120110", // oli sintetici per macchinari
  "120112", // cere e grassi esauriti
  "120114", // fanghi di lavorazione, contenenti sostanze pericolose
  "120116", // residui di materiale di sabbiatura, contenente sostanze pericolose
  "120118", // fanghi metallici (fanghi di rettifica, affilatura e lappatura) contenenti oli
  "120119", // oli per macchinari, facilmente biodegradabili
  "120120", // corpi d'utensile e materiali di rettifica esauriti, contenenti sostanze pericolose
  "120301", // soluzioni acquose di lavaggio
  "120302", // rifiuti prodotti da processi di sgrassatura a vapore

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 13 - Oli esauriti e residui di combustibili liquidi
  // ──────────────────────────────────────────────────────────────────
  "130101", // oli per circuiti idraulici contenenti PCB
  "130104", // emulsioni clorurate
  "130105", // emulsioni non clorurate
  "130109", // oli minerali per circuiti idraulici, clorurati
  "130110", // oli minerali per circuiti idraulici, non clorurati
  "130111", // oli sintetici per circuiti idraulici
  "130112", // oli per circuiti idraulici, facilmente biodegradabili
  "130113", // altri oli per circuiti idraulici
  "130204", // oli minerali per motori, ingranaggi e lubrificazione, clorurati
  "130205", // oli minerali per motori, ingranaggi e lubrificazione, non clorurati
  "130206", // oli sintetici per motori, ingranaggi e lubrificazione
  "130207", // oli per motori, ingranaggi e lubrificazione, facilmente biodegradabili
  "130208", // altri oli per motori, ingranaggi e lubrificazione
  "130301", // oli isolanti e oli termovettori, contenenti PCB
  "130306", // oli isolanti e termovettori minerali clorurati, diversi da quelli di cui alla voce 13 03 01
  "130307", // oli isolanti e termovettori minerali non clorurati
  "130308", // oli sintetici isolanti e oli termovettori
  "130309", // oli isolanti e oli termovettori, facilmente biodegradabili
  "130310", // altri oli isolanti e oli termovettori
  "130401", // oli di sentina da navigazione interna
  "130402", // oli di sentina derivanti dalle fognature dei moli
  "130403", // oli di sentina da un altro tipo di navigazione
  "130501", // rifiuti solidi delle camere a sabbia e di prodotti di separazione olio/acqua
  "130502", // fanghi di prodotti di separazione olio/acqua
  "130503", // fanghi da collettori
  "130506", // oli prodotti da separatori olio/acqua
  "130507", // acque oleose prodotte da separatori olio/acqua
  "130508", // miscugli di rifiuti prodotti da camere a sabbia e separatori olio/acqua
  "130701", // olio combustibile e carburante diesel
  "130702", // Benzina
  "130703", // altri carburanti (comprese le miscele)
  "130801", // fanghi e emulsioni da processi di dissalazione
  "130802", // altre emulsioni
  "130899", // rifiuti non specificati altrimenti

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 14 - Solventi organici, refrigeranti e propellenti di scarto
  // ──────────────────────────────────────────────────────────────────
  "140601", // clorofluorocarburi, HCFC, HFC
  "140602", // altri solventi e miscele di solventi alogenati
  "140603", // altri solventi e miscele di solventi
  "140604", // fanghi o rifiuti solidi, contenenti solventi alogenati
  "140605", // fanghi o rifiuti solidi, contenenti altri solventi

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 15 - Imballaggi, assorbenti, stracci, materiali filtranti e indumenti protettivi
  // ──────────────────────────────────────────────────────────────────
  "150110", // imballaggi contenenti residui di sostanze pericolose o contaminati da tali sostanze
  "150111", // imballaggi metallici contenenti matrici solide porose pericolose (ad esempio amianto), compresi conteni­ tori a pressione vuoti
  "150202", // assorbenti, materiali filtranti (inclusi filtri dell'olio non specificati altrimenti), stracci e indumenti protettivi, contaminati da sostanze pericolose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 16 - Rifiuti non specificati altrimenti nell'elenco
  // ──────────────────────────────────────────────────────────────────
  "160104", // veicoli fuori uso
  "160107", // filtri dell'olio
  "160108", // componenti contenenti mercurio
  "160109", // componenti contenenti PCB
  "160110", // componenti esplosivi (ad esempio «air bag»)
  "160111", // pastiglie per freni, contenenti amianto
  "160113", // liquidi per freni
  "160114", // liquidi antigelo contenenti sostanze pericolose
  "160121", // componenti pericolosi diversi da quelli di cui alle voci da 16 01 07 a 16 01 11, 16 01 13 e 16 01 14
  "160209", // trasformatori e condensatori contenenti PCB
  "160210", // apparecchiature fuori uso contenenti PCB o da essi contaminate, diverse da quelle di cui alla voce
  "160211", // apparecchiature fuori uso, contenenti clorofluorocarburi, HCFC, HFC
  "160212", // apparecchiature fuori uso, contenenti amianto in fibre libere
  "160213", // apparecchiature fuori uso, contenenti componenti pericolosi (1) diversi da quelli di cui alle voci da 16 02 09 a 16 02 12
  "160215", // componenti pericolosi rimossi da apparecchiature fuori uso
  "160303", // rifiuti inorganici contenenti sostanze pericolose
  "160305", // rifiuti organici, contenenti sostanze pericolose
  "160307", // mercurio metallico
  "160401", // munizioni di scarto
  "160402", // fuochi artificiali di scarto
  "160403", // altri esplosivi di scarto
  "160504", // gas in contenitori a pressione (compresi gli halon), contenenti sostanze pericolose
  "160506", // sostanze chimiche di laboratorio contenenti o costituite da sostanze pericolose, comprese le miscele di sostanze chimiche di laboratorio
  "160507", // sostanze chimiche inorganiche di scarto contenenti o costituite da sostanze pericolose
  "160508", // sostanze chimiche organiche di scarto contenenti o costituite da sostanze pericolose
  "160601", // batterie al piombo
  "160602", // batterie al nichel-cadmio
  "160603", // batterie contenenti mercurio
  "160606", // elettroliti di batterie e accumulatori, oggetto di raccolta differenziata
  "160708", // rifiuti contenenti oli
  "160709", // rifiuti contenenti altre sostanze pericolose
  "160802", // catalizzatori esauriti contenenti metalli di transizione pericolosi o composti di metalli di transizione peri­ colosi
  "160805", // catalizzatori esauriti contenenti acido fosforico
  "160806", // liquidi esauriti usati come catalizzatori
  "160807", // catalizzatori esauriti contaminati da sostanze pericolose
  "160901", // permanganati, ad esempio permanganato di potassio
  "160902", // cromati, ad esempio cromato di potassio, dicromato di potassio o di sodio
  "160903", // perossidi, ad esempio perossido d'idrogeno
  "160904", // sostanze ossidanti non specificate altrimenti
  "161001", // rifiuti liquidi acquosi, contenenti sostanze pericolose
  "161003", // concentrati acquosi, contenenti sostanze pericolose
  "161101", // rivestimenti e materiali refrattari a base di carbone provenienti da processi metallurgici, contenenti sostanze pericolose
  "161103", // altri rivestimenti e materiali refrattari provenienti da processi metallurgici, contenenti sostanze pericolose
  "161105", // rivestimenti e materiali refrattari provenienti da lavorazioni non metallurgiche, contenenti sostanze perico­ lose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 17 - Rifiuti delle operazioni di costruzione e demolizione
  // ──────────────────────────────────────────────────────────────────
  "170106", // miscugli o frazioni separate di cemento, mattoni, mattonelle e ceramiche, contenenti sostanze pericolose
  "170204", // vetro, plastica e legno contenenti sostanze pericolose o da esse contaminati
  "170301", // miscele bituminose contenenti catrame di carbone
  "170303", // catrame di carbone e prodotti contenenti catrame
  "170409", // rifiuti metallici contaminati da sostanze pericolose
  "170410", // cavi impregnati di olio, di catrame di carbone o di altre sostanze pericolose
  "170503", // terra e rocce, contenenti sostanze pericolose
  "170505", // materiale di dragaggio contenente sostanze pericolose
  "170507", // pietrisco per massicciate ferroviarie, contenente sostanze pericolose
  "170601", // materiali isolanti, contenenti amianto
  "170603", // altri materiali isolanti contenenti o costituiti da sostanze pericolose
  "170605", // materiali da costruzione contenenti amianto
  "170801", // materiali da costruzione a base di gesso contaminati da sostanze pericolose
  "170901", // rifiuti dell'attività di costruzione e demolizione, contenenti mercurio
  "170902", // rifiuti dell'attività di costruzione e demolizione, contenenti PCB (ad esempio sigillanti contenenti PCB, pavimentazioni a base di resina contenenti PCB, elementi stagni in vetro contenenti PCB, condensatori contenenti PCB)
  "170903", // altri rifiuti dell'attività di costruzione e demolizione (compresi rifiuti misti) contenenti sostanze pericolose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 18 - Rifiuti prodotti dal settore sanitario e veterinario o da attività di ricerca collegate
  // ──────────────────────────────────────────────────────────────────
  "180103", // rifiuti che devono essere raccolti e smaltiti applicando precauzioni particolari per evitare infezioni
  "180106", // sostanze chimiche pericolose o contenenti sostanze pericolose
  "180108", // medicinali citotossici e citostatici
  "180110", // rifiuti di amalgama prodotti da interventi odontoiatrici
  "180202", // rifiuti che devono essere raccolti e smaltiti applicando precauzioni particolari per evitare infezioni
  "180205", // sostanze chimiche pericolose o contenenti sostanze pericolose
  "180207", // medicinali citotossici e citostatici

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 19 - Rifiuti prodotti da impianti di trattamento dei rifiuti, acque reflue e potabilizzazione
  // ──────────────────────────────────────────────────────────────────
  "190105", // residui di filtrazione prodotti dal trattamento dei fumi
  "190106", // rifiuti liquidi acquosi prodotti dal trattamento dei fumi e altri rifiuti liquidi acquosi
  "190107", // rifiuti solidi prodotti dal trattamento dei fumi
  "190110", // carbone attivo esaurito prodotto dal trattamento dei fumi
  "190111", // ceneri pesanti e scorie, contenenti sostanze pericolose
  "190113", // ceneri leggere, contenenti sostanze pericolose
  "190115", // polveri di caldaia, contenenti sostanze pericolose
  "190117", // rifiuti della pirolisi, contenenti sostanze pericolose
  "190204", // Rifiuti premiscelati contenenti almeno un rifiuto pericoloso
  "190205", // fanghi prodotti da trattamenti chimico-fisici, contenenti sostanze pericolose
  "190207", // oli e concentrati prodotti da processi di separazione
  "190208", // rifiuti combustibili liquidi, contenenti sostanze pericolose
  "190209", // rifiuti combustibili solidi, contenenti sostanze pericolose
  "190211", // altri rifiuti contenenti sostanze pericolose
  "190304", // rifiuti contrassegnati come pericolosi, parzialmente stabilizzati diversi da quelli di cui al punto 19 03 08
  "190306", // rifiuti contrassegnati come pericolosi, solidificati
  "190308", // mercurio parzialmente stabilizzato
  "190402", // ceneri leggere ed altri rifiuti dal trattamento dei fumi
  "190403", // fase solida non vetrificata
  "190702", // percolato di discarica, contenente sostanze pericolose
  "190806", // resine a scambio ionico saturate o esaurite
  "190807", // soluzioni e fanghi di rigenerazione degli scambiatori di ioni
  "190808", // rifiuti prodotti da sistemi a membrana, contenenti sostanze pericolose
  "190810", // miscele di oli e grassi prodotte dalla separazione olio/acqua, diverse da quelle di cui alla voce 19 08 09
  "190811", // fanghi prodotti dal trattamento biologico di acque reflue industriali, contenenti sostanze pericolose
  "190813", // fanghi contenenti sostanze pericolose prodotti da altri trattamenti di acque reflue industriali
  "191003", // frazioni leggere di frammentazione (fluff-light) e polveri, contenenti sostanze pericolose
  "191005", // altre frazioni, contenenti sostanze pericolose
  "191101", // filtri di argilla esauriti
  "191102", // catrami acidi
  "191103", // rifiuti liquidi acquosi
  "191104", // rifiuti prodotti dalla purificazione di carburanti mediante basi
  "191105", // fanghi prodotti dal trattamento in loco di effluenti, contenenti sostanze pericolose
  "191107", // rifiuti prodotti dalla depurazione di fumi
  "191206", // legno, contenente sostanze pericolose
  "191211", // altri rifiuti (compresi materiali misti) prodotti dal trattamento meccanico di rifiuti, contenenti sostanze pericolose
  "191301", // rifiuti solidi prodotti da operazioni di bonifica di terreni, contenenti sostanze pericolose
  "191303", // fanghi prodotti dalle operazioni di bonifica di terreni, contenenti sostanze pericolose
  "191305", // fanghi prodotti dalle operazioni di risanamento delle acque di falda, contenenti sostanze pericolose
  "191307", // rifiuti liquidi acquosi e rifiuti concentrati acquosi prodotti dalle operazioni di risanamento delle acque di falda, contenenti sostanze pericolose

  // ──────────────────────────────────────────────────────────────────
  // CAPITOLO 20 - Rifiuti urbani inclusi i rifiuti della raccolta differenziata
  // ──────────────────────────────────────────────────────────────────
  "200113", // Solventi
  "200114", // Acidi
  "200115", // Sostanze alcaline
  "200117", // Prodotti fotochimici
  "200119", // Pesticidi
  "200121", // tubi fluorescenti ed altri rifiuti contenenti mercurio
  "200123", // apparecchiature fuori uso contenenti clorofluorocarburi
  "200126", // oli e grassi diversi da quelli di cui alla voce 20 01 25
  "200127", // vernici, inchiostri, adesivi e resine contenenti sostanze pericolose
  "200129", // detergenti, contenenti sostanze pericolose
  "200131", // medicinali citotossici e citostatici
  "200133", // batterie e accumulatori di cui alle voci 16 06 01, 16 06 02 e 16 06 03, nonché batterie e accumulatori non suddivisi contenenti tali batterie
  "200135", // apparecchiature elettriche ed elettroniche fuori uso, diverse da quelle di cui alla voce 20 01 21 e 20 01 23, contenenti componenti pericolosi (1)
  "200137", // legno contenente sostanze pericolose

]);
