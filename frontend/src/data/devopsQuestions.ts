export interface Question {
    id: number;
    bankId?: number;
    part: number;
    partTitle: string;
    topic: string;
    question: string;
    options: { key: string; text: string }[];
    correctAnswer: string;
    explanation: string;
}

export const questionBank: Question[] = [
    // ==========================================
    // DEL 1: DevOps som arbetssätt (Modul 01)
    // ==========================================
    {
        id: 101,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "Muren av förvirring",
        question: "Vad är huvudorsaken till den så kallade ”muren av förvirring” (the wall of confusion) mellan traditionell utveckling (Dev) och drift (Ops)?",
        options: [
            { key: "A", text: "Utvecklare och drifttekniker använder olika programmeringsspråk och operativsystem." },
            { key: "B", text: "Utveckling mäts på förändring och nya funktioner, medan drift mäts på stabilitet och drifttid." },
            { key: "C", text: "Driftteamet saknar tillgång till källkodshantering i Git." },
            { key: "D", text: "Säkerhetsteamet förbjuder direkt kommunikation mellan utvecklare och drift." }
        ],
        correctAnswer: "B",
        explanation: "Utveckling drivs av att leverera ändringar snabbt, medan drift mäts på maximal stabilitet och drifttid. Det skapar motstridiga incitament ('the wall of confusion'). DevOps river muren genom gemensamt ansvar för hela livscykeln."
    },
    {
        id: 102,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "Satsstorlek och den onda spiralen",
        question: "Hur motverkar DevOps den onda spiralen med ”sällan-releaser”, rädsla och långa frysperioder?",
        options: [
            { key: "A", text: "Genom att göra ännu större releaser mer sällan under helger." },
            { key: "B", text: "Genom att lägga till fler manuella godkännandesteg och signaturer före release." },
            { key: "C", text: "Genom att leverera i små satsstorlekar (batch size) ofta och automatiserat." },
            { key: "D", text: "Genom att helt avskaffa automatiserade tester för att spara tid." }
        ],
        correctAnswer: "C",
        explanation: "Stora sällan-releaser skapar rädsla och frysperioder. Motmedlet är små satsstorlekar (small batch size) som levereras ofta; små ändringar medför lägre risk, snabbare felsökning och enklare återställning."
    },
    {
        id: 103,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "De tre principerna (Kontinuerligt lärande)",
        question: "Inom DevOps talas det om tre centrala principer (The Three Ways). Vad innebär den tredje principen (Kontinuerligt lärande)?",
        options: [
            { key: "A", text: "Att flytta kod så fort som möjligt från vänster till höger i pipelinen." },
            { key: "B", text: "Att ge omedelbar feedback till utvecklaren så fort ett enhetstest misslyckas." },
            { key: "C", text: "Att införa skuldfria post-mortems för att förstå vad i systemet som tillät att ett fel uppstod." },
            { key: "D", text: "Att tvinga alla utvecklare att skriva om sin kod varje vecka." }
        ],
        correctAnswer: "C",
        explanation: "Princip 1 är Flöde (vänster till höger), Princip 2 är Återkoppling (snabb feedback nära källan), och Princip 3 är Kontinuerligt lärande och experimenterande (bl.a. skuldfria post-mortems för att förbättra systemet utan att peka ut individer)."
    },
    {
        id: 104,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "DORA-mått för stabilitet",
        question: "Vilka två DORA-mått mäter systemets stabilitet?",
        options: [
            { key: "A", text: "Driftsättningsfrekvens (Deployment Frequency) och Ledtid (Lead Time for Changes)." },
            { key: "B", text: "Andel misslyckade ändringar (Change Failure Rate) och Återställningstid (Time to Restore Service)." },
            { key: "C", text: "Svarstid (Latency) och Mättnad (Saturation)." },
            { key: "D", text: "Ledtid (Lead Time) och Testtäckning (Code Coverage)." }
        ],
        correctAnswer: "B",
        explanation: "DORA delar in mätetalen i Hastighet (Deployment Frequency & Lead Time for Changes) och Stabilitet (Change Failure Rate & Time to Restore Service). Hastighet och stabilitet förstärker varandra!"
    },
    {
        id: 105,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "DORA-mått för hastighet",
        question: "Vilka två DORA-mått mäter systemets genomströmningshastighet (throughput)?",
        options: [
            { key: "A", text: "Driftsättningsfrekvens (Deployment Frequency) och Ledtid från ändring till drift (Lead Time for Changes)." },
            { key: "B", text: "Andel misslyckade ändringar och Tid till återställning." },
            { key: "C", text: "Processorbelastning och Minnesutnyttjande." },
            { key: "D", text: "Antal rader kod skrivna per vecka och Antal commits." }
        ],
        correctAnswer: "A",
        explanation: "Hastighet (Throughput) mäts via Deployment Frequency (hur ofta kod når produktion) och Lead Time for Changes (tiden det tar från commit till att ändringen rullar i produktion)."
    },
    {
        id: 106,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "Hastighet vs Stabilitet",
        question: "Varför visar modern DevOps-forskning (bl.a. DORA) att hög leveranshastighet och hög stabilitet följs åt istället för att motverka varandra?",
        options: [
            { key: "A", text: "För att snabbare datorer automatiskt eliminerar alla buggar i källkoden." },
            { key: "B", text: "För att små, frekventa ändringar medför lägre risk, mindre felområde och mycket enklare felsökning och återställning." },
            { key: "C", text: "För att team som levererar ofta hoppar över tester och därmed inte hittar några fel." },
            { key: "D", text: "För att molnleverantörer ger rabatt till företag med hög driftsättningsfrekvens." }
        ],
        correctAnswer: "B",
        explanation: "Tidigare trodde man att snabbhet skapade instabilitet. I själva verket ger små ändringar minimal risk och om något går fel vet man exakt vilken liten ändring som orsakade det, vilket gör återställningen snabb."
    },
    {
        id: 107,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "Kvalitetskriterier i utveckling vs drift",
        question: "Vilka kvalitetskriterier fokuserar primärt på drift (Ops) till skillnad från utveckling (Dev)?",
        options: [
            { key: "A", text: "Korrekthet, kodunderhållbarhet och läsbarhet i funktioner." },
            { key: "B", text: "Tillgänglighet, observerbarhet, återställbarhet och förutsägbarhet under körning." },
            { key: "C", text: "Typdefinitioner i TypeScript och semantiska HTML-taggar." },
            { key: "D", text: "Val av textredigerare och tangentbordslayouter." }
        ],
        correctAnswer: "B",
        explanation: "I utveckling mäts kvalitet ofta på korrekthet, underhållbarhet och spårbarhet. I drift mäts kvalitet på systemets beteende under körning: tillgänglighet, observerbarhet, återställbarhet och förutsägbarhet."
    },
    {
        id: 108,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "DevOps roll och ansvar",
        question: "Vilket påstående beskriver bäst vad DevOps är i en organisation?",
        options: [
            { key: "A", text: "En separat avdelning som sitter mellan utvecklarna och driftteknikerna." },
            { key: "B", text: "Ett gemensamt arbetssätt, en kultur och ett delat ansvar för hela livscykeln från kod till produktion." },
            { key: "C", text: "En specifik mjukvara som måste installeras på alla servrar." },
            { key: "D", text: "Enbart en yrkestitel för personer som skriver Docker-filer." }
        ],
        correctAnswer: "B",
        explanation: "DevOps är inte en isolerad roll eller ett separat team (vilket bara skulle skapa en ny mur), utan ett delat ansvar och en kultur där utveckling och drift samarbetar kring hela produktens livscykel."
    },
    {
        id: 109,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "De tre principerna (Flöde)",
        question: "Vad innebär den första principen (Flöde / Flow) inom DevOps?",
        options: [
            { key: "A", text: "Att minska satsstorleken och skapa ett snabbt, jämnt flöde av värde från vänster (utveckling) till höger (drift/kund)." },
            { key: "B", text: "Att styra om internettrafik vid överbelastning." },
            { key: "C", text: "Att bygga om koden från objektorienterad till funktionell programmering." },
            { key: "D", text: "Att automatiskt godkänna alla pull requests utan granskning." }
        ],
        correctAnswer: "A",
        explanation: "Den första principen handlar om att förstå och öka flödet av arbete från vänster till höger (från idé och kod till drift och användare) genom att eliminera flaskhalsar och minska batchstorlekar."
    },
    {
        id: 110,
        part: 1,
        partTitle: "Del 1: DevOps som arbetssätt",
        topic: "De tre principerna (Återkoppling)",
        question: "Vad innebär den andra principen (Återkoppling / Fast Feedback) inom DevOps?",
        options: [
            { key: "A", text: "Att skicka veckorapporter med e-post till företagsledningen." },
            { key: "B", text: "Att upptäcka fel och kvalitetsproblem så tidigt som möjligt nära källan och förkorta återkopplingsslingan." },
            { key: "C", text: "Att fråga användarna om betyg i App Store varje månad." },
            { key: "D", text: "Att alltid rulla tillbaka kod så fort ett varningsmeddelande loggas." }
        ],
        correctAnswer: "B",
        explanation: "Den andra principen fokuserar på att skapa snabb och kontinuerlig återkoppling från höger till vänster, så att fel upptäcks i samma stund de introduceras (t.ex. via snabba CI-tester) innan de når produktion."
    },

    // ==========================================
    // DEL 2: CI/CD och pipelines (Modul 02, 03, 05, 09)
    // ==========================================
    {
        id: 201,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "Trunk-based development",
        question: "Vad kännetecknar arbetssättet Trunk-based development till skillnad från långlivade funktionsgrenar (feature branches)?",
        options: [
            { key: "A", text: "Alla utvecklare arbetar lokalt utan att någonsin pusha till en delad server." },
            { key: "B", text: "Korta grenar som mergas ofta till main-grenen, vilket minimerar risken för stora merge-konflikter." },
            { key: "C", text: "Nya funktioner utvecklas i separata grenar under flera månader innan de integreras." },
            { key: "D", text: "Endast systemarkitekten har behörighet att skapa commits i Git." }
        ],
        correctAnswer: "B",
        explanation: "I Trunk-based development är grenarna kortlivade och mergas frekvent till main. Långlivade funktionsgrenar skjuter upp integrationen och leder till plågsamma merge-konflikter ('merge hell')."
    },
    {
        id: 202,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "Kvalitetsgrindar i CI",
        question: "Vad är den avgörande skillnaden mellan ett CI-test som enbart 'informerar' och en 'kvalitetsgrind' (quality gate)?",
        options: [
            { key: "A", text: "En kvalitetsgrind skickar e-post till teamet, medan ett vanligt test skriver ut loggar." },
            { key: "B", text: "En kvalitetsgrind kräver manuellt godkännande av en chef via telefon." },
            { key: "C", text: "En kvalitetsgrind stoppar sammanslagningen (merge) automatiskt via grenskyddsregler om testerna inte passerar." },
            { key: "D", text: "En kvalitetsgrind körs endast en gång per år vid större releaser." }
        ],
        correctAnswer: "C",
        explanation: "Ett test som bara informerar visar rött i konsolen men hindrar ingen. En kvalitetsgrind blockerar mergen med grenskydd ('Require status checks to pass before merging') så att felaktig kod aldrig når main."
    },
    {
        id: 203,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "Container Apps hälsokontroll (smoke test)",
        question: "Vid en hälsokontroll (smoke test) i Azure Container Apps – varför räcker det inte att bara anropa appens gemensamma URL och kontrollera statuskod 200?",
        options: [
            { key: "A", text: "För att den gemensamma URL:en kan svara med status 200 från en gammal revision trots att den nya revisionen kraschat." },
            { key: "B", text: "För att Azure Container Apps blockerar alla externa GET-anrop som inte innehåller en hemlig API-nyckel." },
            { key: "C", text: "För att statuskod 200 i molnet betyder att servern har slut på minne." },
            { key: "D", text: "För att hälsokontroller i Azure enbart kan göras via en SSH-tunnel." }
        ],
        correctAnswer: "A",
        explanation: "Appens gemensamma URL routar trafik till tidigare aktiva revisioner om den nya inte fungerar. Därför måste smoke-testet anropa den senaste revisionens unika adress (latestRevisionFqdn) och verifiera både status 200 och förväntat commit-id!"
    },
    {
        id: 204,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "Rollback i Container Apps",
        question: "Hur genomförs en snabb rollback i Azure Container Apps om en ny revision visar sig innehålla fel i drift?",
        options: [
            { key: "A", text: "Genom att radera hela resursgruppen och bygga om allt från början via Bicep." },
            { key: "B", text: "Genom att flytta tillbaka trafikvikten (--revision-weight) till den tidigare fungerande revisionen." },
            { key: "C", text: "Genom att göra en git revert och vänta på att en 45 minuters pipeline bygger en ny Docker-image." },
            { key: "D", text: "Genom att starta om den fysiska Azure-servern via Azure Portal." }
        ],
        correctAnswer: "B",
        explanation: "Gamla revisioner sparas intakta i Container Apps. En rollback görs på några sekunder genom att styra trafikvikten (--revision-weight) 100% tillbaka till den tidigare stabila revisionen."
    },
    {
        id: 205,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "CODEOWNERS och Pull Requests",
        question: "Vad är syftet med filen CODEOWNERS i ett Git-arkiv?",
        options: [
            { key: "A", text: "Att automatiskt tilldela obligatoriska granskare till pull requests baserat på vilka filer eller mappar som ändrats." },
            { key: "B", text: "Att kryptera källkoden så att utomstående inte kan läsa den." },
            { key: "C", text: "Att lista vem som har rätt att ta betalt för mjukvarulicensen." },
            { key: "D", text: "Att ersätta git-kommandot 'git blame' med en AI-agent." }
        ],
        correctAnswer: "A",
        explanation: "CODEOWNERS definierar vilka individer eller team som automatiskt blir obligatoriska granskare när en PR rör specifika filer, kataloger eller tekniska moduler (t.ex. infrastruktur eller databas)."
    },
    {
        id: 206,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "Conventional Commits och SemVer",
        question: "Hur kopplar formatet Conventional Commits samman en commit-typ som 'feat!:' eller 'fix:' till semantisk versionering (MAJOR.MINOR.PATCH)?",
        options: [
            { key: "A", text: "'fix:' ger MAJOR, 'feat:' ger PATCH, 'feat!:' ger MINOR." },
            { key: "B", text: "'fix:' ger PATCH, 'feat:' ger MINOR, och ett utropstecken 'feat!:' (eller BREAKING CHANGE) ger MAJOR." },
            { key: "C", text: "Conventional Commits har ingen koppling till versionsnummer." },
            { key: "D", text: "Alla commits höjer alltid MAJOR-versionen." }
        ],
        correctAnswer: "B",
        explanation: "fix: motsvarar en buggfix (PATCH), feat: introducerar en ny bakåtkompatibel funktion (MINOR), medan feat!: eller BREAKING CHANGE signalerar ett icke-bakåtkompatibelt brott (MAJOR)."
    },
    {
        id: 207,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "Strukturella begrepp i GitHub Actions",
        question: "Vad är actions/checkout i ett GitHub Actions-workflow och varför körs det nästan alltid som första steg?",
        options: [
            { key: "A", text: "Det är kommandot som betalar licensavgiften för runnern." },
            { key: "B", text: "Det klonar Git-arkivets källkod till den virtuella maskinen (runnern) så att efterföljande steg kan arbeta med koden." },
            { key: "C", text: "Det kontrollerar stavfel i commit-meddelandet." },
            { key: "D", text: "Det loggar ut alla andra användare från GitHub under bygget." }
        ],
        correctAnswer: "B",
        explanation: "En GitHub runner startar helt tom i en ren virtuell maskin. Steget 'actions/checkout' klonar ner repot till runnerns arbetsyta så att tester, byggen och Docker-kommandon har tillgång till källkoden."
    },
    {
        id: 208,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "Rollback vs Nästa Git Push i Container Apps",
        question: "Om du har gjort en akut rollback i Azure Container Apps via CLI (`--revision-weight`), vad händer nästa gång pipelinen körs och pushar en ny ändring?",
        options: [
            { key: "A", text: "Den manuella vikten ligger kvar för all framtid och ingen ny kod kan någonsin driftsättas." },
            { key: "B", text: "Mallens deklaration (t.ex. Bicep/GitHub Actions) vinner igen och ger 100% trafik till den nyskapade revisionen om inte mallen ändrats." },
            { key: "C", text: "Azure Container Apps raderas automatiskt på grund av konfigurationskonflikt." },
            { key: "D", text: "Pipelinen kräver manuellt lösenord för att få köra igen." }
        ],
        correctAnswer: "B",
        explanation: "En manuell ändring med --revision-weight är en imperativ nödåtgärd. Vid nästa körning av pipelinen kommer IaC-mallen (deklarationen) att slå igenom igen. Rätt permanent lösning är att även uppdatera koden/mallen i Git!"
    },
    {
        id: 209,
        part: 2,
        partTitle: "Del 2: CI/CD och pipelines",
        topic: "Workflow vs Job vs Step",
        question: "Hur förhåller sig begreppen Workflow, Job och Step till varandra i GitHub Actions?",
        options: [
            { key: "A", text: "Ett Step innehåller flera Workflows, som var och en kör ett Job." },
            { key: "B", text: "Ett Workflow (YAML-fil) består av ett eller flera Jobs (som kan köras parallellt på runners), och varje Job består av en sekvens av Steps." },
            { key: "C", text: "Job och Step är synonymer för samma sak i GitHub Actions." },
            { key: "D", text: "Ett Workflow kan bara innehålla ett enda Step." }
        ],
        correctAnswer: "B",
        explanation: "Hierarkin är: Workflow (hela processen definierad i en YAML-fil) -> Jobs (körs på separata runners, som standard parallellt) -> Steps (enskilda uppgifter/skript som körs sekventiellt inom ett jobb)."
    },

    // ==========================================
    // DEL 3: Drift och övervakning (Modul 08, 11)
    // ==========================================
    {
        id: 301,
        part: 3,
        partTitle: "Del 3: Drift och övervakning",
        topic: "Plattformsloggar vs Applikationstelemetri",
        question: "Vad är skillnaden mellan plattformsloggar och applikationstelemetri?",
        options: [
            { key: "A", text: "Plattformsloggar kräver kodändring i applikationen, medan telemetri samlas in automatiskt utan kodändring." },
            { key: "B", text: "Plattformsloggar ser anrop, statuskoder och latens utifrån utan kodändring, medan telemetri visar vad koden gör inuti appen via bibliotek/agent." },
            { key: "C", text: "Plattformsloggar sparas bara i 5 minuter medan telemetri sparas i 10 år." },
            { key: "D", text: "Plattformsloggar kan bara läsas i terminalen och kan inte skickas till Log Analytics." }
        ],
        correctAnswer: "B",
        explanation: "Plattformsloggar (t.ex. från ingress/load balancer) observerar trafiken utifrån utan ändring i applikationskoden. Applikationstelemetri (t.ex. via OpenTelemetry/Application Insights) kräver bibliotek i koden och ger insyn i funktioner, undantag och databasanrop."
    },
    {
        id: 302,
        part: 3,
        partTitle: "Del 3: Drift och övervakning",
        topic: "Log Analytics och Diagnostikinställning",
        question: "Du har skapat ett Log Analytics Workspace i Azure, men när du kör KQL-frågor är arbetsytan helt tom. Vad är den mest troliga orsaken?",
        options: [
            { key: "A", text: "Du har inte startat om din lokala dator." },
            { key: "B", text: "Du har glömt att koppla en diagnostikinställning (Diagnostic setting) från resurserna till arbetsytan." },
            { key: "C", text: "KQL-frågor kan bara köras om alla servrar har minst 100 GB RAM." },
            { key: "D", text: "Log Analytics stöder inte lagring av textloggar." }
        ],
        correctAnswer: "B",
        explanation: "Ett Log Analytics Workspace är en tom behållare tills du konfigurerar en 'Diagnostic setting' på Azure-resursen som pekar ut vart plattformsloggar och mätvärden ska skickas."
    },
    {
        id: 303,
        part: 3,
        partTitle: "Del 3: Drift och övervakning",
        topic: "Golden Signals (Mättnad / Saturation)",
        question: "Bland de fyra gyllene signalerna (The Four Golden Signals) finns Trafik, Fel, Latens och Mättnad (Saturation). Varifrån mäts normalt mättnad?",
        options: [
            { key: "A", text: "Från HTTP-accessloggarnas statuskoder." },
            { key: "B", text: "Från applikationens console.log-meddelanden." },
            { key: "C", text: "Från mätvärden (metrics) för resursutnyttjande som CPU- och minnesanvändning." },
            { key: "D", text: "Från git commit-historiken i GitHub." }
        ],
        correctAnswer: "C",
        explanation: "Trafik, Fel och Latens kan ofta läsas direkt ur HTTP-loggarna, medan Mättnad (Saturation) beskriver hur fulla resurserna är och mäts via systemmätvärden (metrics) för CPU, minne, disk eller trådpooler."
    },
    {
        id: 304,
        part: 3,
        partTitle: "Del 3: Drift och övervakning",
        topic: "Agerbara larm och larmtrötthet",
        question: "Varför bör larm (alerts) i ett övervakningssystem vara agerbara (actionable) och kopplade till symptom som användare faktiskt märker?",
        options: [
            { key: "A", text: "För att förhindra larmtrötthet (alert fatigue) och säkerställa att jourhavande tekniker vet vad som ska åtgärdas." },
            { key: "B", text: "För att Azure tar ut en straffavgift för varje larm som inte åtgärdas inom 5 minuter." },
            { key: "C", text: "För att det är omöjligt att skapa larm på mätvärden som CPU i Azure." },
            { key: "D", text: "För att utvecklarna annars inte får checka in kod under samma sprint." }
        ],
        correctAnswer: "A",
        explanation: "Om larm tjuter för minsta lilla icke-kritiska händelse uppstår larmtrötthet ('alert fatigue'), vilket leder till att tekniker ignorerar larmen. Larm ska vara agerbara (ha en tydlig åtgärd) och fokusera på användarpåverkan."
    },
    {
        id: 305,
        part: 3,
        partTitle: "Del 3: Drift och övervakning",
        topic: "KQL rörledning (pipe operator)",
        question: "Hur fungerar rörledningsprincipen med tecknet '|' (pipe) i KQL (Kusto Query Language)?",
        options: [
            { key: "A", text: "Den multiplicerar resultatet med 10." },
            { key: "B", text: "Den skickar data nedåt steg för steg, där varje operator (where, summarize, project) filtrerar eller transformerar resultatet från föregående steg." },
            { key: "C", text: "Den avbryter frågan och sparar den i en fil." },
            { key: "D", text: "Den kombinerar två helt orelaterade databaser till en tabell." }
        ],
        correctAnswer: "B",
        explanation: "KQL bygger på en rörledning där data flödar från vänster till höger / uppifrån och ned genom '|'-operatorer: Tabellnamn | where ... | summarize count() by ... | project ..."
    },
    {
        id: 306,
        part: 3,
        partTitle: "Del 3: Drift och övervakning",
        topic: "Strukturerad loggning vs Fri text",
        question: "Varför föredras strukturerad loggning (t.ex. i JSON med namngivna nyckel/värde-par) framför ostrukturerad fri text i modern drift?",
        options: [
            { key: "A", text: "För att fri text inte kan läsas av människor." },
            { key: "B", text: "För att strukturerade loggar kan filtreras, aggregeras och indexeras maskinellt snabbt och tillförlitligt i Log Analytics." },
            { key: "C", text: "För att JSON tar 90% mindre plats på hårddisken än vanlig text." },
            { key: "D", text: "För att brandväggar blockerar loggar som inte är i XML-format." }
        ],
        correctAnswer: "B",
        explanation: "Strukturerad loggning med fält (t.ex. `userId`, `statusCode`, `durationMs`) gör att loggverktyg som KQL/Log Analytics kan köra blixtsnabba aggregeringar och exakta sökningar utan sköra reguljära uttryck."
    },
    {
        id: 307,
        part: 3,
        partTitle: "Del 3: Drift och övervakning",
        topic: "KQL project operator",
        question: "Vad gör operatorn 'project' i en KQL-fråga?",
        options: [
            { key: "A", text: "Skapar ett nytt projekt i Azure DevOps." },
            { key: "B", text: "Väljer ut och visar exakt de kolumner du vill ha i resultatet och utesluter övriga." },
            { key: "C", text: "Beräknar medelvärdet för alla numeriska kolumner." },
            { key: "D", text: "Skickar ett projektförslag till produktägaren." }
        ],
        correctAnswer: "B",
        explanation: "I KQL används `project col1, col2` för att välja ut specifika kolumner (motsvarande SELECT i SQL). Detta är också användbart för att välja bort känslig data innan loggar delas!"
    },
    {
        id: 308,
        part: 3,
        partTitle: "Del 3: Drift och övervakning",
        topic: "Golden Signals (Latens och Fel)",
        question: "Om dina HTTP-loggar visar att en endpoint plötsligt har 95% anrop med statuskod 500 och svarstider över 15 sekunder, vilka två gyllene signaler indikerar problem?",
        options: [
            { key: "A", text: "Mättnad och Trafik." },
            { key: "B", text: "Fel (Errors) och Latens (Latency)." },
            { key: "C", text: "Deployment Frequency och Lead Time." },
            { key: "D", text: "Trunk och Branch." }
        ],
        correctAnswer: "B",
        explanation: "Statuskod 500 representerar signalen 'Fel' (Errors), och svarstiden på 15 sekunder representerar signalen 'Latens' (Latency) i Google SRE:s Four Golden Signals."
    },

    // ==========================================
    // DEL 4: Infrastruktur och plattformar (Modul 04, 07, 10)
    // ==========================================
    {
        id: 401,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "App Service-plan vs Web App",
        question: "Vad är skillnaden mellan en App Service-plan och en Web App i Azure App Service?",
        options: [
            { key: "A", text: "App Service-planen är koden som körs, medan Web App är själva den virtuella hårdvaran du betalar för." },
            { key: "B", text: "App Service-planen representerar serverkapaciteten och beräkningsresurserna du betalar för, medan Web App är själva applikationen som körs på planen." },
            { key: "C", text: "App Service-planen kan bara köra databaser, medan Web App hanterar DNS." },
            { key: "D", text: "Det finns ingen skillnad; de är två synonyma begrepp." }
        ],
        correctAnswer: "B",
        explanation: "App Service-planen är den underliggande beräkningsresursen (CPU, RAM, prisnivå) som du betalar för dygnet runt. Web App är webbapplikationen som körs ovanpå planen (du kan ha flera Web Apps på samma plan)."
    },
    {
        id: 402,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "Dockerfile optimering och lager-cache",
        question: "Varför kopieras vanligtvis package.json och körs npm ci i en Dockerfile innan hela källkoden (src/) kopieras in?",
        options: [
            { key: "A", text: "För att Docker inte tillåter kopiering av javascript-filer i samma steg som json-filer." },
            { key: "B", text: "För att utnyttja Dockers lager-cache: beroenden ändras mer sällan än källkoden, vilket gör framtida byggen mycket snabbare." },
            { key: "C", text: "För att npm kräver administratörsrättigheter (root) vid installation." },
            { key: "D", text: "För att källkoden krypteras automatiskt under byggprocessen." }
        ],
        correctAnswer: "B",
        explanation: "Docker cachar varje lager. Det som ändras sällan (beroendedefinitioner) läggs först. Då behöver inte npm ci köras om varje gång du bara ändrat en rad i källkoden!"
    },
    {
        id: 403,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "Säkerhet i containrar (USER node)",
        question: "Varför bör en container köras som en vanlig användare (t.ex. USER node) istället för root?",
        options: [
            { key: "A", text: "För att applikationen startar snabbare om den inte körs som root." },
            { key: "B", text: "För att tillämpa principen om minsta behörighet (least privilege) och begränsa skadan vid ett eventuellt säkerhetsintrång." },
            { key: "C", text: "För att Linux i containrar stänger ner alla processer som startas av root." },
            { key: "D", text: "För att root-användaren inte har tillgång till minnet." }
        ],
        correctAnswer: "B",
        explanation: "Om en sårbarhet i applikationen utnyttjas har en angripare root-behörighet om containern körs som root. Genom att byta till en icke-privilegierad användare (USER node) minimeras riskerna enligt principen om minsta behörighet."
    },
    {
        id: 404,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "Skala till noll (Scale to zero)",
        question: "Vilken egenskap i Azure Container Apps sparar pengar under perioder utan trafik, men kan orsaka en fördröjning (cold start) vid första anropet?",
        options: [
            { key: "A", text: "Skalning till noll (Scale to zero)." },
            { key: "B", text: "Vertikal uppskalning till P3v3." },
            { key: "C", text: "Automatisk migrering till App Service." },
            { key: "D", text: "Inaktivitetsradering av databasen." }
        ],
        correctAnswer: "A",
        explanation: "Azure Container Apps kan stänga ner alla repliker när ingen trafik kommer ('scale to zero'), vilket sänker kostnaden till 0 kr. Baksidan är en 'kallstart' (cold start) när första förfrågan anländer och en ny container måste starta."
    },
    {
        id: 405,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "Skala upp vs Skala ut",
        question: "Vad är skillnaden mellan att 'skala upp' (vertikalt) och att 'skala ut' (horisontellt)?",
        options: [
            { key: "A", text: "Skala upp innebär att byta till en större/kraftfullare server (t.ex. mer CPU/RAM), medan skala ut innebär att köra fler instanser bakom en lastbalanserare." },
            { key: "B", text: "Skala upp betyder att flytta från molnet till egen serverhall, medan skala ut betyder att stänga av servrar." },
            { key: "C", text: "Skala upp gäller databaser, skala ut gäller uteslutande CSS-filer." },
            { key: "D", text: "Det är ingen skillnad; båda innebär samma sak." }
        ],
        correctAnswer: "A",
        explanation: "Vertikal skalning (skala upp) ger en befintlig maskin mer resurser (t.ex. uppgradera från B1 till P0v3). Horisontell skalning (skala ut) lägger till fler parallella instanser för att hantera mer last."
    },
    {
        id: 406,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "Image vs Container",
        question: "Vad är den tekniska skillnaden mellan en Docker Image och en Docker Container?",
        options: [
            { key: "A", text: "En Image körs i molnet, medan en Container bara kan köras lokalt på Windows." },
            { key: "B", text: "En Image är ett statiskt, oföränderligt paket (receptet/mallen), medan en Container är en aktiv, körande instans med ett temporärt skrivlager." },
            { key: "C", text: "En Image raderas så fort den startas, medan en Container sparas för evigt." },
            { key: "D", text: "En Container är komprimerad zip-fil medan en Image är en textfil." }
        ],
        correctAnswer: "B",
        explanation: "En Docker image är en läsbar mall (ett statiskt paket). När du kör en image skapas en container, vilket är en isolerad process med ett tunt skrivlager ovanpå imagen."
    },
    {
        id: 407,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "Tillståndslöshet (Stateless)",
        question: "Varför säger man att containrar är tillståndslösa (stateless), och vad händer med data som skrivs inuti containerns eget filsystem när den ersätts?",
        options: [
            { key: "A", text: "All data som skrivs i containern försvinner när den stoppas eller ersätts; beständig data måste lagras i en extern tjänst/databas." },
            { key: "B", text: "Containrar synkroniserar automatiskt alla filer till OneDrive vid avstängning." },
            { key: "C", text: "Linux sparar containerns filer i BIOS på moderkortet." },
            { key: "D", text: "Tillståndslös betyder att containern inte behöver el för att köras." }
        ],
        correctAnswer: "A",
        explanation: "Containerns skrivlager är flyktigt (ephemeral). Om en container kraschar, skalas ner eller ersätts med en ny revision försvinner allt som sparats lokalt i den. Därför måste data ligga utanför, t.ex. i en hanterad databas eller blob storage."
    },
    {
        id: 408,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "ACR och behörigheter (AcrPush & AcrPull)",
        question: "Hur bör behörigheter i Azure Container Registry (ACR) konfigureras enligt säkerhetsprinciper?",
        options: [
            { key: "A", text: "Administratörskontot ska vara aktiverat med samma lösenord för alla servrar." },
            { key: "B", text: "Administratörskontot hålls avstängt; pipelinen ges enbart rollen AcrPush via hanterad identitet, och appen ges enbart rollen AcrPull." },
            { key: "C", text: "Registret görs helt publikt så att vem som helst kan ladda upp och ner images." },
            { key: "D", text: "Pipelinen och appen måste alltid ges rollen Owner på hela Azure-prenumerationen." }
        ],
        correctAnswer: "B",
        explanation: "Genom att stänga av admin-användaren och använda Managed Identity ges byggpipelinen minimal behörighet att bara trycka images (AcrPush), medan Container Apps bara får behörighet att hämta images (AcrPull)."
    },
    {
        id: 409,
        part: 4,
        partTitle: "Del 4: Infrastruktur och plattformar",
        topic: "Docker-taggar (commit-id vs latest)",
        question: "Varför rekommenderas det att tagga Docker-images med Git commit-id (t.ex. `myapp:a1b2c3d`) istället för att bara använda `myapp:latest`?",
        options: [
            { key: "A", text: "För att Docker Registry vägrar ta emot images som taggas med 'latest'." },
            { key: "B", text: "För att commit-id ger 100% spårbarhet mellan exakt källkod och den körande containern, och förhindrar att cachning maskerar ändringar." },
            { key: "C", text: "För att taggen 'latest' gör att containern körs 50% långsammare." },
            { key: "D", text: "För att git commit-id är ett krav för att använda Linux." }
        ],
        correctAnswer: "B",
        explanation: "'latest' är en rörlig pekare som gör det omöjligt att veta exakt vilken källkodsversion som körs i produktion. En unik immutable tagg (som commit-id) garanterar spårbarhet och gör rollback förutsägbar."
    },

    // ==========================================
    // DEL 5: Automatisering, IaC och AI (Modul 03, 06, 11)
    // ==========================================
    {
        id: 501,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "Bash strict mode (set -euo pipefail)",
        question: "Varför börjar robusta Bash-skript i CI/CD-pipelines ofta med kommandot 'set -euo pipefail'?",
        options: [
            { key: "A", text: "För att göra skriptet kompatibelt med Windows Command Prompt (cmd.exe)." },
            { key: "B", text: "För att skriptet automatiskt ska avbrytas vid fel (-e), vid odefinierade variabler (-u) och vid fel i rörledningar (-o pipefail)." },
            { key: "C", text: "För att förhindra att AI läser skriptets källkod." },
            { key: "D", text: "För att ignorera alla felkoder och alltid returnera exit code 0." }
        ],
        correctAnswer: "B",
        explanation: "'set -euo pipefail' är 'strict mode' i bash: -e avbryter vid felande kommando, -u avbryter vid användning av odefinierade variabler, och -o pipefail ser till att fel i en pipe-kedja (cmd1 | cmd2) inte maskeras."
    },
    {
        id: 502,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "Deklarativt vs Imperativt",
        question: "Vad är den principiella skillnaden mellan ett imperativt Azure CLI-kommando och en deklarativ Bicep-mall?",
        options: [
            { key: "A", text: "CLI talar om vad måltillståndet ska vara, medan Bicep körs manuellt rad för rad." },
            { key: "B", text: "CLI beskriver steg-för-steg hur något ska skapas (och felar ofta om resursen redan finns), medan Bicep beskriver vad som ska finnas oavsett nuvarande tillstånd." },
            { key: "C", text: "Bicep kan endast användas för virtuella maskiner, medan CLI hanterar containrar." },
            { key: "D", text: "CLI är idempotent av naturen medan Bicep aldrig är det." }
        ],
        correctAnswer: "B",
        explanation: "Imperativt (CLI): 'Gör A, sen B, sen C' – kan misslyckas om A redan finns. Deklarativt (Bicep/IaC): 'Så här ska infrastrukturen se ut'. Körs Bicep mot en miljö som redan stämmer ändras ingenting (idempotens)."
    },
    {
        id: 503,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "Bicep outputs och hemligheter",
        question: "Varför får lösenord, API-nycklar och hemliga anslutningssträngar inte returneras som output från en Bicep-modul?",
        options: [
            { key: "A", text: "För att Bicep automatiskt raderar resurser som har hemliga outputs." },
            { key: "B", text: "För att outputs sparas i klartext i Azures distributionshistorik och blir synliga för alla med läsrättighet." },
            { key: "C", text: "För att Azure Resource Manager inte stöder strängar längre än 8 tecken i outputs." },
            { key: "D", text: "För att outputs endast får innehålla numeriska ID:n." }
        ],
        correctAnswer: "B",
        explanation: "Allt som skickas via 'output' i Bicep sparas i klartext i distributionshistoriken (deployment history) i Azure Portal. Hemligheter ska därför skyddas med @secure() och hämtas direkt från Key Vault eller miljövariabler."
    },
    {
        id: 504,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "AI och personuppgifter (PII) i loggar",
        question: "När man använder AI som stöd för felsökning och analys av loggdata från produktion, vilken åtgärd är viktigast att vidta innan loggarna klistras in i AI-verktyget?",
        options: [
            { key: "A", text: "Att köra loggarna genom en komprimeringsalgoritm (zip)." },
            { key: "B", text: "Att rensa bort personuppgifter (PII), såsom IP-adresser, personnamn och hemligheter." },
            { key: "C", text: "Att översätta alla loggmeddelanden till svenska." },
            { key: "D", text: "Att ändra tidsstämplarna till UTC-tid för hand." }
        ],
        correctAnswer: "B",
        explanation: "Produktionsloggar innehåller ofta personuppgifter (PII som IP-adresser och e-post) eller tokens. Dessa måste alltid filtreras/saniteras (t.ex. via KQL project-away eller anonymisering) innan de delas med externa AI-verktyg för att följa GDPR och säkerhetspolicies."
    },
    {
        id: 505,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "Bicep what-if",
        question: "Vad är syftet med kommandot `what-if` vid distribution av Bicep-mallar i Azure, och vad är dess begränsning?",
        options: [
            { key: "A", text: "Det kör koden i produktion och ångrar den om testerna fallerar." },
            { key: "B", text: "Det ger en förutsägelse av vilka resurser som skapas (+), ändras (~) eller raderas (-), men kan innehålla brus och upptäcker inte t.ex. låsta resursnamn." },
            { key: "C", text: "Det genererar automatiskt en Bicep-mall från en handritad skiss." },
            { key: "D", text: "Det krypterar infrastrukturen mot cyberattacker." }
        ],
        correctAnswer: "B",
        explanation: "`what-if` gör en förhandsgranskning och jämför mallen med molnets tillstånd, men det är en uppskattning och kan visa falska ändringar (brus) eller missa körtidsproblem som resursnamnskonflikter."
    },
    {
        id: 506,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "Bicep moduler och implicita beroenden",
        question: "Hur avgör Azure i vilken ordning resurser ska skapas när du använder moduler i Bicep?",
        options: [
            { key: "A", text: "Azure skapar alltid resurserna i bokstavsordning efter filnamn." },
            { key: "B", text: "Genom att en modul läser en annan moduls output uppstår ett implicit beroende, vilket gör att Azure automatiskt skapar resurserna i rätt ordning." },
            { key: "C", text: "Utvecklaren måste lägga in en manuell paus med sleep-kommandon mellan varje modul." },
            { key: "D", text: "Alla moduler skapas alltid samtidigt utan inbördes ordning." }
        ],
        correctAnswer: "B",
        explanation: "När Modul B använder ett värde från Modul A:s output (`plan.outputs.id`) förstår Azure Resource Manager att Modul A måste skapas före Modul B (ett implicit beroende)."
    },
    {
        id: 507,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "Varför identity.bicep körs manuellt",
        question: "Varför körs distributionsskriptet för hanterade identiteter (identity.bicep) ofta manuellt i förväg istället för inuti CI/CD-pipelinen?",
        options: [
            { key: "A", text: "För att Azure inte stöder identiteter i Bicep-format." },
            { key: "B", text: "För att pipelinen själv behöver identiteten för att logga in, och pipelinens tjänstekonto saknar behörighet att tilldela nya RBAC-roller (kräver Owner/User Access Administrator)." },
            { key: "C", text: "För att identiteter i Azure bara kan skapas under helger." },
            { key: "D", text: "För att identity.bicep raderar alla andra resurser i prenumerationen." }
        ],
        correctAnswer: "B",
        explanation: "Det är ett 'hönan och ägget'-problem: Pipelinen loggar in med identiteten och kan därför inte skapa sig själv. Dessutom har en säker pipeline oftast bara Contributor-roll och får inte tilldela RBAC-roller."
    },
    {
        id: 508,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "Exit-koder i CI-skript",
        question: "Vilken exit-kod indikerar för CI/CD-pipelinen att ett steg lyckades utan fel?",
        options: [
            { key: "A", text: "Exit-kod 0." },
            { key: "B", text: "Exit-kod 1." },
            { key: "C", text: "Exit-kod 200." },
            { key: "D", text: "Exit-kod -1." }
        ],
        correctAnswer: "A",
        explanation: "I Unix/Linux och pipelines betyder exit-kod 0 SUCCESS (grönt bygge). Allt annat (1, 2, etc.) tolkas som ett fel och gör att steget markeras som rött och avbryts."
    },
    {
        id: 509,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "AI som stöd och fallgropar",
        question: "Vad är viktigt att tänka på när man använder AI-genererad kod eller YAML för GitHub Actions och Bicep?",
        options: [
            { key: "A", text: "AI-kod är garanterat felfri och behöver aldrig testas." },
            { key: "B", text: "Ett AI-förslag är en hypotes tills det testats; AI missar ofta dolda beroenden, glömmer actions/checkout eller genererar för breda triggers och behörigheter." },
            { key: "C", text: "AI fungerar bara för HTML och kan inte förstå YAML eller Bicep." },
            { key: "D", text: "GitHub förbjuder körning av kod som genererats med AI." }
        ],
        correctAnswer: "B",
        explanation: "AI är ett utmärkt bollplank men genererar ofta hallucinationer eller missar kontext. Man måste betrakta AI-kod som en hypotes och noga granska triggers, checkout-steg och behörighetsnivåer."
    },
    {
        id: 510,
        part: 5,
        partTitle: "Del 5: Automatisering, IaC och AI",
        topic: "Korrelation vs Kausalitet i loggar",
        question: "När du analyserar incidenter och loggar med stöd av AI – varför är det farligt att anta att två händelser som inträffade samtidigt har ett orsakssamband?",
        options: [
            { key: "A", text: "För att klockorna i Azure aldrig går i samma hastighet." },
            { key: "B", text: "För att korrelation inte är kausalitet; två händelser som sammanfaller i tid kan ha helt oberoende orsaker eller vara symptom på en tredje dold rotorsak." },
            { key: "C", text: "För att AI automatiskt raderar händelser som sker inom samma sekund." },
            { key: "D", text: "För att databaser inte kan spara millisekunder." }
        ],
        correctAnswer: "B",
        explanation: "Bara för att en bakgrundsjobb startade samtidigt som webbservern fick fel 500 betyder det inte att bakgrundsjobbet orsakade felet. En skicklig DevOps-ingenjör verifierar rotorsaken med telemetri."
    }
];

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Internal helper to format questions with randomized options and 1-based display IDs
function formatQuizQuestions(questions: Question[]): Question[] {
    return questions.map((q, index) => {
        const originalBankId = q.bankId || q.id;
        const shuffledOptions = shuffleArray(q.options);
        const keys = ["A", "B", "C", "D"];
        
        // Find which option was the correct one
        const correctOriginal = q.options.find(opt => opt.key === q.correctAnswer);
        const remappedOptions = shuffledOptions.map((opt, optIdx) => ({
            key: keys[optIdx],
            text: opt.text,
            isCorrect: opt.text === correctOriginal?.text
        }));

        const newCorrectKey = remappedOptions.find(opt => opt.isCorrect)?.key || "A";

        return {
            ...q,
            id: index + 1, // Display question number 1..N
            bankId: originalBankId, // Stable reference to the question bank
            options: remappedOptions.map(opt => ({ key: opt.key, text: opt.text })),
            correctAnswer: newCorrectKey
        };
    });
}

