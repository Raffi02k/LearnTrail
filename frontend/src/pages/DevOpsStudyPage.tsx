import React, { useState } from 'react';
import { Topbar } from '../components/UI';
import { 
    Award, ArrowRight, ArrowLeft, CheckCircle2, XCircle, 
    Zap, GitBranch, Eye, Server, Terminal, RotateCw, 
    Lightbulb, AlertTriangle, Layers, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConceptCard {
    title: string;
    tag: string;
    question: string;
    coreFact: string; // The 1-sentence truth
    points: string[]; // 2-3 short bullet points
    examTip: string; // What ItsLearning tests
    wrongMyth?: string; // Common misconception
}

interface ModuleData {
    part: number;
    title: string;
    shortName: string;
    icon: React.ReactNode;
    color: string;
    accentBg: string;
    accentBorder: string;
    accentText: string;
    concepts: ConceptCard[];
}

const studyModules: ModuleData[] = [
    {
        part: 1,
        title: "Del 1: DevOps som arbetssätt",
        shortName: "DevOps & Kultur",
        icon: <Zap size={18} />,
        color: "amber",
        accentBg: "bg-amber-500/10",
        accentBorder: "border-amber-500/30",
        accentText: "text-amber-400",
        concepts: [
            {
                title: "Muren av förvirring (The Wall of Confusion)",
                tag: "KULTUR & MÅLKONFLIKT",
                question: "Varför uppstår muren mellan Dev och Ops?",
                coreFact: "Utveckling mäts på förändring (nya funktioner), medan drift mäts på stabilitet (drifttid).",
                points: [
                    "Dev vill släppa funktioner snabbt → Ops vill minimera ändringar för att undvika nertid.",
                    "DevOps river muren genom delat ansvar för hela livscykeln – från kod till produktion.",
                    "DevOps är ett arbetssätt och en kultur, inte en separat avdelning eller roll."
                ],
                examTip: "DevOps är INTE ett separat team som sitter emellan. Det är ett gemensamt ansvar!",
                wrongMyth: "DevOps innebär att utvecklare tar över all serverdrift helt ensamma."
            },
            {
                title: "Den onda spiralen vs Små satsstorlekar",
                tag: "LEVERANSFLÖDE",
                question: "Varför leder sällan-releaser till katastrof, och vad är motmedlet?",
                coreFact: "Stora sällan-releaser skapar rädsla och frysperioder. Motmedlet är små satsstorlekar ofta.",
                points: [
                    "Ond spiral: Stora releaser → Hög risk & buggar → Rädsla → Testfrysning → Ändringar köar → Ännu större release nästa gång.",
                    "Motmedlet: Små satsstorlekar (small batch size) som levereras frekvent.",
                    "Små ändringar = mindre felområde, lägre risk och snabbare felsökning."
                ],
                examTip: "Frekventa releaser i små satser minskar risken – de ökar den inte!",
                wrongMyth: "Att frysa kodändringar i flera månader gör systemet säkrare."
            },
            {
                title: "De tre principerna (The Three Ways)",
                tag: "GRUNDPRINCIPER",
                question: "Vilka är de tre principerna och vad innebär de?",
                coreFact: "1. Flöde (vänster till höger) • 2. Återkoppling (snabb feedback) • 3. Kontinuerligt lärande.",
                points: [
                    "Princip 1 (Flöde): Minska batcher och flytta ändringar snabbt från utveckling till drift/kund.",
                    "Princip 2 (Återkoppling): Fånga fel så tidigt som möjligt nära källan (t.ex. direkt vid commit).",
                    "Princip 3 (Lärande): Skuldfria post-mortems för att förstå hur systemet tillät felet utan att peka ut syndabockar."
                ],
                examTip: "Skuldfria post-mortems letar efter systembrister, inte enskilda personer att straffa.",
                wrongMyth: "Princip 3 handlar om att skicka utvecklare på obligatoriska kurser varje månad."
            },
            {
                title: "De 4 DORA-måtten",
                tag: "MÄTNING & RESULTAT",
                question: "Vilka mäter hastighet och vilka mäter stabilitet?",
                coreFact: "Hastighet och stabilitet följs åt! Små ändringar ger både högre fart och högre stabilitet.",
                points: [
                    "🚀 HASTIGHET (Throughput): Driftsättningsfrekvens (Deployment Frequency) & Ledtid för ändring (Lead Time).",
                    "🛡️ STABILITET (Stability): Andel misslyckade ändringar (Change Failure Rate) & Återställningstid (Time to Restore).",
                    "Team med hög hastighet har också högst stabilitet eftersom felen är små och enkla att laga."
                ],
                examTip: "Tentan frågar ofta vilka två mått som hör till stabilitet: Change Failure Rate och Time to Restore Service!",
                wrongMyth: "Man måste välja mellan att leverera snabbt ELLER stabilt."
            }
        ]
    },
    {
        part: 2,
        title: "Del 2: CI/CD och pipelines",
        shortName: "CI/CD & Pipelines",
        icon: <GitBranch size={18} />,
        color: "blue",
        accentBg: "bg-blue-500/10",
        accentBorder: "border-blue-500/30",
        accentText: "text-blue-400",
        concepts: [
            {
                title: "Trunk-based development",
                tag: "GIT & ARBETSSÄTT",
                question: "Vad är Trunk-based development och varför undviks långa grenar?",
                coreFact: "Korta grenar som mergas ofta till main minimerar risken för stora merge-konflikter.",
                points: [
                    "Utvecklare skapar korta grenar som lever i timmar eller max någon dag och mergas snabbt till main (trunk).",
                    "Långlivade funktionsgrenar skjuter upp integrationen och leder till svåra merge-konflikter ('merge hell').",
                    "Main-grenen hålls alltid i ett driftsättbart, grönt tillstånd."
                ],
                examTip: "Trunk-based = korta grenar som mergas ofta. Inte långlivade feature-grenar!",
                wrongMyth: "Trunk-based innebär att alla utvecklare pushar direkt till main utan tester eller granskning."
            },
            {
                title: "GitHub Actions struktur & Kvalitetsgrind",
                tag: "AUTOMATISERING",
                question: "Hur är en pipeline uppbyggd och vad är en kvalitetsgrind?",
                coreFact: "Workflow (YAML) → Jobs (på runners) → Steps. En kvalitetsgrind spärrar mergen automatiskt.",
                points: [
                    "actions/checkout: Hämtar källkoden från Git till den tomma runner-maskinen.",
                    "Ett test som bara loggar rött informerar bara; en KVALITETSGRIND (Required status check) spärrar sammanslagningen.",
                    "CODEOWNERS: Utser automatiskt obligatoriska granskare baserat på vilka mappar som ändrats."
                ],
                examTip: "En kvalitetsgrind kräver godkända tester i grenskyddsreglerna innan en PR får mergas.",
                wrongMyth: "actions/checkout behövs inte om du kör på en Linux-runner."
            },
            {
                title: "Conventional Commits & SemVer",
                tag: "VERSIONERING",
                question: "Hur kopplas commit-meddelanden till versionsnummer (MAJOR.MINOR.PATCH)?",
                coreFact: "feat!: (eller BREAKING CHANGE) = MAJOR • feat: = MINOR • fix: = PATCH.",
                points: [
                    "fix: Rättar en bugg bakåtkompatibelt → Höjer PATCH (1.0.0 → 1.0.1).",
                    "feat: Ny funktion bakåtkompatibelt → Höjer MINOR (1.0.0 → 1.1.0).",
                    "feat!: eller BREAKING CHANGE: Brytande ändring → Höjer MAJOR (1.0.0 → 2.0.0)."
                ],
                examTip: "Utropstecken (feat!:) eller BREAKING CHANGE signalerar alltid ett MAJOR versionssteg!",
                wrongMyth: "En vanlig 'feat:' höjer alltid MAJOR-versionen."
            },
            {
                title: "Smoke test & Rollback i Container Apps",
                tag: "DRIFTSÄTTNING & DRIFT",
                question: "Varför räcker inte bara status 200, och hur rullar man tillbaka?",
                coreFact: "Smoke test måste anropa latestRevisionFqdn (200 + commit-id). Rollback sker via trafikvikt.",
                points: [
                    "Appens gemensamma URL kan svara 200 från en gammal version fast den nya kraschat!",
                    "Smoke test måste anropa revisionens unika URL (`latestRevisionFqdn`) och verifiera både status 200 OCH commit-id.",
                    "Rollback görs på sekunder genom att flytta trafikvikten (`--revision-weight`) tillbaka till den gamla revisionen."
                ],
                examTip: "Vid nästa git push vinner IaC-mallens deklaration igen om den inte uppdaterats i Git!",
                wrongMyth: "Vid fel måste hela resursgruppen raderas för att rulla tillbaka i Container Apps."
            }
        ]
    },
    {
        part: 3,
        title: "Del 3: Drift och övervakning",
        shortName: "Drift & KQL",
        icon: <Eye size={18} />,
        color: "emerald",
        accentBg: "bg-emerald-500/10",
        accentBorder: "border-emerald-500/30",
        accentText: "text-emerald-400",
        concepts: [
            {
                title: "Plattformsloggar vs Applikationstelemetri",
                tag: "LOGGNIVÅER",
                question: "Vad är skillnaden och när används vad?",
                coreFact: "Plattformsloggar ser utifrån utan kodändring. Telemetri ser inuti koden via agent/bibliotek.",
                points: [
                    "Plattformsloggar: Skapas av Azure (t.ex. ingress/lastbalanserare) och ser anrop, statuskoder och latens utan kodändring.",
                    "Applikationstelemetri: Kräver kod/bibliotek (OpenTelemetry/Application Insights) och ser funktioner, undantag och databasanrop inuti appen."
                ],
                examTip: "Plattformsloggar kräver ingen kodändring. Telemetri kräver bibliotek eller agent i appen.",
                wrongMyth: "Plattformsloggar visar interna funktionsanrop och databasfel inuti appen."
            },
            {
                title: "Log Analytics & Diagnostikinställning",
                tag: "AZURE ÖVERVAKNING",
                question: "Varför är Log Analytics Workspace tomt trots att appen körs?",
                coreFact: "En Log Analytics Workspace är helt tom tills en 'Diagnostic setting' kopplas från resursen!",
                points: [
                    "Att skapa en workspace skapar bara en tom lagringsyta.",
                    "Du måste gå till resursen (t.ex. Container App) och lägga till en Diagnostikinställning som skickar loggarna dit."
                ],
                examTip: "Om en KQL-fråga inte ger några resultat i ett nybyggt labb beror det oftast på att diagnostikinställningen glömts bort.",
                wrongMyth: "Azure kopplar automatiskt alla loggar till första tillgängliga workspace utan inställning."
            },
            {
                title: "KQL (Kusto Query Language)",
                tag: "LOGGSÖKNING",
                question: "Hur fungerar pipe-operatorn '|' och vad gör 'project'?",
                coreFact: "Rörledningen '|' skickar data nedåt steg för steg. 'project' väljer ut specifika kolumner.",
                points: [
                    "Rörledning: Tabell | where Status >= 500 | summarize count() by bin(TimeGenerated, 5m) | project TimeGenerated, count_.",
                    "project: Väljer ut exakt de kolumner som ska visas (motsvarar SELECT i SQL).",
                    "Används även för att rensa bort personuppgifter (IP-adresser) innan loggdata sparas eller analyseras."
                ],
                examTip: "'where' filtrerar rader, 'summarize' aggregerar (t.ex. räknar), och 'project' väljer kolumner.",
                wrongMyth: "KQL körs med vanlig standard SQL Syntax (SELECT * FROM)."
            },
            {
                title: "The 4 Golden Signals & Agerbara Larm",
                tag: "SRE & LARM",
                question: "Vilka är signalerna och hur undviks larmtrötthet?",
                coreFact: "Trafik, Fel, Latens (ur loggar) och Mättnad (ur mätvärden/metrics för CPU/minne).",
                points: [
                    "De 4 signalerna: Trafik (anrop/s), Fel (status >= 500), Latens (svarstid) och Mättnad (CPU/RAM).",
                    "Varning: Mättnad (Saturation) kommer inte från loggar utan från mätvärden (metrics)!",
                    "Larm ska vara agerbara (actionable) och kopplas till användarsymptom för att undvika larmtrötthet (alert fatigue)."
                ],
                examTip: "Mättnad mäts på hårdvaruresurser (CPU/minne) via mätvärden, inte i textloggarna!",
                wrongMyth: "Ju fler larm som konfigureras för minsta lilla fel, desto säkrare blir systemet."
            }
        ]
    },
    {
        part: 4,
        title: "Del 4: Infrastruktur och plattformar",
        shortName: "Docker & Moln",
        icon: <Server size={18} />,
        color: "purple",
        accentBg: "bg-purple-500/10",
        accentBorder: "border-purple-500/30",
        accentText: "text-purple-400",
        concepts: [
            {
                title: "App Service-plan vs Web App & Skalning",
                tag: "AZURE RESURSER",
                question: "Vad är skillnaden och vad innebär skala upp vs ut?",
                coreFact: "Planen är serverkapaciteten du betalar för | Web App är koden som körs.",
                points: [
                    "App Service-planen = CPU, RAM och prisnivå (B1, P0v3 etc.). Du betalar dygnet runt oavsett trafik.",
                    "Skala upp (Vertikalt) = Byt till större/starkare maskin.",
                    "Skala ut (Horisontellt) = Kör fler parallella instanser bakom en lastbalanserare."
                ],
                examTip: "Flera Web Apps kan dela på en enda App Service-plan och därmed dela på samma månadskostnad.",
                wrongMyth: "Skala upp innebär att lägga till fler servrar."
            },
            {
                title: "Dockerfile optimering: Lager-cache",
                tag: "DOCKER BYGGE",
                question: "Varför kopieras package.json och körs npm ci före källkoden?",
                coreFact: "Docker återanvänder cachade lager! Beroenden ändras mer sällan än källkoden.",
                points: [
                    "1. COPY package*.json ./",
                    "2. RUN npm ci (Cachas så länge beroenden inte ändrats!)",
                    "3. COPY src/ ./ (Källkoden som ändras vid varje commit).",
                    "Om du kopierat src/ först tvingas Docker köra om npm ci vid varje minsta kodändring!"
                ],
                examTip: "Ordningen i en Dockerfile avgör byggtiden: Det som ändras sällan ska alltid ligga först!",
                wrongMyth: "Docker kan bara bygga en image snabbt om allt kopieras i ett enda steg."
            },
            {
                title: "Containrar: Stateless & Säkerhet (Icke-root)",
                tag: "SÄKERHET & DATA",
                question: "Varför köra som USER node och vad händer med lokal data vid omstart?",
                coreFact: "Containrar är tillståndslösa (stateless). Kör som vanlig användare (USER node) för minst behörighet.",
                points: [
                    "Tillståndslös (Stateless): Allt som skrivs i containerns lokala filsystem raderas vid omstart. Data måste ligga i molndatabas/storage.",
                    "Minst behörighet (Least privilege): Om en container körs som root och hackas får angriparen full root-kontroll.",
                    "Taggar: Tagga alltid med Git commit-id (myapp:a1b2c3d) för 100% spårbarhet istället för 'latest'."
                ],
                examTip: "Docker-containrar ska ALDRIG köras som root i produktion om det kan undvikas!",
                wrongMyth: "Filer sparade på containerns disk finns kvar automatiskt när en ny revision driftsätts."
            },
            {
                title: "Container Apps vs App Service & ACR roller",
                tag: "CONTAINER APPS & ACR",
                question: "Vad är skillnaden och vilka roller används i ACR?",
                coreFact: "Container Apps kan skala till noll (sparar pengar, ger kallstart). ACR admin hålls avstängt.",
                points: [
                    "Scale to zero: Container Apps stänger av repliker vid noll trafik. Ger en 'kallstart' (fördröjning vid första anrop).",
                    "App Service kan inte skala till noll (kostar pengar dygnet runt).",
                    "ACR: Pipelinen ges rollen AcrPush, Container Apps ges rollen AcrPull via hanterad identitet."
                ],
                examTip: "Pipelinen ska bara ha AcrPush, och appen ska bara ha AcrPull. Admin-kontot hålls avstängt!",
                wrongMyth: "Pipelinen och appen ska använda samma administrativa masterlösenord för ACR."
            }
        ]
    },
    {
        part: 5,
        title: "Del 5: Automatisering, IaC och AI",
        shortName: "IaC, Bash & AI",
        icon: <Terminal size={18} />,
        color: "rose",
        accentBg: "bg-rose-500/10",
        accentBorder: "border-rose-500/30",
        accentText: "text-rose-400",
        concepts: [
            {
                title: "Bash: 'set -euo pipefail' & Exit-koder",
                tag: "BASH & SKRIPTNING",
                question: "Vad betyder flaggorna och vilken exit-kod betyder lyckad?",
                coreFact: "-e (stanna vid fel), -u (stanna vid odefinierad variabel), -o pipefail (fånga fel i pipes). Exit 0 = lyckad.",
                points: [
                    "Bash fortsätter som standard vid fel, vilket kan dölja trasiga byggen!",
                    "`set -euo pipefail` aktiverar 'strict mode': avbryter direkt vid fel så pipelinen inte fortsätter felaktigt.",
                    "Exit-kod 0 betyder lyckat/grönt steg; alla koder >0 betyder fel/rött steg."
                ],
                examTip: "Exit-kod 0 är det enda som signalerar lyckad körning i terminalen och i pipelines.",
                wrongMyth: "Exit-kod 1 betyder att skriptet kördes på server 1."
            },
            {
                title: "Deklarativt (Bicep) vs Imperativt (CLI) & what-if",
                tag: "INFRASTRUKTUR SOM KOD",
                question: "Vad skiljer Bicep från CLI-kommandon och vad gör what-if?",
                coreFact: "CLI beskriver 'hur' steg för steg. Bicep beskriver 'vad' som ska finnas (idempotent).",
                points: [
                    "Imperativt (CLI: az webapp create): Säger exakt vad datorn ska göra nu, felar om resursen redan finns.",
                    "Deklarativt (Bicep): Beskriver det önskade sluttillståndet. Körs det mot en miljö som redan stämmer sker ingenting (idempotens).",
                    "what-if: Förutsäger skapande (+), ändring (~) och borttagning (-), men kan innehålla visst brus."
                ],
                examTip: "Bicep är deklarativt och idempotent – det säkerställer rätt tillstånd utan onödiga krascher.",
                wrongMyth: "Bicep och Azure CLI gör exakt samma sak på exakt samma sätt."
            },
            {
                title: "Bicep moduler, outputs & hemligheter",
                tag: "BICEP ARKITEKTUR",
                question: "Hur skapas ordning och varför får hemligheter aldrig vara output?",
                coreFact: "Modulers output skapar implicita beroenden. Hemligheter får ALDRIG vara output!",
                points: [
                    "Implicit beroende: När webbapps-modulen läser `plan.outputs.id` vet Azure automatiskt att planen måste skapas först.",
                    "Hemligheter: Allt som returneras som 'output' i Bicep sparas i klartext i Azures distributionshistorik!",
                    "Känsliga värden måste skyddas med `@secure()` och hämtas direkt från Key Vault eller miljövariabler."
                ],
                examTip: "Skicka ALDRIG lösenord via Bicep-outputs eftersom det loggas i klartext i Azure Portal!",
                wrongMyth: "Bicep skapar alltid resurser i samma ordning som de skrivits i filen uppifrån och ned."
            },
            {
                title: "Varför identity.bicep körs manuellt & AI-stöd",
                tag: "SÄKERHET & AI",
                question: "Varför körs identity manuellt och vad gäller för AI med produktionsloggar?",
                coreFact: "Pipelinen kan inte skapa sin egen inloggning. AI-förslag är hypoteser och loggar måste PII-rensas.",
                points: [
                    "identity.bicep: Körs manuellt i förväg eftersom pipelinen inte kan skapa den identitet den själv loggar in med, och pipelinen saknar rätt att dela ut RBAC-roller.",
                    "AI som stöd: Ett AI-förslag är bara en hypotes tills det testats; AI missar ofta dolda beroenden.",
                    "Loggar & GDPR: Rensa alltid bort personuppgifter (PII som IP-adresser) innan produktionsdata klistras in i AI-verktyg."
                ],
                examTip: "Pipelinen har oftast bara Contributor-roll och kan därför inte ge sig själv RBAC-roller.",
                wrongMyth: "AI-genererad GitHub Actions YAML är alltid garanterat fri från säkerhetsbrister."
            }
        ]
    }
];

export const DevOpsStudyPage: React.FC = () => {
    const [selectedPart, setSelectedPart] = useState<number>(1);
    const [viewMode, setViewMode] = useState<'flashcards' | 'overview'>('flashcards');
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const currentModule = studyModules.find(m => m.part === selectedPart) || studyModules[0];
    const currentConcept = currentModule.concepts[currentCardIndex] || currentModule.concepts[0];

    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prev => (prev + 1) % currentModule.concepts.length);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prev => (prev - 1 + currentModule.concepts.length) % currentModule.concepts.length);
    };

    const handleSelectPart = (partNum: number) => {
        setSelectedPart(partNum);
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground selection:bg-primary/30">
            <Topbar title="DevOps Träningsguide" />

            <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6">

                {/* Clean, Focused Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/60">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary mb-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            INTERAKTIV STUDIEGUIDE INFÖR TENTAN
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                            Träna på begreppen inför måndag
                        </h1>
                        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                            Krav för Godkänt (G): Minst <strong className="text-foreground">3 av 4 rätt</strong> på varje del!
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="bg-secondary/60 p-1 rounded-xl border border-border flex items-center gap-1 text-xs font-bold">
                            <button
                                onClick={() => setViewMode('flashcards')}
                                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                                    viewMode === 'flashcards' 
                                        ? 'bg-primary text-primary-foreground shadow-sm' 
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Layers size={14} /> Flashcards
                            </button>
                            <button
                                onClick={() => setViewMode('overview')}
                                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                                    viewMode === 'overview' 
                                        ? 'bg-primary text-primary-foreground shadow-sm' 
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <BookOpen size={14} /> Översikt
                            </button>
                        </div>

                        <Link
                            to="/devops-quiz"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-1.5"
                        >
                            <Award size={15} /> Gör Quiz (20 Frågor)
                        </Link>
                    </div>
                </div>

                {/* 5 Part Selector Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {studyModules.map(m => {
                        const isSelected = m.part === selectedPart;
                        return (
                            <button
                                key={m.part}
                                onClick={() => handleSelectPart(m.part)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    isSelected 
                                        ? `${m.accentBg} ${m.accentBorder} ring-2 ring-primary/40 shadow-md` 
                                        : 'bg-card border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <div className="flex items-center justify-between text-xs font-bold mb-1">
                                    <span className={isSelected ? m.accentText : 'text-muted-foreground'}>
                                        Del {m.part}
                                    </span>
                                    {m.icon}
                                </div>
                                <div className={`text-xs font-bold truncate ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {m.shortName}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ============================================================== */}
                {/* MODE 1: FLASHCARDS (Bite-sized, 1 concept at a time)          */}
                {/* ============================================================== */}
                {viewMode === 'flashcards' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        {/* Progress Indicator */}
                        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
                            <span className="font-bold text-foreground">
                                {currentModule.title}
                            </span>
                            <span>
                                Kort {currentCardIndex + 1} av {currentModule.concepts.length}
                            </span>
                        </div>

                        {/* Flashcard Box */}
                        <div
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="min-h-[380px] bg-card border-2 border-border/80 hover:border-primary/50 rounded-2xl p-6 md:p-10 cursor-pointer transition-all shadow-2xl flex flex-col justify-between relative group select-none"
                        >
                            {/* Card Top Metadata */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-secondary text-primary border border-primary/20">
                                    {currentConcept.tag}
                                </span>
                                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 group-hover:text-primary transition-colors">
                                    <RotateCw size={13} className={isFlipped ? "rotate-180 transition-transform" : ""} />
                                    {isFlipped ? "Klicka för att se frågan" : "Klicka för att vända"}
                                </span>
                            </div>

                            {/* FRONT (QUESTION) */}
                            {!isFlipped ? (
                                <div className="my-auto py-8 text-center space-y-4">
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                                        {currentConcept.title}
                                    </h2>
                                    <div className="inline-block bg-secondary/50 border border-border px-5 py-3 rounded-xl text-base md:text-lg font-medium text-muted-foreground">
                                        ❓ {currentConcept.question}
                                    </div>
                                    <div className="text-xs font-mono text-primary/80 pt-4 flex items-center justify-center gap-1.5">
                                        <Lightbulb size={14} /> Klicka var som helst på kortet för att se svaret
                                    </div>
                                </div>
                            ) : (
                                /* BACK (ANSWER & EXAM TAKEAWAYS) */
                                <div className="my-auto py-4 space-y-5 animate-in fade-in duration-150">
                                    <div>
                                        <div className="text-xs font-mono font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                                            Kärnan (Vad du ska svara på tentan):
                                        </div>
                                        <div className="text-lg md:text-xl font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl leading-relaxed">
                                            💡 {currentConcept.coreFact}
                                        </div>
                                    </div>

                                    {/* Bullet points */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                                            Viktiga detaljer:
                                        </div>
                                        <ul className="space-y-1.5 text-sm md:text-base text-foreground/90 pl-1">
                                            {currentConcept.points.map((pt, pIdx) => (
                                                <li key={pIdx} className="flex items-start gap-2.5">
                                                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-1" />
                                                    <span>{pt}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Exam Tip */}
                                    <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs md:text-sm text-amber-300 flex items-start gap-2.5">
                                        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                        <span><strong>Tenta-tips:</strong> {currentConcept.examTip}</span>
                                    </div>
                                </div>
                            )}

                            {/* Card Footer Progress Dots */}
                            <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/40">
                                {currentModule.concepts.map((_, dotIdx) => (
                                    <div
                                        key={dotIdx}
                                        className={`h-2 rounded-full transition-all ${
                                            dotIdx === currentCardIndex 
                                                ? 'w-6 bg-primary' 
                                                : 'w-2 bg-secondary'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Controls Bottom */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={handlePrevCard}
                                className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary font-bold text-xs md:text-sm flex items-center gap-2 transition-all active:scale-95"
                            >
                                <ArrowLeft size={16} /> Föregående begrepp
                            </button>

                            <button
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="px-4 py-2.5 rounded-xl border border-primary/30 text-primary font-bold text-xs md:text-sm hover:bg-primary/10 transition-all flex items-center gap-1.5"
                            >
                                <RotateCw size={14} /> Vänd kort
                            </button>

                            <button
                                onClick={handleNextCard}
                                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs md:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-primary/20"
                            >
                                Nästa begrepp <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* MODE 2: OVERVIEW (Clean, readable, non-overwhelming list)     */}
                {/* ============================================================== */}
                {viewMode === 'overview' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="text-xs font-mono font-bold text-muted-foreground uppercase px-1">
                            Sammanfattning för {currentModule.title}:
                        </div>

                        <div className="space-y-4">
                            {currentModule.concepts.map((concept, idx) => (
                                <div
                                    key={idx}
                                    className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4 hover:border-primary/40 transition-all shadow-md"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                                        <h3 className="text-lg md:text-xl font-black text-foreground flex items-center gap-2.5">
                                            <span className="w-6 h-6 rounded-md bg-secondary text-primary text-xs font-mono font-bold flex items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            {concept.title}
                                        </h3>
                                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-secondary text-muted-foreground uppercase">
                                            {concept.tag}
                                        </span>
                                    </div>

                                    {/* The core truth */}
                                    <div className="text-sm md:text-base font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
                                        ✅ <strong>Rätt svar på tentan:</strong> {concept.coreFact}
                                    </div>

                                    {/* Bullet details */}
                                    <div className="grid md:grid-cols-2 gap-3 text-xs md:text-sm">
                                        <div className="space-y-1.5 bg-secondary/30 p-3.5 rounded-xl border border-border/50">
                                            <div className="font-bold text-muted-foreground text-xs uppercase font-mono">
                                                Detta ska du förstå:
                                            </div>
                                            <ul className="space-y-1 text-foreground/90">
                                                {concept.points.map((pt, pIdx) => (
                                                    <li key={pIdx} className="flex items-start gap-1.5">
                                                        <span className="text-primary font-bold">•</span>
                                                        <span>{pt}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-2 flex flex-col justify-between">
                                            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-300">
                                                <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                                                    <AlertTriangle size={13} /> Tenta-tips & Kuggfälla:
                                                </div>
                                                {concept.examTip}
                                            </div>

                                            {concept.wrongMyth && (
                                                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-xs text-red-300 flex items-start gap-1.5">
                                                    <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                                                    <span><strong>Vanlig felaktig myt:</strong> {concept.wrongMyth}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom CTA */}
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary to-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-black text-lg">Klar med {currentModule.title}?</h4>
                                <p className="text-xs text-muted-foreground">Testa dina kunskaper på provet för att se om du når Godkänt (minst 3 av 4).</p>
                            </div>
                            <Link
                                to="/devops-quiz"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-primary/20 shrink-0 flex items-center gap-2"
                            >
                                Starta Provträningen Nu <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
