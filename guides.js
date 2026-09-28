/*
  MV Polering Support – alle guides.

  Hver guide har:
    id        unikt, bruges i linket (#id)
    title     overskrift
    category  Printer | App | Tablet | Batteri | Netværk | Skærm | Lyd | S Pen | Indstillinger
    summary   én linje der beskriver symptomet (vises på kortet)
    tags      søgeord
    steps     trin i rækkefølge. type:
                text    almindeligt trin
                note    "Godt at vide" (grøn)
                warn    "Vigtigt" (orange)
                danger  "Kontakt support" (rød)

  Udstyr: Samsung Galaxy Tab S6 Lite / Tab S10 Lite (One UI) og Epson TM-P20II Bluetooth-bonprinter.
  Menunavne er tjekket på Galaxy Tab S10 Lite (One UI 8.5, dansk) den 28.9.2026. Ældre One UI-versioner kan afvige lidt.
*/
window.RAW_GUIDES = [

  /* =====================================================================
     PRINTER – Epson TM-P20II
     ===================================================================== */
  {
    id: 'printer-tilslutning',
    title: 'Tilføj printer til tablet og app',
    category: 'Printer',
    summary: 'Par en ny eller nulstillet printer med tabletten og vælg den i MV-appen.',
    tags: ['Bluetooth', 'Parring', 'Opsætning', 'Ny printer'],
    steps: [
      { type: 'text', body: 'Tænd printeren, og vent ca. 40 sekunder. Bluetooth er først klar, når printeren er helt startet op.' },
      { type: 'text', body: 'Træk toppanelet ned på tabletten, og hold fingeren på Bluetooth-ikonet for at åbne Bluetooth-indstillingerne.' },
      { type: 'warn', body: 'Er der allerede en printer på listen, så tryk på tandhjulet ud for dens navn (TM-P20II_xxxxxx) og vælg "Ophæv parring". Printeren kan kun være forbundet til én enhed ad gangen.' },
      { type: 'text', body: 'Åbn printerens låg, som når du skifter bonrulle. Der skal være papir i.' },
      { type: 'text', body: 'Hold "Feed"-knappen (til højre for tænd/sluk) inde i ca. 1 sekund, indtil printeren bipper.' },
      { type: 'text', body: 'Luk låget. Printeren skriver nu en lille vejledning ud.' },
      { type: 'text', body: 'Tryk én gang kort på "Feed", og hold derefter "Feed" inde i mindst 1 sekund. Printeren skriver et Bluetooth-statusark ud, og Bluetooth-lampen begynder at blinke.' },
      { type: 'warn', body: 'Printeren kan nu findes i 1 minut. Blinker Bluetooth-lampen ikke, så gentag de to trin ovenfor.' },
      { type: 'text', body: 'På tabletten: find printeren på listen over tilgængelige enheder. Navnet er TM-P20II_ efterfulgt af de sidste 6 tegn i serienummeret.' },
      { type: 'warn', body: 'Vælg navnet UDEN "-L" til sidst. Navnet med "-L" er en anden type forbindelse, som appen ikke bruger.' },
      { type: 'text', body: 'Tryk på printerens navn, og par. Der skal normalt ikke indtastes nogen kode.' },
      { type: 'text', body: 'Åbn MV Polering-appen, gå ind i Indstillinger, og scroll ned til "Printere".' },
      { type: 'text', body: 'Søg efter printeren, og vælg den.' },
      { type: 'note', body: 'Din printer er nu tilknyttet. Lav et testprint, så du er sikker på, at det virker.' }
    ]
  },
  {
    id: 'printer-lamper',
    title: 'Hvad betyder lamperne på printeren?',
    category: 'Printer',
    summary: 'Oversigt over Power-, Error-, Charge-, Batteri- og Bluetooth-lampen på TM-P20II.',
    tags: ['LED', 'Lamper', 'Orange lampe', 'Blå lampe', 'Fejl'],
    steps: [
      { type: 'note', body: 'Power (blå): Lyser = printeren er tændt. Blinker = printeren er ved at slukke, opdatere eller starte op. Vent, til den lyser fast.' },
      { type: 'note', body: 'Error (orange) lyser FAST: Printeren er ikke klar, men det er ikke en fejl. Låget er åbent, der er ikke papir, batteriet er helt fladt, eller printeren er lige tændt.' },
      { type: 'warn', body: 'Error (orange) BLINKER hurtigt, og Batteri- og Bluetooth-lamperne er slukkede: Alvorlig fejl. Sluk printeren straks. Tag batteriet ud i 10 sekunder, sæt det i og tænd igen.' },
      { type: 'note', body: 'Charge: Lyser = oplader. Slukket = fuldt opladet eller ikke tilsluttet. Blinker = opladning er stoppet, fordi det er for koldt/varmt, eller fordi batteriet er defekt.' },
      { type: 'note', body: 'Batteri (3 små lamper): 3 lamper = 60-100 %. 2 lamper = 20-60 %. 1 lampe = 10-20 %. 1 lampe der blinker = under 10 %, udskrifter kan stoppe midt i. Ingen lamper + Error lyser = helt fladt.' },
      { type: 'note', body: 'Bluetooth: Lyser = forbundet til tabletten. Blinker = venter på parring (1 minut). Slukket = ikke forbundet.' },
      { type: 'danger', body: 'Blinker Error-lampen stadig hurtigt efter batteriet har været ude, så er printeren defekt. Kontakt IT-support.' }
    ]
  },
  {
    id: 'printer-advarsel',
    title: 'Orange lampe på printer, og den vil ikke printe',
    category: 'Printer',
    summary: 'Error-lampen lyser eller blinker, og printeren reagerer ikke på udskrifter.',
    tags: ['Advarsel', 'Udråbstegn', 'Orange lampe', 'Error', 'Fejl'],
    steps: [
      { type: 'note', body: 'Lyser lampen FAST, er printeren bare "optaget": låg åbent, intet papir, fladt batteri eller lige tændt.' },
      { type: 'text', body: 'Tjek at låget er lukket helt til. Det skal klikke.' },
      { type: 'text', body: 'Åbn låget, og tjek at der er papir, og at bonrullen ligger rigtigt (papiret skal komme ud fra rullens underside, mod dig).' },
      { type: 'text', body: 'Tjek batterilamperne. Er alle slukkede, så sæt printeren til opladning i mindst 30 minutter.' },
      { type: 'text', body: 'Tjek for papirstop eller fremmedlegemer i printeren. Fjern eventuelle papirstumper.' },
      { type: 'text', body: 'Luk låget, og prøv at printe en testbon.' },
      { type: 'warn', body: 'Virker det ikke, så sluk printeren, vend den om, og tag batteriet ud i 10 sekunder.' },
      { type: 'text', body: 'Sæt batteriet i igen, tænd printeren, vent 40 sekunder og prøv igen.' },
      { type: 'warn', body: 'BLINKER lampen hurtigt, er det en alvorlig fejl. Sluk printeren straks, tag batteriet ud, og prøv én gang igen.' },
      { type: 'danger', body: 'Hjælper det ikke, så kontakt IT-support. Skriv om lampen lyste fast eller blinkede.' }
    ]
  },
  {
    id: 'printer-mister-forbindelse',
    title: 'Printeren mister forbindelsen eller står som "offline"',
    category: 'Printer',
    summary: 'Printeren har virket, men appen kan pludselig ikke printe, eller forbindelsen falder ud.',
    tags: ['Offline', 'Forbindelse', 'Bluetooth', 'Falder ud', 'Afbryder'],
    steps: [
      { type: 'text', body: 'Kig på printeren. Lyser den orange Error-lampe, så er problemet låg, papir eller batteri. Se guiden "Orange lampe på printer".' },
      { type: 'text', body: 'Lyser Bluetooth-lampen ikke, så sluk printeren, tænd den igen, og vent 40 sekunder. Gå derefter ind i appen og vælg printeren igen under Indstillinger > Printere.' },
      { type: 'warn', body: 'Printeren kan kun være forbundet til én tablet/telefon ad gangen. Er den parret med en anden enhed, som er tændt i nærheden, så sluk Bluetooth på den enhed.' },
      { type: 'text', body: 'Hold tabletten inden for ca. 10 meter fra printeren. Vægge, biler og andet elektronik forkorter rækkevidden.' },
      { type: 'note', body: 'Mister printeren forbindelsen, når tablettens skærm har været slukket et stykke tid, er det ofte tabletten der sætter MV-appen i dvale. Se guiden "Tabletten lukker appen i baggrunden".' },
      { type: 'text', body: 'Tjek at Strømbesparelse er slået fra på tabletten: Indstillinger > Batteri > Strømbesparelse.' },
      { type: 'text', body: 'Hjælper intet, så ophæv parringen på tabletten (Indstillinger > Forbindelse > Bluetooth > tandhjul > Ophæv parring), og par printeren igen. Se guiden "Tilføj printer til tablet og app".' },
      { type: 'danger', body: 'Falder forbindelsen stadig ud flere gange dagligt, så kontakt IT-support. Printerens firmware skal måske opdateres.' }
    ]
  },
  {
    id: 'app-printer-ikke-fundet',
    title: 'Appen kan ikke finde printeren, selvom den er parret',
    category: 'Printer',
    summary: 'Printeren står under Bluetooth på tabletten, men dukker ikke op i MV-appens printerliste.',
    tags: ['App', 'Ikke fundet', 'Søg', 'Parret', 'Bluetooth'],
    steps: [
      { type: 'text', body: 'Tjek at printeren er tændt, og at Bluetooth-lampen lyser fast. Blinker den, er den ikke forbundet endnu.' },
      { type: 'text', body: 'Gå til Indstillinger > Forbindelse > Bluetooth på tabletten, og tryk på printerens navn, så der står "Tilsluttet".' },
      { type: 'warn', body: 'Står der to printere, én med "-L" til sidst, så skal appen bruge den UDEN "-L". Ophæv gerne parringen med "-L"-udgaven.' },
      { type: 'text', body: 'Luk MV-appen helt (swipe den væk i oversigten over åbne apps), og åbn den igen.' },
      { type: 'text', body: 'Gå til Indstillinger > Printere i appen, og søg igen.' },
      { type: 'text', body: 'Dukker printeren stadig ikke op, så genstart tabletten og prøv igen.' },
      { type: 'danger', body: 'Hjælper det ikke, så kontakt IT-support.' }
    ]
  },
  {
    id: 'printer-flere-tablets',
    title: 'Brug printeren med en anden tablet',
    category: 'Printer',
    summary: 'Printeren skal skiftes fra én tablet til en anden, fx ved lån eller udskiftning.',
    tags: ['Skift tablet', 'Parring', 'Ny tablet', 'Bluetooth'],
    steps: [
      { type: 'note', body: 'Printeren kan kun være forbundet til én enhed ad gangen. Den gamle tablet skal derfor "slippe" printeren først.' },
      { type: 'text', body: 'På den gamle tablet: Indstillinger > Forbindelse > Bluetooth > tandhjulet ud for printeren > Ophæv parring. Eller sluk helt for Bluetooth på den.' },
      { type: 'text', body: 'Sluk printeren, og tænd den igen. Vent 40 sekunder.' },
      { type: 'text', body: 'Følg guiden "Tilføj printer til tablet og app" på den nye tablet.' },
      { type: 'note', body: 'Printeren kan huske op til 8 forskellige tabletter, men kun én kan være forbundet ad gangen.' }
    ]
  },
  {
    id: 'printer-halv-note',
    title: 'Printer udskriver kun delvist eller går i stå',
    category: 'Printer',
    summary: 'Bonen stopper midt i, eller printeren holder pause under udskrift.',
    tags: ['Stopper', 'Halv bon', 'Sensor', 'Kulde', 'Batteri'],
    steps: [
      { type: 'text', body: 'Tjek batterilamperne på printeren. Blinker den sidste lampe (under 10 %), kan udskrifter stoppe midt i. Sæt printeren til opladning.' },
      { type: 'note', body: 'Har printeren printet meget i træk, kan printhovedet blive for varmt. Den holder selv pause og fortsætter, når det er kølet af. Vent et minut.' },
      { type: 'text', body: 'Åbn printeren, og tag bonrullen ud.' },
      { type: 'text', body: 'Puds forsigtigt den lille sorte papirsensor (det lille "spejl") med en vatpind, der er let fugtet med vand. Den sidder i bunden, hvor papiret ligger.' },
      { type: 'text', body: 'Sæt bonrullen i, og luk låget. Tjek om det virker.' },
      { type: 'text', body: 'Virker det ikke, så sluk printeren, tag batteriet ud i 10 sekunder, sæt det i og tænd igen.' },
      { type: 'warn', body: 'I kulde yder batteriet dårligere, og printeren kan stoppe. Lad den ligge et varmt sted (fx inde i bilen ved varmen) et stykke tid, og prøv igen.' },
      { type: 'danger', body: 'Virker det stadig ikke, er printeren muligvis defekt. Kontakt IT-support.' }
    ]
  },
  {
    id: 'bonblank',
    title: 'Printer udskriver blank bon',
    category: 'Printer',
    summary: 'Papiret kører ud, men der står intet på det.',
    tags: ['Papir', 'Bonrulle', 'Blank', 'Tom bon'],
    steps: [
      { type: 'text', body: 'Bonrullen sidder næsten altid omvendt. Åbn låget, vend rullen, og luk igen. Papiret skal komme ud fra rullens underside, ind mod dig.' },
      { type: 'note', body: 'Test papiret ved at ridse det hurtigt med en fingernegl. Den rigtige side (printsiden) bliver mørk. Det gør den forkerte side ikke.' },
      { type: 'warn', body: 'Printer den stadig blankt efter rullen er vendt, så er det måske ikke termopapir. Brug kun 58 mm termo-bonruller.' }
    ]
  },
  {
    id: 'printer-blegt',
    title: 'Bonen er bleg, stribet eller svær at læse',
    category: 'Printer',
    summary: 'Teksten er svag, der mangler striber i skriften, eller kun dele af bonen kan læses.',
    tags: ['Bleg', 'Svag tekst', 'Striber', 'Printhoved', 'Rengøring'],
    steps: [
      { type: 'text', body: 'Tjek batterilamperne. Et næsten fladt batteri giver svagere print. Lad printeren op.' },
      { type: 'text', body: 'Sluk printeren, og tag USB-kablet ud, hvis det sidder i.' },
      { type: 'text', body: 'Åbn låget, og tag bonrullen ud.' },
      { type: 'text', body: 'Rens printhovedet: Det er den smalle, mørke liste i låget, hvor papiret kører forbi. Tør den forsigtigt med en vatpind fugtet med husholdningssprit (isopropyl- eller ethanol-sprit).' },
      { type: 'warn', body: 'Rør ikke ved printhovedet med fingrene, og brug ikke skarpe genstande. Lad spritten tørre helt (ca. 1 minut), før du lukker låget.' },
      { type: 'text', body: 'Tør den sorte gummirulle med en vatpind, der kun er fugtet med vand.' },
      { type: 'text', body: 'Sæt bonrullen i, luk låget, tænd printeren og print en testbon.' },
      { type: 'note', body: 'Er printet stadig for svagt, kan IT-support skrue op for printerens "densitet" (sværtning) med Epson TM Utility-appen.' },
      { type: 'danger', body: 'Mangler der stadig hele striber i teksten efter rengøring, er printhovedet slidt. Kontakt IT-support.' }
    ]
  },
  {
    id: 'printer-papirstop',
    title: 'Papiret sidder fast i printeren',
    category: 'Printer',
    summary: 'Papiret er krøllet, sidder fast eller kører skævt ud.',
    tags: ['Papirstop', 'Sidder fast', 'Skævt', 'Krøllet'],
    steps: [
      { type: 'text', body: 'Sluk printeren, og tag USB-kablet ud, hvis det sidder i.' },
      { type: 'text', body: 'Tryk på knappen, der åbner låget, og åbn det helt.' },
      { type: 'text', body: 'Træk forsigtigt det fastklemte papir ud i papirets retning. Træk ikke skævt, og hiv ikke hårdt.' },
      { type: 'warn', body: 'Brug ikke saks, kniv eller andre skarpe ting inde i printeren. Det ødelægger printhovedet.' },
      { type: 'text', body: 'Fjern eventuelle små papirstumper, og tjek at gummirullen er ren.' },
      { type: 'text', body: 'Læg bonrullen i igen, træk 5-10 cm papir ud over kanten, og luk låget, til det klikker.' },
      { type: 'text', body: 'Tænd printeren, og print en testbon.' },
      { type: 'note', body: 'Kører papiret ofte skævt, så tjek at rullen ikke er bredere end 58 mm, og at den ikke er for stor (max 40 mm i diameter).' }
    ]
  },
  {
    id: 'printer-skift-bonrulle',
    title: 'Skift bonrulle',
    category: 'Printer',
    summary: 'Sådan lægger du en ny bonrulle i, så den printer med det samme.',
    tags: ['Bonrulle', 'Papir', 'Skift', 'Ny rulle'],
    steps: [
      { type: 'note', body: 'Brug 58 mm termo-bonruller med en diameter på max 40 mm. Andre ruller passer ikke eller printer blankt.' },
      { type: 'text', body: 'Tryk på knappen, der åbner låget, og åbn det helt.' },
      { type: 'text', body: 'Tag den gamle papkerne ud.' },
      { type: 'text', body: 'Læg den nye rulle i, så papiret kommer ud fra rullens underside og ind mod dig.' },
      { type: 'text', body: 'Træk 5-10 cm papir ud over kanten, så det stikker ud, når låget lukkes.' },
      { type: 'text', body: 'Luk låget, til det klikker. Riv det overskydende papir af mod den takkede kant.' },
      { type: 'note', body: 'Printer den blankt, ligger rullen omvendt. Se guiden "Printer udskriver blank bon".' },
      { type: 'warn', body: 'Rør ikke ved papiret, mens der printes. Det giver skæve bons og papirstop.' }
    ]
  },
  {
    id: 'printer-oplader-ikke',
    title: 'Printeren lader ikke, eller lade-lampen blinker',
    category: 'Printer',
    summary: 'Charge-lampen tænder ikke, eller den blinker, når printeren sættes til opladning.',
    tags: ['Opladning', 'Lader ikke', 'USB-C', 'Charge', 'Batteri'],
    steps: [
      { type: 'note', body: 'Printeren lades med et almindeligt USB-C-kabel i en USB-C-oplader (fx en telefonoplader). Batteriet skal sidde i printeren under opladning.' },
      { type: 'text', body: 'Prøv et andet USB-C-kabel og en anden oplader. Tablettens oplader kan bruges.' },
      { type: 'text', body: 'Tjek at kablet sidder helt i bund i printeren. Fjern eventuelt snavs i porten med en tør, blød børste.' },
      { type: 'note', body: 'Charge-lampen tænder ikke, hvis batteriet allerede er næsten fuldt. Det er normalt.' },
      { type: 'warn', body: 'BLINKER Charge-lampen, er det for koldt eller for varmt til at lade. Printeren lader kun mellem 0 og 40 grader. Tag den ind, og lad den få stuetemperatur, før du prøver igen.' },
      { type: 'note', body: 'Fuld opladning tager ca. 3 timer med en kraftig oplader (3 A) og op til 10 timer i en svag USB-port, fx på en computer.' },
      { type: 'text', body: 'Tag batteriet ud i 10 sekunder, sæt det i igen, og sæt printeren til opladning igen.' },
      { type: 'danger', body: 'Blinker Charge-lampen stadig ved stuetemperatur, eller er batteriet ikke fuldt efter 5 timer, er batteriet slidt op og skal skiftes (Epson OT-BY20). Kontakt IT-support.' }
    ]
  },
  {
    id: 'printer-batteri-kort-tid',
    title: 'Printerens batteri holder kort tid',
    category: 'Printer',
    summary: 'Printeren skal lades ofte, eller batteriet dør hurtigt i kulde.',
    tags: ['Batteri', 'Kulde', 'Holder ikke', 'Levetid'],
    steps: [
      { type: 'note', body: 'Et sundt batteri holder til en hel arbejdsdag og mere. Batteriet holder til ca. 500 opladninger, altså typisk 2-3 år, før det bliver mærkbart dårligere.' },
      { type: 'warn', body: 'I kulde yder batteriet markant dårligere. Det er midlertidigt. Opbevar printeren inde i bilen ved varmen, ikke i ladet eller i en kold taske.' },
      { type: 'text', body: 'Lad printeren op hver aften, så den starter dagen fuld. Undgå at lade den ligge helt flad i længere tid.' },
      { type: 'text', body: 'Sluk printeren, når den ikke skal bruges i længere tid, fx i weekenden.' },
      { type: 'text', body: 'Tjek at der ikke er aktiveret bip-lyde eller tændt for unødige funktioner. Det gør IT-support i Epson TM Utility.' },
      { type: 'danger', body: 'Holder et fuldt opladet batteri under en halv dag ved normal brug og stuetemperatur, skal batteriet skiftes. Kontakt IT-support.' }
    ]
  },
  {
    id: 'printer-slukker-selv',
    title: 'Printeren slukker af sig selv',
    category: 'Printer',
    summary: 'Printeren er slukket, når du skal bruge den, eller slukker midt i arbejdet.',
    tags: ['Slukker', 'Auto sluk', 'Strøm', 'Batteri'],
    steps: [
      { type: 'text', body: 'Tjek batterilamperne, når du tænder den igen. Er batteriet fladt, slukker printeren for at beskytte sig selv. Lad den op.' },
      { type: 'note', body: 'Printeren kan være indstillet til at slukke automatisk efter et antal minutter uden brug. Fra fabrikken er det slået fra, men det kan være ændret. IT-support kan tjekke og ændre det i Epson TM Utility.' },
      { type: 'text', body: 'Tjek at tænd/sluk-knappen ikke bliver trykket ind i tasken eller lommen. Et tryk på ca. 2 sekunder slukker printeren.' },
      { type: 'warn', body: 'Slukker printeren, og blinker den orange Error-lampe hurtigt lige inden, er det en alvorlig fejl. Tag batteriet ud i 10 sekunder, og prøv igen.' },
      { type: 'danger', body: 'Slukker den stadig af sig selv med et opladet batteri, så kontakt IT-support.' }
    ]
  },
  {
    id: 'printer-taender-ikke',
    title: 'Printeren tænder ikke',
    category: 'Printer',
    summary: 'Ingen lamper lyser, når du trykker på tænd/sluk.',
    tags: ['Tænder ikke', 'Død', 'Strøm', 'Batteri'],
    steps: [
      { type: 'text', body: 'Hold tænd/sluk-knappen inde i ca. 1 sekund, og slip, når den blå Power-lampe lyser. Et helt kort tryk er ikke nok.' },
      { type: 'text', body: 'Sker der intet, så sæt printeren til opladning i mindst 30 minutter, og prøv igen. Charge-lampen skal lyse under opladning.' },
      { type: 'text', body: 'Vend printeren, og tjek at batteriet sidder helt i og er klikket fast. Tag det ud, og sæt det i igen.' },
      { type: 'note', body: 'Printeren kan ikke køre på USB-strøm alene. Batteriet skal sidde i.' },
      { type: 'text', body: 'Prøv et andet USB-C-kabel og en anden oplader. Se guiden "Printeren lader ikke".' },
      { type: 'danger', body: 'Tænder den stadig ikke efter 1 times opladning med en oplader, der virker, så kontakt IT-support.' }
    ]
  },
  {
    id: 'printer-tegn-volapyk',
    title: 'Printeren udskriver mærkelige tegn eller rodet layout',
    category: 'Printer',
    summary: 'Bonen er fyldt med tilfældige tegn, eller layoutet er forskubbet.',
    tags: ['Volapyk', 'Mærkelige tegn', 'Rodet', 'Firmware'],
    steps: [
      { type: 'text', body: 'Sluk printeren, vent 10 sekunder, og tænd den igen. Vent 40 sekunder, før du printer.' },
      { type: 'text', body: 'Luk MV-appen helt, og åbn den igen.' },
      { type: 'warn', body: 'Tjek at appen bruger printeren UDEN "-L" i navnet under Indstillinger > Printere.' },
      { type: 'note', body: 'Sker det typisk lige efter, at forbindelsen har været afbrudt, er det en kendt fejl i ældre printer-firmware. IT-support kan opdatere printeren med Epson TM Utility-appen.' },
      { type: 'text', body: 'Print en testbon fra printeren selv (se guiden "Print en testside fra printeren"). Er den i orden, er problemet i forbindelsen, ikke i printeren.' },
      { type: 'danger', body: 'Fortsætter det, så kontakt IT-support og send gerne et billede af bonen.' }
    ]
  },
  {
    id: 'printer-bipper',
    title: 'Printeren bipper',
    category: 'Printer',
    summary: 'Printeren siger lyde, uden at du har trykket på noget.',
    tags: ['Bip', 'Lyd', 'Alarm', 'Bipper'],
    steps: [
      { type: 'note', body: 'Ét enkelt bip, når du holder Feed inde med låget åbent, er normalt. Det er starten på parrings-proceduren.' },
      { type: 'text', body: 'Bipper den af sig selv, er der slået advarselslyde til for lavt batteri, papirmangel eller fejl. Tjek batterilamperne, og lad printeren op.' },
      { type: 'text', body: 'Tjek at der er papir i, og at låget er lukket.' },
      { type: 'text', body: 'Tjek om Error-lampen lyser eller blinker. Se guiden "Hvad betyder lamperne på printeren?".' },
      { type: 'note', body: 'Advarselslydene er slået fra fra fabrikken. IT-support kan slå dem fra igen i Epson TM Utility.' }
    ]
  },
  {
    id: 'printer-selvtest',
    title: 'Print en testside fra printeren (selvtest)',
    category: 'Printer',
    summary: 'Tjek om printeren selv virker, uafhængigt af tablet og app.',
    tags: ['Selvtest', 'Testside', 'Firmware', 'Serienummer'],
    steps: [
      { type: 'text', body: 'Sluk printeren, og tjek at der er papir i, og at låget er lukket.' },
      { type: 'text', body: 'Hold "Feed"-knappen inde, og tryk samtidig på tænd/sluk. Bliv ved med at holde "Feed" inde, til printeren begynder at printe.' },
      { type: 'note', body: 'Printeren skriver bl.a. firmware-version, serienummer og "head running length" ud. Tag et billede af arket, hvis IT-support beder om det.' },
      { type: 'text', body: 'Power-lampen blinker nu. Tryk ét kort tryk på "Feed" for at afslutte testen. Printeren skriver et tegnmønster og "completed" og starter normalt op.' },
      { type: 'warn', body: 'Hold IKKE "Feed" inde længe på dette tidspunkt. Det åbner printerens indstillingsmenu. Sker det, så sluk printeren og tænd den igen.' },
      { type: 'note', body: 'Er testsiden i orden, virker printeren. Problemet ligger så i Bluetooth-forbindelsen eller appen.' }
    ]
  },
  {
    id: 'printer-nulstil-bluetooth',
    title: 'Nulstil printerens Bluetooth og slet gamle parringer',
    category: 'Printer',
    summary: 'Bruges når printeren har været parret med mange enheder, eller når parring slår fejl igen og igen.',
    tags: ['Nulstil', 'Reset', 'Bluetooth', 'Parring', 'Fabriksindstilling'],
    steps: [
      { type: 'warn', body: 'Gør kun dette efter aftale med IT-support. Alle parringer slettes, og printeren skal parres igen med tabletten.' },
      { type: 'text', body: 'Sluk printeren. Hold "Feed" inde, og tryk på tænd/sluk. Hold "Feed", til printeren begynder at printe testsiden.' },
      { type: 'text', body: 'Når Power-lampen blinker, så hold "Feed" inde i mindst 1 sekund. Printeren skriver en menu ud.' },
      { type: 'text', body: 'Vælg "Interface Setup": Tryk kort på "Feed" det antal gange, der står ud for punktet (normalt 5), og hold derefter "Feed" inde i 1 sekund.' },
      { type: 'text', body: 'Følg menuen på papiret videre til "Bluetooth Setup" og derefter "Initialize" på samme måde: tryk kort det angivne antal gange, og hold inde.' },
      { type: 'text', body: 'Printeren genstarter. Vent 40 sekunder.' },
      { type: 'text', body: 'Ophæv den gamle parring på tabletten, og følg guiden "Tilføj printer til tablet og app".' },
      { type: 'note', body: 'IT-support kan også nulstille Bluetooth via Epson TM Utility-appen, hvis printeren stadig kan forbindes.' }
    ]
  },
  {
    id: 'printer-tm-utility',
    title: 'Epson TM Utility-appen (indstillinger og opdatering)',
    category: 'Printer',
    summary: 'Hvad Epsons egen app kan bruges til, og hvornår den er relevant.',
    tags: ['TM Utility', 'Epson', 'Firmware', 'Indstillinger', 'Densitet'],
    steps: [
      { type: 'note', body: 'Epson TM Utility er Epsons gratis app til Android. Den findes i Google Play under navnet "Epson TM Utility".' },
      { type: 'note', body: 'Med den kan man: lave testprint, se printerens status og batteri, ændre sværtning (densitet), slå bip-lyde til/fra, sætte automatisk sluk, ændre Bluetooth-indstillinger og opdatere printerens firmware.' },
      { type: 'warn', body: 'Ændr ikke indstillinger på egen hånd. Fejlindstillinger kan gøre, at MV-appen ikke kan printe. Brug appen efter aftale med IT-support.' },
      { type: 'text', body: 'Ved brug: Sørg for at printeren er tændt og forbundet til tabletten via Bluetooth. Åbn TM Utility, og vælg printeren.' },
      { type: 'note', body: 'Firmware-opdatering løser bl.a. kendte fejl med parring der slår fejl og rodede udskrifter efter afbrudt forbindelse.' }
    ]
  },
  {
    id: 'printer-rengoring',
    title: 'Rengør printeren',
    category: 'Printer',
    summary: 'Regelmæssig rengøring giver klare bons og færre papirstop. Gør det ca. hver 3. måned.',
    tags: ['Rengøring', 'Vedligeholdelse', 'Printhoved', 'Sensor'],
    steps: [
      { type: 'text', body: 'Sluk printeren, og tag USB-kablet ud. Åbn låget, og tag bonrullen ud.' },
      { type: 'text', body: 'Printhoved (den smalle, mørke liste i låget): Tør forsigtigt med en vatpind fugtet med husholdningssprit (isopropyl/ethanol). Lad det tørre helt.' },
      { type: 'text', body: 'Gummirulle og den lille sorte papirsensor i bunden: Tør med en vatpind fugtet med kun vand.' },
      { type: 'text', body: 'Ydersiden: Tør af med en tør eller let fugtig klud.' },
      { type: 'warn', body: 'Brug aldrig sprit, rensebenzin eller andre opløsningsmidler på ydersiden eller gummirullen. Det ødelægger plastik og gummi.' },
      { type: 'text', body: 'Sæt bonrullen i, luk låget, og print en testbon.' }
    ]
  },

  /* =====================================================================
     APP – MV Polering-appen
     ===================================================================== */
  {
    id: 'app-crash',
    title: 'Appen fryser eller lukker ned',
    category: 'App',
    summary: 'MV-appen hænger, går i sort eller lukker pludselig.',
    tags: ['Tablet', 'Fryser', 'Lukker ned', 'Crash'],
    steps: [
      { type: 'text', body: 'Luk appen helt: Swipe op fra bunden af skærmen, og hold, så oversigten over åbne apps vises. Swipe MV-appen væk. Åbn den igen.' },
      { type: 'text', body: 'Genstart tabletten, hvis problemet fortsætter.' },
      { type: 'text', body: 'Tjek i Google Play, om der ligger en opdatering til appen. Se guiden "Opdatér MV-appen".' },
      { type: 'text', body: 'Tjek at der er ledig plads på tabletten: Indstillinger > Enhedspleje > Lager. Er der under 1 GB fri, se guiden "Lagerplads er fuld".' },
      { type: 'text', body: 'Ryd appens cache: Indstillinger > Apps > MV Polering > Lager > Ryd cache. Det sletter ikke dine data.' },
      { type: 'warn', body: 'Tryk IKKE på "Ryd data". Det logger dig ud og kan slette lokalt gemt arbejde.' },
      { type: 'danger', body: 'Sker det ofte, eller efter en bestemt handling i appen, så kontakt IT-support og fortæl, hvad du gjorde lige inden.' }
    ]
  },
  {
    id: 'ugearbejde-forsvundet',
    title: 'Ugearbejde og notater forsvundet fra app',
    category: 'App',
    summary: 'Ugens kunder eller dine notater er væk i appen.',
    tags: ['Ugearbejde', 'Kunder', 'Notater', 'Forsvundet'],
    steps: [
      { type: 'note', body: 'Tag det roligt. Umiddelbart er det ikke væk for altid.' },
      { type: 'text', body: 'Åbn din mail, find den seneste mail med filen med dit ugearbejde, og indlæs filen i appen.' },
      { type: 'text', body: 'Hvis det ikke virker, så luk appen helt, åbn den igen, og indlæs filen igen.' },
      { type: 'text', body: 'Hvis det stadig ikke virker, så tjek i Google Play, om der ligger en opdatering til appen.' },
      { type: 'danger', body: 'Hvis problemet fortsætter, kontakt IT-support for yderligere hjælp.' }
    ]
  },
  {
    id: 'app-sover',
    title: 'Tabletten lukker appen i baggrunden (apps i dvale)',
    category: 'App',
    summary: 'Appen skal starte forfra, printer mister forbindelsen, eller beskeder kommer for sent, når skærmen har været slukket.',
    tags: ['Dvale', 'Baggrund', 'Batterioptimering', 'Sleeping apps', 'Printer'],
    steps: [
      { type: 'note', body: 'Samsung sætter automatisk apps i dvale for at spare batteri. Det må ikke ske for MV-appen, ellers mister den bl.a. forbindelsen til printeren.' },
      { type: 'text', body: 'Gå til Indstillinger > Batteri > Grænser for baggrundsforbrug.' },
      { type: 'text', body: 'Tryk på "Apps, der aldrig auto-sover" > plus-ikonet, og tilføj "MV Polering App". Tilføj også "MV Launcher", hvis den er på listen.' },
      { type: 'text', body: 'Tjek listerne "Sovende apps" og "Dybt sovende apps". Står MV Polering App eller Maps dér, så hold fingeren på appen og fjern den. Tabletten tilføjer selv apps til listen, så tjek den igen af og til.' },
      { type: 'text', body: 'Slå "Sæt ubrugte apps i søvntilstand" fra på samme skærm.' },
      { type: 'text', body: 'Gå til Indstillinger > Apps > MV Polering App > Batteri, og vælg "Ubegrænset" (standard er "Optimeret").' },
      { type: 'text', body: 'Slå Strømbesparelse fra: Indstillinger > Batteri > Strømbesparelse.' },
      { type: 'note', body: 'Kontroller efter en systemopdatering, at indstillingerne stadig er sat. De kan blive nulstillet.' }
    ]
  },
  {
    id: 'app-notifikationer',
    title: 'Appen giver ingen notifikationer',
    category: 'App',
    summary: 'Beskeder fra appen kommer ikke, kommer for sent eller uden lyd.',
    tags: ['Notifikationer', 'Meddelelser', 'Besked', 'Lyd', 'Forstyr ikke'],
    steps: [
      { type: 'text', body: 'Gå til Indstillinger > Meddelelser > Appmeddelelser, find MV Polering App, og tjek at "Tillad meddelelser" og "Tillad lyd" er slået til.' },
      { type: 'text', body: 'Tjek at "Forstyr ikke" er slået fra: Indstillinger > Meddelelser > Forstyr ikke. Tjek også under "Tidsplan", at der ikke er en aktiv plan (fx "Sover 22.00-07.00").' },
      { type: 'text', body: 'Tjek Indstillinger > Tilstande og rutiner. Er tilstanden "Søvn" eller "Arbejde" aktiv, kan den skjule meddelelser.' },
      { type: 'text', body: 'Tjek lyden: Indstillinger > Lyd. Øverst skal "Lyd" være valgt (ikke "Lydløs"). Under Lydstyrke må skyderen "Meddelelser" ikke være helt nede.' },
      { type: 'text', body: 'Følg guiden "Tabletten lukker appen i baggrunden". Apps i dvale får ikke meddelelser til tiden.' },
      { type: 'text', body: 'Slå Strømbesparelse fra: Indstillinger > Batteri > Strømbesparelse.' },
      { type: 'danger', body: 'Kommer der stadig ingen meddelelser, så kontakt IT-support.' }
    ]
  },
  {
    id: 'app-opdater',
    title: 'Opdatér MV-appen',
    category: 'App',
    summary: 'Sådan tjekker du, om der er en ny version af appen, og installerer den.',
    tags: ['Opdatering', 'Google Play', 'Version', 'Play Butik'],
    steps: [
      { type: 'text', body: 'Åbn Google Play (Play Butik) på tabletten.' },
      { type: 'text', body: 'Søg efter "MV Polering", og åbn appens side. Står der "Opdater", så tryk på den. Står der "Åbn", har du nyeste version.' },
      { type: 'note', body: 'Alternativt: Tryk på dit profilbillede øverst til højre > Administrer apps og enhed > Opdateringer tilgængelige > Opdater alle.' },
      { type: 'text', body: 'Tjek at automatisk opdatering er slået til: Profilbillede > Indstillinger > Netværksindstillinger > Opdater apps automatisk > Kun via Wi-Fi.' },
      { type: 'warn', body: 'Tabletten skal være på Wi-Fi eller have mobildata, og der skal være mindst 1 GB ledig plads, for at opdateringer kan hentes.' },
      { type: 'note', body: 'Står opdateringen på "Venter på download" i lang tid, så se guiden om Google Play under kategorien Indstillinger.' }
    ]
  },
  {
    id: 'app-login',
    title: 'Kan ikke logge ind i appen',
    category: 'App',
    summary: 'Appen afviser login eller melder fejl, når du logger ind.',
    tags: ['Login', 'Adgangskode', 'Kodeord', 'Log ind'],
    steps: [
      { type: 'text', body: 'Tjek at tabletten har internet: Åbn en hjemmeside i Chrome. Virker det ikke, se guiderne under Netværk.' },
      { type: 'text', body: 'Tjek at klokken og datoen er rigtige på tabletten. Forkert tid får login til at fejle. Se guiden "Klokken eller datoen er forkert".' },
      { type: 'text', body: 'Tjek for stavefejl og store/små bogstaver i brugernavn og kode. Slå eventuelt "Vis adgangskode" til.' },
      { type: 'text', body: 'Luk appen helt, og prøv igen. Hjælper det ikke, så genstart tabletten.' },
      { type: 'text', body: 'Tjek om appen skal opdateres. Se guiden "Opdatér MV-appen".' },
      { type: 'danger', body: 'Har du glemt din kode, eller afvises den stadig, så kontakt IT-support. Prøv ikke mange gange i træk.' }
    ]
  },

  /* =====================================================================
     TABLET – generelt
     ===================================================================== */
  {
    id: 'tablet-genstart',
    title: 'Genstart tabletten (tvungen genstart)',
    category: 'Tablet',
    summary: 'Den hurtigste løsning på de fleste småfejl. Virker også når skærmen er frosset.',
    tags: ['Genstart', 'Reboot', 'Fryser', 'Knapper'],
    steps: [
      { type: 'text', body: 'Normal genstart: Hold tænd/sluk-knappen inde, indtil menuen vises, og tryk på "Genstart".' },
      { type: 'text', body: 'Tvungen genstart (hvis skærmen ikke reagerer): Hold tænd/sluk-knappen og Lydstyrke ned inde SAMTIDIG i 7-10 sekunder, indtil skærmen bliver sort og Samsung-logoet kommer frem.' },
      { type: 'note', body: 'Der slettes ikke noget ved en genstart. Dine apps og data er der stadig.' },
      { type: 'warn', body: 'Batteriet skal have mindst 5 %, for at tabletten kan genstarte. Er den helt flad, så lad den op i 30 minutter først.' }
    ]
  },
  {
    id: 'tablet-taender-ikke',
    title: 'Tablet tænder ikke',
    category: 'Tablet',
    summary: 'Skærmen forbliver sort, og der sker intet, når du trykker på tænd/sluk.',
    tags: ['Opstart', 'Strøm', 'Død', 'Sort skærm'],
    steps: [
      { type: 'text', body: 'Tilslut tabletten til en oplader direkte i stikkontakten. Brug en oplader, du ved virker.' },
      { type: 'note', body: 'Lad den oplade i mindst 30-60 minutter, før du tester igen. En helt flad tablet viser ingen tegn på liv de første minutter.' },
      { type: 'text', body: 'Hold tænd/sluk-knappen og Lydstyrke ned inde samtidig i 10-20 sekunder.' },
      { type: 'note', body: 'Dette tvinger tabletten til at genstarte.' },
      { type: 'text', body: 'Har tabletten et cover med magnetlukning, så tag det af. Magneten kan holde skærmen slukket.' },
      { type: 'warn', body: 'Hvis der stadig ikke kommer liv i den, så prøv med en anden oplader og et andet kabel.' },
      { type: 'danger', body: 'Virker det stadig ikke, kan der være fejl på oplader, ladeport eller tablet. Kontakt IT-support.' }
    ]
  },
  {
    id: 'sort-skaerm-men-taendt',
    title: 'Sort skærm, men tabletten virker tændt',
    category: 'Tablet',
    summary: 'Tabletten vibrerer eller laver lyd, men skærmen viser intet.',
    tags: ['Skærm', 'Sort skærm', 'Vibrerer'],
    steps: [
      { type: 'text', body: 'Hold tænd/sluk-knappen og Lydstyrke ned inde samtidig i 10-20 sekunder.' },
      { type: 'note', body: 'Det laver en tvungen genstart, hvis systemet er låst.' },
      { type: 'text', body: 'Kontrollér bagefter, om Samsung-logoet vises ved opstart.' },
      { type: 'text', body: 'Tag et eventuelt cover af, og prøv igen. Magneter i covers kan slukke skærmen.' },
      { type: 'text', body: 'Sæt tabletten til opladning i 30 minutter, og prøv igen.' },
      { type: 'warn', body: 'Hvis skærmen stadig er helt sort, men tabletten vibrerer eller laver lyd, kan det være en skærmfejl.' },
      { type: 'danger', body: 'Hvis problemet fortsætter, kontakt IT-support.' }
    ]
  },
  {
    id: 'tablet-fryser-eller-reagerer-ikke',
    title: 'Tablet fryser eller reagerer ikke',
    category: 'Tablet',
    summary: 'Skærmen er låst fast, og touch virker ikke.',
    tags: ['Fryser', 'Hænger', 'Reagerer ikke', 'Låst'],
    steps: [
      { type: 'text', body: 'Hold tænd/sluk-knappen og Lydstyrke ned inde samtidig i 7-10 sekunder, indtil tabletten genstarter.' },
      { type: 'note', body: 'Det laver en tvungen genstart. Der slettes ikke noget.' },
      { type: 'text', body: 'Når tabletten er startet igen, så tjek om problemet kun sker i én bestemt app. Ryd i så fald appens cache: Indstillinger > Apps > appen > Lager > Ryd cache.' },
      { type: 'text', body: 'Opdatér Android og de apps, der bruges mest. Se guiden "Opdatér tabletten (Android)".' },
      { type: 'text', body: 'Tjek ledig plads: Indstillinger > Enhedspleje > Lager. Under 1 GB fri gør tabletten ustabil.' },
      { type: 'warn', body: 'Fryser den ofte, så test i Sikker tilstand for at se, om en app er skyld i det. Se guiden "Fejlsøg i Sikker tilstand".' },
      { type: 'danger', body: 'Fryser den stadig efter genstart og opdatering, kontakt IT-support.' }
    ]
  },
  {
    id: 'tablet-sidder-fast-logo',
    title: 'Tabletten sidder fast på Samsung-logoet',
    category: 'Tablet',
    summary: 'Tabletten genstarter igen og igen eller kommer ikke videre fra logoet.',
    tags: ['Boot loop', 'Logo', 'Genstarter', 'Starter ikke'],
    steps: [
      { type: 'text', body: 'Hold tænd/sluk-knappen og Lydstyrke ned inde samtidig i 10-20 sekunder for at tvinge en genstart.' },
      { type: 'text', body: 'Sæt tabletten til opladning i 30 minutter med en oplader, der virker, og prøv igen.' },
      { type: 'warn', body: 'Kommer den stadig ikke videre, så stop her og kontakt IT-support. De næste trin kan slette data, hvis de gøres forkert.' },
      { type: 'danger', body: 'IT-support kan rydde systemets cache (Wipe cache partition) eller gendanne softwaren via Samsung Smart Switch uden at slette dit arbejde. Kontakt IT-support.' }
    ]
  },
  {
    id: 'safe-mode-fejlsoegning',
    title: 'Fejlsøg i Sikker tilstand (Safe Mode)',
    category: 'Tablet',
    summary: 'Test om en installeret app er skyld i, at tabletten fryser, er langsom eller opfører sig underligt.',
    tags: ['Safe Mode', 'Sikker tilstand', 'Fejlsøgning', 'Apps'],
    steps: [
      { type: 'note', body: 'I Sikker tilstand kører kun de apps, der var på tabletten fra fabrikken. MV-appen og MV Launcher er derfor slået fra, mens du tester. Det er normalt.' },
      { type: 'text', body: 'Metode 1: Hold tænd/sluk-knappen inde, indtil menuen med "Sluk" vises. Hold nu fingeren på "Sluk" på skærmen, indtil "Sikker tilstand" vises. Tryk på det.' },
      { type: 'text', body: 'Metode 2: Sluk tabletten. Tænd den, og så snart Samsung-logoet vises, holder du Lydstyrke ned inde, indtil låseskærmen vises.' },
      { type: 'note', body: 'Når tabletten er i Sikker tilstand, står der "Sikker tilstand" nederst i skærmens hjørne.' },
      { type: 'text', body: 'Test nu, om problemet stadig er der. Fryser, lag eller fejl der forsvinder i Sikker tilstand, skyldes en installeret app.' },
      { type: 'text', body: 'Fjern nyligt installerede eller mistænkelige apps én ad gangen, og test imellem.' },
      { type: 'text', body: 'Genstart tabletten normalt for at forlade Sikker tilstand.' },
      { type: 'warn', body: 'Menuer og trin kan variere lidt mellem modeller og Android-versioner.' }
    ]
  },
  {
    id: 'tablet-langsom',
    title: 'Tabletten er langsom eller bliver varm',
    category: 'Tablet',
    summary: 'Apps åbner langsomt, hakker eller tabletten føles varm.',
    tags: ['Langsom', 'Lag', 'Varm', 'Hakker', 'Ydeevne'],
    steps: [
      { type: 'text', body: 'Luk alle apps: Swipe op fra bunden, og hold. Tryk på "Luk alle".' },
      { type: 'text', body: 'Genstart tabletten. Det frigiver hukommelse og løser de fleste hakkeproblemer.' },
      { type: 'text', body: 'Kør Indstillinger > Enhedspleje > Optimer nu.' },
      { type: 'text', body: 'Tjek ledig plads under Enhedspleje > Lager. Er der under 1-2 GB fri, se guiden "Lagerplads er fuld".' },
      { type: 'text', body: 'Opdatér tabletten og apps. Se guiden "Opdatér tabletten (Android)".' },
      { type: 'warn', body: 'Bliver tabletten varm: Tag den ud af direkte sol og ud af tykke covers. Undlad at bruge den, mens den lader. Over 35 grader sætter den selv hastigheden ned for at beskytte sig.' },
      { type: 'note', body: 'På Tab S6 Lite (kun 4 GB hukommelse) kan det hjælpe at sætte RAM Plus lavt: Indstillinger > Enhedspleje > Hukommelse > RAM Plus > vælg laveste værdi. Kræver genstart.' },
      { type: 'danger', body: 'Er den fortsat meget langsom eller varm, når den bare ligger, så kontakt IT-support.' }
    ]
  },
  {
    id: 'lagerplads-fuld',
    title: 'Lagerplads er fuld',
    category: 'Tablet',
    summary: 'Tabletten melder, at lageret er næsten fuldt, eller apps kan ikke opdateres.',
    tags: ['Lager', 'Plads', 'Hukommelse', 'Fuld'],
    steps: [
      { type: 'text', body: 'Gå til Indstillinger > Enhedspleje > Lager. Her kan du se, hvad der fylder.' },
      { type: 'text', body: 'Slet unødvendige billeder, videoer, downloads og dokumenter. Tjek især mappen "Downloads".' },
      { type: 'text', body: 'Ryd cache i store apps: Indstillinger > Apps > fx Chrome eller Maps > Lager > Ryd cache.' },
      { type: 'text', body: 'Afinstallér apps, der ikke længere bruges: Hold fingeren på ikonet > Afinstaller.' },
      { type: 'text', body: 'Gå til Enhedspleje > Hukommelse, og tryk på "Ryd nu".' },
      { type: 'warn', body: 'Slet ikke MV Polering-appen eller filer med ugearbejde uden at være sikker på, at de er gemt et andet sted.' },
      { type: 'note', body: 'Google Play kræver mindst 1 GB ledig plads for at kunne hente opdateringer.' }
    ]
  },
  {
    id: 'tablet-opdatering',
    title: 'Opdatér tabletten (Android)',
    category: 'Tablet',
    summary: 'Tjek om der er systemopdateringer, og se hvilken version tabletten kører.',
    tags: ['Opdatering', 'Android', 'One UI', 'Software', 'Version'],
    steps: [
      { type: 'text', body: 'Sæt tabletten på Wi-Fi og gerne til opladning. Opdateringer er store og bruger meget batteri.' },
      { type: 'text', body: 'Gå til Indstillinger > Softwareopdatering > Søg efter opdateringer (på ældre tablets hedder det "Download og installer").' },
      { type: 'text', body: 'Følg anvisningerne. Tabletten genstarter under opdateringen. Det kan tage 10-20 minutter.' },
      { type: 'text', body: 'Findes der en indstilling for automatisk download via Wi-Fi på samme skærm, så slå den til, så opdateringer hentes af sig selv.' },
      { type: 'note', body: 'Se hvilken version tabletten kører: Indstillinger > Om din tablet > Softwareoplysninger. Her står One UI-version og Android-version.' },
      { type: 'note', body: 'De ældste Tab S6 Lite-modeller (2020 og 2022) får ikke længere opdateringer fra Samsung. Det er normalt, at der står "Din software er opdateret".' },
      { type: 'warn', body: 'Efter en større opdatering: Tjek at MV-appen stadig står under "Apps, der aldrig sover". Se guiden "Tabletten lukker appen i baggrunden".' }
    ]
  },
  {
    id: 'tablet-kode-glemt',
    title: 'Glemt PIN-kode eller mønster til tabletten',
    category: 'Tablet',
    summary: 'Du kan ikke låse tabletten op.',
    tags: ['PIN', 'Kode', 'Mønster', 'Låst', 'Glemt'],
    steps: [
      { type: 'warn', body: 'Prøv ikke mange gange i træk. Efter flere forkerte forsøg låses tabletten i længere og længere tid.' },
      { type: 'note', body: 'Samsung har lukket muligheden for at fjernoplåse via Find My Mobile. Koden kan ikke nulstilles over nettet.' },
      { type: 'danger', body: 'Kontakt IT-support. IT har registreret tablettens kode. Uden den skal tabletten nulstilles helt, og alt lokalt arbejde går tabt.' }
    ]
  },
  {
    id: 'tablet-temperatur',
    title: 'Tablet i kulde og varme (i bilen)',
    category: 'Tablet',
    summary: 'Tabletten lader ikke i frost, dæmper skærmen i sol eller slukker af sig selv.',
    tags: ['Kulde', 'Varme', 'Frost', 'Sol', 'Bil', 'Temperatur'],
    steps: [
      { type: 'note', body: 'Samsung angiver 0-35 grader som normalt arbejdsområde. Udenfor det begrænser tabletten selv opladning og hastighed for at beskytte batteriet.' },
      { type: 'warn', body: 'Under 0 grader lader tabletten ikke, eller kun meget langsomt. Tag den ind i varmen i 15-30 minutter, før du sætter den til opladning.' },
      { type: 'warn', body: 'I direkte sol bliver skærmen dæmpet, og tabletten kan blive langsom eller slukke. Læg den i skygge, og lad den køle af.' },
      { type: 'text', body: 'Lad ikke tabletten eller printeren ligge i bilen natten over om vinteren eller i solen om sommeren. Det slider hårdt på batterierne.' },
      { type: 'note', body: 'Det samme gælder printeren: Den lader kun mellem 0 og 40 grader, og batteriet yder dårligt i kulde.' }
    ]
  },
  {
    id: 'tablet-batteri-svulmer',
    title: 'Bagsiden eller skærmen løfter sig (bulende batteri)',
    category: 'Tablet',
    summary: 'Tabletten er blevet tykkere, skærmen buler, eller bagsiden er løs.',
    tags: ['Batteri', 'Buler', 'Svulmer', 'Sikkerhed', 'Skade'],
    steps: [
      { type: 'danger', body: 'STOP med at bruge og oplade tabletten med det samme. Et bulende batteri kan være brandfarligt.' },
      { type: 'warn', body: 'Tryk ikke på bulen, og forsøg ikke at åbne tabletten. Læg den et køligt sted væk fra brandbare ting.' },
      { type: 'danger', body: 'Kontakt IT-support samme dag, så tabletten kan blive udskiftet.' }
    ]
  },

  /* =====================================================================
     BATTERI & OPLADNING – tablet
     ===================================================================== */
  {
    id: 'tablet-oplader-ikke',
    title: 'Tablet oplader ikke',
    category: 'Batteri',
    summary: 'Batteriprocenten stiger ikke, eller lade-ikonet vises ikke.',
    tags: ['Opladning', 'Lader ikke', 'USB', 'Kabel'],
    steps: [
      { type: 'text', body: 'Brug en anden oplader og et andet kabel, hvis det er muligt.' },
      { type: 'text', body: 'Tilslut opladeren direkte i en stikkontakt, ikke i en PC eller en USB-port i bilen. De giver ofte for lidt strøm.' },
      { type: 'text', body: 'Kontrollér ladeporten for støv eller snavs, og fjern det forsigtigt med en tør, blød børste eller tandstik af træ.' },
      { type: 'warn', body: 'Stik ikke metal eller skarpe genstande ind i ladeporten.' },
      { type: 'text', body: 'Vises en vanddråbe på skærmen, så se guiden "Fugt i ladeport".' },
      { type: 'text', body: 'Er tabletten kold (under 0 grader) eller meget varm, lader den ikke. Lad den få stuetemperatur.' },
      { type: 'text', body: 'Genstart tabletten, og prøv at oplade igen.' },
      { type: 'danger', body: 'Hvis den stadig ikke oplader, kan der være fejl på kabel, oplader, port eller batteri. Kontakt IT-support.' }
    ]
  },
  {
    id: 'tablet-lader-langsomt',
    title: 'Tabletten lader langsomt',
    category: 'Batteri',
    summary: 'Der går mange timer, før tabletten er ladet op.',
    tags: ['Opladning', 'Langsom', 'Watt', 'Oplader'],
    steps: [
      { type: 'note', body: 'Tab S6 Lite lader med op til 15 W, Tab S10 Lite med op til 25 W. En svag oplader (fx 5 W telefonoplader eller USB i bilen) kan tage 6-8 timer.' },
      { type: 'text', body: 'Brug en oplader på mindst 15 W (gerne 25 W) med "USB Power Delivery" og et kabel, der kan klare det. Det står typisk på opladeren.' },
      { type: 'text', body: 'Sluk skærmen, mens den lader. Bruger du tabletten samtidig, lader den langsommere.' },
      { type: 'text', body: 'Lad ved stuetemperatur. Både kulde og varme sætter ladehastigheden ned.' },
      { type: 'text', body: 'Tjek Indstillinger > Batteri > Batteribeskyttelse. Er den sat til "Maksimum", stopper opladningen med vilje ved 80-90 %. Det er ikke en fejl.' },
      { type: 'text', body: 'Tjek at ladeporten er ren, og prøv et andet kabel.' },
      { type: 'danger', body: 'Lader den stadig meget langsomt med en kraftig oplader, så kontakt IT-support.' }
    ]
  },
  {
    id: 'fugt-i-ladeport',
    title: 'Fugt i ladeport / vanddråbe-ikon',
    category: 'Batteri',
    summary: 'Tabletten viser en vanddråbe og vil ikke lade.',
    tags: ['Fugt', 'Vanddråbe', 'USB', 'Opladning'],
    steps: [
      { type: 'note', body: 'Hvis tabletten registrerer fugt i porten, blokeres opladning af sikkerhedshensyn. Kondens fra en kold bil er nok til at udløse det.' },
      { type: 'text', body: 'Frakobl opladeren med det samme.' },
      { type: 'text', body: 'Ryst forsigtigt tabletten med porten nedad, og lad den tørre et tørt og lunt sted i 1-2 timer. Blæs ikke varm luft ind i porten.' },
      { type: 'text', body: 'Genstart tabletten, og prøv igen.' },
      { type: 'warn', body: 'Undgå at oplade, så længe fugt-advarslen vises.' },
      { type: 'text', body: 'Er porten helt tør, men advarslen bliver ved: Indstillinger > Apps > filter-ikonet ved søgefeltet ("Filtrer og sorter") > slå "Vis systemapps" til > OK > USBSettings > Lager > Ryd cache. Genstart.' },
      { type: 'danger', body: 'Forsvinder advarslen stadig ikke, kontakt IT-support.' }
    ]
  },
  {
    id: 'batteri-draener-hurtigt',
    title: 'Batteriet dræner hurtigt',
    category: 'Batteri',
    summary: 'Tabletten holder ikke en arbejdsdag længere.',
    tags: ['Strømforbrug', 'Levetid', 'Holder ikke', 'Dræner'],
    steps: [
      { type: 'text', body: 'Gå i Indstillinger > Batteri, og se hvilke apps der bruger mest strøm. Er der en app, du ikke kender eller bruger, så afinstallér den.' },
      { type: 'text', body: 'Skru ned for skærmens lysstyrke, og slå "Tilpasset lysstyrke" til under Indstillinger > Skærm.' },
      { type: 'text', body: 'Sæt skærmen til at slukke efter kort tid: Indstillinger > Skærm > Skærm-timeout > 1-2 minutter.' },
      { type: 'text', body: 'Slå Wi-Fi fra, hvis der ikke er et netværk i nærheden. Konstant søgning efter Wi-Fi bruger strøm.' },
      { type: 'text', body: 'Gå i Indstillinger > Enhedspleje, og tryk på "Optimer nu".' },
      { type: 'warn', body: 'Slå ikke Strømbesparelse til som fast løsning. Den kan lukke MV-appen i baggrunden og afbryde printeren.' },
      { type: 'note', body: 'Tjek batteriets sundhed: Indstillinger > Batteri > Batterioplysninger. Står der andet end "God" ud for batteriets tilstand, er batteriet slidt.' },
      { type: 'danger', body: 'Hvis batteriet pludselig er blevet markant dårligere, kan batteriet være slidt. Kontakt IT-support.' }
    ]
  },
  {
    id: 'batteribeskyttelse',
    title: 'Batteribeskyttelse: Forlæng batteriets levetid',
    category: 'Batteri',
    summary: 'Indstilling der stopper opladningen ved 80-90 %, så batteriet holder længere. Anbefales, når tabletten lader natten over.',
    tags: ['Batteribeskyttelse', 'Opladning', 'Levetid', '80 %'],
    steps: [
      { type: 'note', body: 'Batterier slides mest, når de står fuldt opladede i mange timer. Batteribeskyttelse stopper opladningen før 100 %.' },
      { type: 'text', body: 'Gå til Indstillinger > Batteri > Batteribeskyttelse.' },
      { type: 'text', body: 'Vælg "Maksimum" i stedet for "Basis", og sæt grænsen til 85 eller 90 %. "Søvntidsbeskyttelse" er også en god løsning, hvis tabletten lader natten over: Den stopper ved 80 % og lader op til 100 % lige før arbejdsdagen.' },
      { type: 'note', body: 'På ældre Tab S6 Lite hedder det "Beskyt batteri" og er blot en tænd/sluk-knap, der stopper ved 85 %.' },
      { type: 'note', body: 'Skal tabletten holde en ekstra lang dag, kan du slå beskyttelsen fra aftenen før og lade til 100 %.' }
    ]
  },

  /* =====================================================================
     NETVÆRK – Wi-Fi, Bluetooth, mobildata, GPS
     ===================================================================== */
  {
    id: 'bluetooth-virker-ikke',
    title: 'Bluetooth virker ikke eller finder ingen enheder',
    category: 'Netværk',
    summary: 'Bluetooth kan ikke slås til, finder ikke printeren, eller parring slår fejl.',
    tags: ['Bluetooth', 'Printer', 'Parring', 'Finder ikke'],
    steps: [
      { type: 'text', body: 'Slå Bluetooth fra og til igen i toppanelet.' },
      { type: 'text', body: 'Slå Flytilstand til i 10 sekunder og fra igen. Det nulstiller alle radioer.' },
      { type: 'text', body: 'Sørg for at enheden, du vil forbinde til, er tændt og i parringstilstand. For printeren: se guiden "Tilføj printer til tablet og app".' },
      { type: 'text', body: 'Slet den gamle parring (tandhjulet ud for enheden > Ophæv parring), og forbind igen.' },
      { type: 'text', body: 'Hold tablet og enhed tæt på hinanden under parringen, og fjern tykke covers.' },
      { type: 'warn', body: 'Er enheden forbundet til en anden tablet eller telefon, skal den først frakobles dér.' },
      { type: 'text', body: 'Genstart tabletten.' },
      { type: 'text', body: 'Ryd Bluetooth-cachen: Indstillinger > Apps > filter-ikonet ved søgefeltet ("Filtrer og sorter") > slå "Vis systemapps" til > OK > Bluetooth > Lager > Ryd cache. Genstart.' },
      { type: 'warn', body: 'Sidste udvej: Indstillinger > Generel administration > Nulstil > Nulstil indstillinger for Wi-Fi og Bluetooth. Alle Wi-Fi-koder og parringer slettes, og printeren skal parres igen.' },
      { type: 'danger', body: 'Kan Bluetooth slet ikke slås til efter nulstilling, så kontakt IT-support.' }
    ]
  },
  {
    id: 'wifi-virker-ikke',
    title: 'Wi-Fi vil ikke forbinde eller falder ud',
    category: 'Netværk',
    summary: 'Tabletten kan ikke komme på Wi-Fi, eller forbindelsen forsvinder hele tiden.',
    tags: ['Wi-Fi', 'Internet', 'Falder ud', 'Trådløs', 'Router'],
    steps: [
      { type: 'text', body: 'Slå Wi-Fi fra og til igen i toppanelet. Prøv også Flytilstand til i 10 sekunder og fra igen.' },
      { type: 'text', body: 'Tjek om andre enheder (fx din telefon) kan bruge det samme Wi-Fi. Kan de ikke, er det routeren. Genstart den.' },
      { type: 'text', body: 'Glem netværket, og forbind igen: Indstillinger > Forbindelse > Wi-Fi > tandhjulet ud for netværket > Glem. Vælg netværket igen, og indtast koden.' },
      { type: 'text', body: 'Slå den automatiske Wi-Fi-styring fra: Indstillinger > Forbindelse > Wi-Fi > menuen (tre prikker) > Intelligent Wi-Fi > slå "Aktiver Wi-Fi automatisk" og "Skift til bedre Wi-Fi-netværk" fra.' },
      { type: 'text', body: 'Genstart tabletten.' },
      { type: 'warn', body: 'Sidste udvej: Indstillinger > Generel administration > Nulstil > Nulstil indstillinger for Wi-Fi og Bluetooth. Alle Wi-Fi-koder og Bluetooth-parringer slettes, og printeren skal parres igen.' },
      { type: 'danger', body: 'Virker Wi-Fi stadig ikke på netværk, som andre enheder kan bruge, så kontakt IT-support.' }
    ]
  },
  {
    id: 'mobildata-virker-ikke',
    title: 'Mobildata virker ikke / SIM-kort ikke fundet',
    category: 'Netværk',
    summary: 'Tabletten har intet internet uden Wi-Fi, eller melder "Intet SIM-kort". Gælder kun modeller med SIM.',
    tags: ['Mobildata', 'SIM', '4G', '5G', 'Intet netværk', 'Internet'],
    steps: [
      { type: 'text', body: 'Tjek at Mobildata er slået til i toppanelet, og at Flytilstand er slået fra.' },
      { type: 'text', body: 'Slå Flytilstand til i 10 sekunder og fra igen.' },
      { type: 'text', body: 'Melder tabletten "Intet SIM-kort": Sluk tabletten, tag SIM-kortet ud med nålen, tør det med en tør klud, og sæt det i igen. Tænd.' },
      { type: 'text', body: 'Tjek Indstillinger > Forbindelse > SIM-kortadministrator, at SIM-kortet er slået til og valgt til mobildata.' },
      { type: 'text', body: 'Tjek at Datasparer er slået fra, eller at MV-appen har lov til data: Indstillinger > Forbindelse > Databrug > Datasparer.' },
      { type: 'text', body: 'Nulstil mobilnetværket: Indstillinger > Generel administration > Nulstil > Nulstil indst. mobilt netværk. Det sletter ikke Wi-Fi eller Bluetooth.' },
      { type: 'text', body: 'Genstart tabletten.' },
      { type: 'danger', body: 'Virker det stadig ikke, kan SIM-kortet være spærret eller defekt. Kontakt IT-support.' }
    ]
  },
  {
    id: 'gps-unoejagtig',
    title: 'Google Maps finder ikke min position',
    category: 'Netværk',
    summary: 'Den blå prik står forkert, springer rundt eller dukker slet ikke op.',
    tags: ['GPS', 'Maps', 'Position', 'Placering', 'Navigation'],
    steps: [
      { type: 'text', body: 'Tjek at Placering er slået til i toppanelet.' },
      { type: 'text', body: 'Gå til Indstillinger > Placering > Placeringstjenester. Slå "Wi-Fi-søgning" og "Bluetooth-søgning" til under "Forøg nøjagtighed", og tjek at "Lokationsnøjagtighed" (Google) er slået til. De hjælper GPS med at finde position hurtigere.' },
      { type: 'text', body: 'Tjek Maps-appens tilladelse: Indstillinger > Apps > Maps > Tilladelser > Lokation > "Tillad kun, mens appen bruges" og "Brug præcis lokation" slået til.' },
      { type: 'note', body: 'En tablet uden SIM-kort bruger kun GPS-satellitter. Første gang efter en genstart kan det tage 1-3 minutter udendørs med frit udsyn, før positionen er præcis.' },
      { type: 'text', body: 'Tag tabletten ud af tykke covers eller metal-holdere, der kan skærme for signalet.' },
      { type: 'text', body: 'Genstart tabletten, og åbn Maps udendørs.' },
      { type: 'danger', body: 'Finder den stadig ingen position udendørs efter 5 minutter, så kontakt IT-support.' }
    ]
  },

  /* =====================================================================
     SKÆRM
     ===================================================================== */
  {
    id: 'touch-reagerer-daarligt',
    title: 'Touchskærm reagerer dårligt eller forkert',
    category: 'Skærm',
    summary: 'Tryk registreres ikke, eller skærmen reagerer, uden at du rører den.',
    tags: ['Touch', 'Reagerer ikke', 'Spøgelsestryk', 'Berøring'],
    steps: [
      { type: 'text', body: 'Fjern eventuelt cover og skærmbeskytter midlertidigt, og test igen.' },
      { type: 'text', body: 'Sørg for at skærmen er ren og tør. Våde eller fedtede fingre giver fejltryk.' },
      { type: 'text', body: 'Genstart tabletten ved at holde tænd/sluk-knappen og Lydstyrke ned inde samtidig i 7-10 sekunder.' },
      { type: 'text', body: 'Bruger tabletten beskyttelsesglas, så slå Indstillinger > Skærm > Berøringsfølsomhed til. Bruger den IKKE glas, skal den være slået fra, ellers kan skærmen reagere af sig selv.' },
      { type: 'text', body: 'Tag opladeren ud, og test igen. En dårlig oplader kan give "spøgelsestryk".' },
      { type: 'warn', body: 'Hvis touch virker normalt i Sikker tilstand, er det sandsynligvis en installeret app, der skaber problemet. Se guiden "Fejlsøg i Sikker tilstand".' },
      { type: 'danger', body: 'Hvis touch stadig fejler overalt, kan det være en hardwarefejl i skærmen. Kontakt IT-support.' }
    ]
  },
  {
    id: 'skaerm-roterer-ikke',
    title: 'Skærmen roterer ikke',
    category: 'Skærm',
    summary: 'Skærmen bliver stående i samme retning, når du vender tabletten.',
    tags: ['Rotation', 'Roterer', 'Landskab', 'Portræt', 'Vend'],
    steps: [
      { type: 'text', body: 'Træk toppanelet ned. Find ikonet "Automatisk rotation" (eller "Portræt"/"Landskab"), og tryk på det, så der står "Automatisk rotation".' },
      { type: 'note', body: 'Står der "Portræt" eller "Landskab", er skærmen låst fast i den retning.' },
      { type: 'text', body: 'Nogle apps understøtter kun én retning. Test i en anden app, fx Chrome.' },
      { type: 'text', body: 'Genstart tabletten, hvis den stadig ikke roterer med automatisk rotation slået til.' },
      { type: 'danger', body: 'Roterer den stadig ikke i nogen apps, er rotations-sensoren muligvis defekt. Kontakt IT-support.' }
    ]
  },
  {
    id: 'skaerm-slukker-hurtigt',
    title: 'Skærmen slukker for hurtigt eller er for mørk',
    category: 'Skærm',
    summary: 'Skærmen går i sort midt i arbejdet, eller lysstyrken er for lav udendørs.',
    tags: ['Skærmtimeout', 'Lysstyrke', 'Mørk', 'Slukker', 'Sol'],
    steps: [
      { type: 'text', body: 'Skærmtid: Indstillinger > Skærm > Skærm-timeout. Vælg fx 5 eller 10 minutter. Fra fabrikken står den ofte på kun 30 sekunder.' },
      { type: 'text', body: 'Lysstyrke: Træk toppanelet ned, og træk lysstyrke-skyderen op. Tryk på pilen ved skyderen for at slå "Tilpasset lysstyrke" til, så den selv justerer efter omgivelserne.' },
      { type: 'note', body: 'I stærk sol dæmper tabletten selv skærmen, hvis den bliver for varm. Læg den i skygge et par minutter.' },
      { type: 'text', body: 'Tjek at Strømbesparelse er slået fra: Indstillinger > Batteri > Strømbesparelse. Den dæmper skærmen og forkorter skærmtiden.' },
      { type: 'text', body: 'Tjek øverst i Indstillinger > Skærm, at "Lys" er valgt og ikke "Mørk", hvis skærmen skal være lys.' }
    ]
  },
  {
    id: 'skaerm-tekst-for-lille',
    title: 'Tekst og ikoner er for små',
    category: 'Skærm',
    summary: 'Sådan gør du tekst og knapper større på hele tabletten.',
    tags: ['Skriftstørrelse', 'Zoom', 'Tekst', 'Stor tekst', 'Læsbarhed'],
    steps: [
      { type: 'text', body: 'Gå til Indstillinger > Skærm > Skriftstørrelse og typografi, og træk skyderen mod højre.' },
      { type: 'text', body: 'Gå til Indstillinger > Skærm > Skærmzoom, og træk skyderen mod højre. Det gør alle knapper og ikoner større.' },
      { type: 'note', body: 'Nogle apps skal lukkes og åbnes igen, før ændringen slår igennem.' },
      { type: 'text', body: 'Zoom midlertidigt i en app: Sæt to fingre på skærmen, og spred dem. Virker i fx Chrome og Maps, men ikke i alle apps.' }
    ]
  },

  /* =====================================================================
     LYD & OPKALD
     ===================================================================== */
  {
    id: 'ingen-lyd',
    title: 'Ingen lyd fra tabletten',
    category: 'Lyd',
    summary: 'Der kommer ingen lyd ved beskeder, opkald eller video.',
    tags: ['Højttaler', 'Lydløs', 'Volumen', 'Ingen lyd'],
    steps: [
      { type: 'text', body: 'Tryk på Lydstyrke op, og tryk på pilen/de tre prikker ved skyderen. Tjek at alle skydere (Medie, Meddelelser, Ringetone, System) er oppe.' },
      { type: 'text', body: 'Gå til Indstillinger > Lyd, og vælg "Lyd" øverst (ikke "Lydløs").' },
      { type: 'text', body: 'Tjek at Forstyr ikke er slået fra i toppanelet.' },
      { type: 'text', body: 'Er printeren, et headset eller bilens Bluetooth forbundet? Lyden kan være sendt dertil. Slå Bluetooth fra midlertidigt, og test igen.' },
      { type: 'text', body: 'Tjek Indstillinger > Lyd > Separat applyd. Er den slået til, kan en app være sendt til en anden enhed. Slå den fra.' },
      { type: 'text', body: 'Tjek Indstillinger > Tilgængelighed > Høreforbedringer. "Dæmp alle lyde" skal være slået FRA.' },
      { type: 'text', body: 'Genstart tabletten.' },
      { type: 'danger', body: 'Er der stadig ingen lyd, kan højttaleren være defekt. Kontakt IT-support.' }
    ]
  },
  {
    id: 'opkald-hoerer-ikke',
    title: 'Kan ikke høre den anden part i opkald, eller de kan ikke høre mig',
    category: 'Lyd',
    summary: 'Opkald forbindes, men lyden mangler i den ene eller begge retninger.',
    tags: ['Opkald', 'Telefon', 'Mikrofon', 'Høre', 'Samtale'],
    steps: [
      { type: 'text', body: 'Skru op med Lydstyrke op under samtalen, og tjek at højttaler-knappen i opkaldet er slået til, hvis du bruger tabletten uden headset.' },
      { type: 'text', body: 'Slå Bluetooth fra under samtalen. Lyden kan være sendt til printeren, et headset eller bilen.' },
      { type: 'text', body: 'Tjek at du ikke dækker mikrofonen eller højttaleren med hånden eller coveret. Rens hullerne forsigtigt med en tør, blød børste.' },
      { type: 'text', body: 'Test mikrofonen: Optag en kort lydbesked i Samsung Diktafon (Voice Recorder), og lyt til den.' },
      { type: 'note', body: 'Tablet uden SIM-kort ringer via din Samsung-telefon (Indstillinger > Avancerede funktioner > Opkald og sms på andre enheder). Telefonen skal være tændt, på nettet og logget ind med samme Samsung-konto.' },
      { type: 'text', body: 'Genstart tabletten.' },
      { type: 'danger', body: 'Virker mikrofon eller højttaler stadig ikke i Diktafon, så kontakt IT-support.' }
    ]
  },

  /* =====================================================================
     S PEN
     ===================================================================== */
  {
    id: 'spen-virker-ikke',
    title: 'S Pen virker ikke',
    category: 'S Pen',
    summary: 'Pennen skriver ikke, springer eller registreres ikke af skærmen.',
    tags: ['Pen', 'Stylus', 'Skriver ikke', 'Spids'],
    steps: [
      { type: 'note', body: 'S Pen til Tab S6 Lite og Tab S10 Lite har ikke batteri og skal ikke lades. Den virker udelukkende via skærmen.' },
      { type: 'text', body: 'Fjern skærmbeskytter og magnetisk cover midlertidigt, og test igen. Tykke beskyttelsesglas kan blokere pennen.' },
      { type: 'text', body: 'Tjek pennens spids. Er den slidt, skæv eller mangler, så skift spidsen. Der følger ekstra spidser og en lille tang med tabletten.' },
      { type: 'text', body: 'Genstart tabletten.' },
      { type: 'text', body: 'Prøv en S Pen fra en kollega med samme tablet. Virker den, er din pen defekt.' },
      { type: 'danger', body: 'Virker en anden pen heller ikke, er fejlen i skærmen. Kontakt IT-support.' }
    ]
  },
  {
    id: 'spen-popup',
    title: 'S Pen-menuer popper op af sig selv',
    category: 'S Pen',
    summary: 'Der dukker et rundt ikon eller en menu op, når pennen tages ud eller holdes over skærmen.',
    tags: ['Air command', 'Popup', 'Menu', 'Ikon', 'Air view'],
    steps: [
      { type: 'text', body: 'Gå til Indstillinger > Avancerede funktioner > S Pen.' },
      { type: 'text', body: 'Tryk på Air command, og slå "Vis Air command-ikon" fra. Slå også "Åbn Air command med Pen-knappen" fra, hvis du ikke bruger det.' },
      { type: 'text', body: 'Slå "Luftvisning" (forhåndsvisning når pennen holdes over skærmen) fra.' },
      { type: 'text', body: 'Slå "Skærm fra-notater" fra, hvis notater åbner, når skærmen er slukket.' },
      { type: 'note', body: 'Pennen kan stadig bruges til at trykke og skrive med. Kun de ekstra menuer er slået fra.' }
    ]
  },

  /* =====================================================================
     INDSTILLINGER – tastatur, tid, Google, split screen
     ===================================================================== */
  {
    id: 'tastatur-sprog',
    title: 'Tastaturet skriver på engelsk eller mangler dansk',
    category: 'Indstillinger',
    summary: 'Æ, Ø og Å mangler, eller autokorrektur retter til engelske ord.',
    tags: ['Tastatur', 'Sprog', 'Dansk', 'Autokorrektur', 'Æøå'],
    steps: [
      { type: 'text', body: 'Gå til Indstillinger > Generel administration > Indstillinger for Samsung-tastatur > Sprog og typer.' },
      { type: 'text', body: 'Download og slå "Dansk" til. Slå engelsk fra, hvis du ikke bruger det. Så skifter tastaturet ikke ved en fejl.' },
      { type: 'note', body: 'Har du flere sprog slået til, skifter du sprog ved at swipe til siden på mellemrumstasten.' },
      { type: 'text', body: 'Slå autokorrektur fra, hvis den retter forkert: Indstillinger for Samsung-tastatur > Smart-skrivning > slå "Automatisk udskiftning" fra.' },
      { type: 'text', body: 'Tjek også tablettens sprog: Indstillinger > Generel administration > Sprog. Dansk skal stå øverst.' }
    ]
  },
  {
    id: 'tastatur-vises-ikke',
    title: 'Tastaturet kommer ikke frem',
    category: 'Indstillinger',
    summary: 'Du trykker i et tekstfelt, men der kommer intet tastatur.',
    tags: ['Tastatur', 'Vises ikke', 'Skrive', 'Samsung Tastatur'],
    steps: [
      { type: 'text', body: 'Tryk et andet sted på skærmen, og tryk derefter i tekstfeltet igen. Luk eventuelt appen helt, og åbn den igen.' },
      { type: 'text', body: 'Tjek standardtastaturet: Indstillinger > Generel administration > Tastatur > Standardtastatur > vælg Samsung-tastatur.' },
      { type: 'text', body: 'Er der tilsluttet et fysisk tastatur eller et cover med tastatur, så tag det af. Så gemmer tabletten skærmtastaturet.' },
      { type: 'text', body: 'Ryd tastaturets cache: Indstillinger > Apps > filter-ikonet ved søgefeltet ("Filtrer og sorter") > slå "Vis systemapps" til > OK > Samsung-tastatur > Lager > Ryd cache.' },
      { type: 'text', body: 'Genstart tabletten.' },
      { type: 'text', body: 'Nulstil tastaturet: Indstillinger for Samsung-tastatur > Nulstil til standardindstillinger.' },
      { type: 'danger', body: 'Kommer tastaturet stadig ikke frem, så kontakt IT-support.' }
    ]
  },
  {
    id: 'tid-forkert',
    title: 'Klokken eller datoen er forkert',
    category: 'Indstillinger',
    summary: 'Uret viser forkert tid. Det får login, Google og apps til at fejle.',
    tags: ['Klokken', 'Tid', 'Dato', 'Tidszone', 'Ur'],
    steps: [
      { type: 'text', body: 'Gå til Indstillinger > Generel administration > Dato og tid.' },
      { type: 'text', body: 'Slå "Automatisk dato og klokkeslæt" og "Automatisk tidszone" fra og til igen. Så henter tabletten tiden fra nettet igen.' },
      { type: 'text', body: 'Tjek at tabletten har internet. Uden net kan den ikke hente den rigtige tid.' },
      { type: 'note', body: 'Forkert tid gør, at login i apps fejler, at hjemmesider viser sikkerhedsfejl, og at Google Play ikke kan hente opdateringer.' },
      { type: 'text', body: 'Genstart tabletten, hvis tiden stadig er forkert med automatisk tid slået til.' }
    ]
  },
  {
    id: 'play-store-venter',
    title: 'Google Play "Venter på download" eller Play-tjenester stopper',
    category: 'Indstillinger',
    summary: 'Apps kan ikke hentes eller opdateres, eller der kommer fejlen "Google Play-tjenester bliver ved med at stoppe".',
    tags: ['Google Play', 'Play Butik', 'Download', 'Play-tjenester', 'Opdatering'],
    steps: [
      { type: 'text', body: 'Tjek at tabletten har internet, og at klokken er rigtig. Se guiden "Klokken eller datoen er forkert".' },
      { type: 'text', body: 'Tjek at der er mindst 1 GB ledig plads: Indstillinger > Enhedspleje > Lager.' },
      { type: 'text', body: 'Ryd cache i Google Play: Indstillinger > Apps > Google Play Butik > Lager > Ryd cache.' },
      { type: 'text', body: 'Ryd cache i Play-tjenester: Indstillinger > Apps > filter-ikonet ved søgefeltet ("Filtrer og sorter") > slå "Vis systemapps" til > OK > Google Play-tjenester > Lager > Ryd cache.' },
      { type: 'text', body: 'Gør det samme for "Downloadadministrator" (Download Manager) under systemapps.' },
      { type: 'text', body: 'Genstart tabletten, og prøv igen.' },
      { type: 'warn', body: 'Hjælper det ikke: Indstillinger > Konti og sikkerhedskopiering > Administrer konti > Google-kontoen > Fjern konto, og tilføj den igen. Du skal kende kontoens adgangskode. Spørg IT-support først.' },
      { type: 'danger', body: 'Fejler Play stadig, så kontakt IT-support.' }
    ]
  },
  {
    id: 'google-konto',
    title: 'Google-kontoen beder om login igen',
    category: 'Indstillinger',
    summary: 'Tabletten viser "Kontohandling påkrævet" eller beder om Google-adgangskode.',
    tags: ['Google', 'Konto', 'Login', 'Adgangskode', 'Gmail'],
    steps: [
      { type: 'note', body: 'Det sker typisk efter en adgangskode er blevet ændret, eller efter en større systemopdatering.' },
      { type: 'text', body: 'Tryk på meddelelsen, og log ind med tablettens Google-konto. Kender du ikke koden, så kontakt IT-support. Gæt ikke.' },
      { type: 'text', body: 'Tjek at klokken er rigtig, og at tabletten har internet, hvis login fejler.' },
      { type: 'text', body: 'Kommer meddelelsen igen og igen: Indstillinger > Konti og sikkerhedskopiering > Administrer konti > Google-kontoen > Fjern konto. Genstart, og tilføj kontoen igen under Tilføj konto > Google.' },
      { type: 'warn', body: 'Fjern kun kontoen, hvis du har adgangskoden. Uden kontoen virker Gmail, Google Play og Maps ikke.' },
      { type: 'danger', body: 'Bliver kontoen ved med at logge ud, så kontakt IT-support.' }
    ]
  },
  {
    id: 'split-screen',
    title: 'Brug to apps side om side (delt skærm)',
    category: 'Indstillinger',
    summary: 'Fx MV-appen og Google Maps på samme skærm.',
    tags: ['Delt skærm', 'Split screen', 'Multi-vindue', 'To apps', 'App-par'],
    steps: [
      { type: 'note', body: 'Det er hurtigst at bruge app-parret "MV + Maps" på startskærmen. Det åbner begge apps delt med ét tryk.' },
      { type: 'text', body: 'Manuelt: Åbn den første app. Swipe op fra bunden af skærmen, og hold, så oversigten over åbne apps vises.' },
      { type: 'text', body: 'Tryk på app-ikonet øverst på appens kort, og vælg "Åbn i visning med opdelt skærm".' },
      { type: 'text', body: 'Vælg den anden app fra listen. De to apps vises nu side om side.' },
      { type: 'text', body: 'Træk i stregen mellem de to apps for at gøre den ene større.' },
      { type: 'text', body: 'Tryk på de tre prikker på stregen midt imellem, og tryk på stjernen for at gemme kombinationen som et app-par på startskærmen.' },
      { type: 'text', body: 'Luk delt skærm: Træk stregen helt ud til kanten, eller swipe op fra bunden og luk appen.' },
      { type: 'note', body: 'Du kan også trække en app fra proceslinjen i bunden af skærmen ud til siden for at åbne den delt.' }
    ]
  }
];