// Generate a fresh 20-question quiz: exactly 4 randomized questions from each of the 5 parts
export function generateRandomDevOpsQuiz(): Question[] {
    const selectedQuestions: Question[] = [];

    for (let partNumber = 1; partNumber <= 5; partNumber++) {
        const partPool = questionBank.filter(q => q.part === partNumber);
        const shuffledPartPool = shuffleArray(partPool);
        // Take 4 random questions for this part
        const chosenForPart = shuffledPartPool.slice(0, 4);
        selectedQuestions.push(...chosenForPart);
    }

    return formatQuizQuestions(selectedQuestions);
}

// Generate a targeted practice drill for ONE specific part (e.g. Del 1)
export function generatePartDrillQuiz(partNumber: number): Question[] {
    const partPool = questionBank.filter(q => q.part === partNumber);
    const shuffled = shuffleArray(partPool);
    // Take all available or up to 6 questions for a solid targeted drill
    const chosen = shuffled.slice(0, Math.min(shuffled.length, 6));
    return formatQuizQuestions(chosen);
}

// Generate a targeted quiz containing ONLY the questions matching given bankIds (Error bank drill)
export function generateCustomQuizFromBankIds(bankIds: number[]): Question[] {
    const uniqueIds = Array.from(new Set(bankIds));
    const matched = questionBank.filter(q => uniqueIds.includes(q.id));
    if (matched.length === 0) {
        return generateRandomDevOpsQuiz();
    }
    const shuffled = shuffleArray(matched);
    return formatQuizQuestions(shuffled);
}

