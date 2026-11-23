import React, { useState, useEffect } from 'react';
import { Topbar } from '../components/UI';
import { 
    Clock, CheckCircle2, XCircle, AlertTriangle, RotateCcw, 
    ArrowRight, ArrowLeft, Award, HelpCircle, Check, Sparkles, Shuffle, 
    BookOpen, History, Target, Flame, Trash2, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Question, generateRandomDevOpsQuiz, generatePartDrillQuiz, 
    generateCustomQuizFromBankIds, questionBank 
} from '../data/devopsQuestions';
import { quizTracker, QuizAttempt, WrongQuestionDetail } from '../lib/quizTracker';

export const DevOpsQuizPage: React.FC = () => {
    const { user, addXp } = useAuth();

    // Mode State
    const [quizModeTitle, setQuizModeTitle] = useState<string>("ItsLearning Fullskaligt Prov (20 frågor)");
    const [quizQuestions, setQuizQuestions] = useState<Question[]>(() => generateRandomDevOpsQuiz());

    // Answer State
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
    const [filterPart, setFilterPart] = useState<number>(0); // 0 = Alla
    const [instantFeedback, setInstantFeedback] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(60 * 60); // 60 minuter
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

    // XP Reward State
    const [earnedXpResult, setEarnedXpResult] = useState<{
        base: number;
        passBonus: number;
        perfectBonus: number;
        total: number;
    } | null>(null);

    // Wrong Questions list for current submission
    const [currentWrongQuestions, setCurrentWrongQuestions] = useState<WrongQuestionDetail[]>([]);
    const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
    const [errorAnalysisExpanded, setErrorAnalysisExpanded] = useState<boolean>(true);

    // History and Error Bank from tracker
    const [historyAttempts, setHistoryAttempts] = useState<QuizAttempt[]>(() => quizTracker.getAttempts());
    const [errorBank, setErrorBank] = useState<WrongQuestionDetail[]>(() => quizTracker.getErrorBank());
    const analytics = quizTracker.getAnalytics();

    // Timer effect
    useEffect(() => {
        if (!isTimerRunning || isSubmitted) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isTimerRunning, isSubmitted]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (questionId: number, optionKey: string) => {
        if (isSubmitted && !instantFeedback) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionKey
        }));
    };

    // Calculate score per part
    const partStats = [1, 2, 3, 4, 5].map(partNum => {
        const partQuestions = quizQuestions.filter(q => q.part === partNum);
        let correctCount = 0;
        partQuestions.forEach(q => {
            if (selectedAnswers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });
        const isPassed = partQuestions.length === 0 || correctCount >= Math.min(partQuestions.length, 3);
        return {
            part: partNum,
            correct: correctCount,
            total: partQuestions.length,
            isPassed
        };
    });

    const totalCorrect = quizQuestions.reduce((acc, q) => {
        return acc + (selectedAnswers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    const isAllPartsPassed = partStats.filter(p => p.total > 0).every(p => p.isPassed);

    // Identify which parts failed
    const failedParts = partStats.filter(p => p.total > 0 && !p.isPassed);

    const currentQuestion = quizQuestions[activeQuestionIndex];

    // Submit and track quiz
    const handleSubmitQuiz = () => {
        setIsSubmitted(true);
        setIsTimerRunning(false);

        // Compile wrong questions
        const wrongs: WrongQuestionDetail[] = [];
        quizQuestions.forEach(q => {
            const userKey = selectedAnswers[q.id];
            if (userKey !== q.correctAnswer) {
                const userOpt = q.options.find(o => o.key === userKey);
                const correctOpt = q.options.find(o => o.key === q.correctAnswer);
                wrongs.push({
                    bankId: q.bankId || q.id,
                    part: q.part,
                    partTitle: q.partTitle,
                    topic: q.topic,
                    question: q.question,
                    userAnswerKey: userKey || "Inget svar",
                    userAnswerText: userOpt ? userOpt.text : "Inget svar lämnat",
                    correctAnswerKey: q.correctAnswer,
                    correctAnswerText: correctOpt ? correctOpt.text : "",
                    explanation: q.explanation
                });
            }
        });

        setCurrentWrongQuestions(wrongs);

        // Calculate earned XP
        const base = totalCorrect * 10;
        const passBonus = isAllPartsPassed && quizQuestions.length >= 20 ? 50 : 0;
        const perfectBonus = totalCorrect === quizQuestions.length && quizQuestions.length >= 20 ? 100 : 0;
        const earnedXp = base + passBonus + perfectBonus;

        setEarnedXpResult({
            base,
            passBonus,
            perfectBonus,
            total: earnedXp
        });

        // Award XP to user profile & backend
        if (earnedXp > 0) {
            addXp(earnedXp);
        }

        // Save attempt in quiz tracker
        quizTracker.saveAttempt({
            quizTitle: quizModeTitle,
            totalCorrect,
            totalQuestions: quizQuestions.length,
            earnedXp,
            isAllPartsPassed,
            partScores: partStats,
            wrongQuestions: wrongs
        });

        // Refresh stats
        setHistoryAttempts(quizTracker.getAttempts());
        setErrorBank(quizTracker.getErrorBank());
    };

    // Reset with the SAME questions
    const restartCurrentQuiz = () => {
        if (window.confirm("Vill du starta om detta prov med samma frågor?")) {
            setSelectedAnswers({});
            setIsSubmitted(false);
            setActiveQuestionIndex(0);
            setTimeLeft(60 * 60);
            setIsTimerRunning(true);
            setCurrentWrongQuestions([]);
            setEarnedXpResult(null);
        }
    };

    // Generate a BRAND NEW randomized set of questions (4 from each part)
    const generateNewRandomQuiz = () => {
        if (Object.keys(selectedAnswers).length > 0 && !isSubmitted) {
            if (!window.confirm("Är du säker på att du vill slumpa fram ett helt nytt prov? Dina påbörjade svar försvinner.")) return;
        }
        setQuizModeTitle("ItsLearning Fullskaligt Prov (20 frågor)");
        setQuizQuestions(generateRandomDevOpsQuiz());
        setSelectedAnswers({});
        setIsSubmitted(false);
        setActiveQuestionIndex(0);
        setFilterPart(0);
        setTimeLeft(60 * 60);
        setIsTimerRunning(true);
        setCurrentWrongQuestions([]);
        setEarnedXpResult(null);
    };

    // TARGETED TRAINING 1: Practice on current errors
    const startDrillOnCurrentErrors = () => {
        if (currentWrongQuestions.length === 0) return;
        const bankIds = currentWrongQuestions.map(w => w.bankId);
        const drillQuestions = generateCustomQuizFromBankIds(bankIds);

        setQuizModeTitle(`Fokusträning: Dina ${drillQuestions.length} fel från senaste provet`);
        setQuizQuestions(drillQuestions);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setActiveQuestionIndex(0);
        setFilterPart(0);
        setTimeLeft(Math.max(10, drillQuestions.length * 3) * 60);
        setIsTimerRunning(true);
        setCurrentWrongQuestions([]);
        setEarnedXpResult(null);
        setShowHistoryModal(false);
    };

    // TARGETED TRAINING 2: Practice on a specific failed module (e.g. Del 1)
    const startDrillOnSpecificPart = (partNumber: number) => {
        const drillQuestions = generatePartDrillQuiz(partNumber);
        setQuizModeTitle(`Fokusträning: Del ${partNumber} (Intensivövning)`);
        setQuizQuestions(drillQuestions);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setActiveQuestionIndex(0);
        setFilterPart(partNumber);
        setTimeLeft(Math.max(10, drillQuestions.length * 3) * 60);
        setIsTimerRunning(true);
        setCurrentWrongQuestions([]);
        setEarnedXpResult(null);
        setShowHistoryModal(false);
    };

    // TARGETED TRAINING 3: Practice all questions in persistent Error Bank
    const startDrillOnErrorBank = () => {
        const bank = quizTracker.getErrorBank();
        if (bank.length === 0) {
            alert("Din felbank är tom! Bra jobbat!");
            return;
        }
        const bankIds = bank.map(b => b.bankId);
        const drillQuestions = generateCustomQuizFromBankIds(bankIds);

        setQuizModeTitle(`Felbanken: Träna på alla dina ${drillQuestions.length} sparade fel`);
        setQuizQuestions(drillQuestions);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setActiveQuestionIndex(0);
        setFilterPart(0);
        setTimeLeft(Math.max(10, drillQuestions.length * 3) * 60);
        setIsTimerRunning(true);
        setCurrentWrongQuestions([]);
        setEarnedXpResult(null);
        setShowHistoryModal(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground selection:bg-primary/30">
            <Topbar title="DevOps Tentaträning" />

            <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-card via-[#161b26] to-secondary border border-border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                {quizModeTitle.toUpperCase()}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
                                <Sparkles size={12} />
                                {questionBank.length} frågor i frågebanken
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
                                <Zap size={12} className="fill-amber-400" />
                                {user?.xp_total ?? 0} XP
                            </span>
                            {errorBank.length > 0 && (
                                <button
                                    onClick={() => setShowHistoryModal(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-colors"
                                >
                                    <Target size={12} />
                                    {errorBank.length} fel i felbanken
                                </button>
                            )}
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            DevOps Tentaträning
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                            {quizQuestions.length} frågor i detta pass. <strong className="text-foreground">Krav för Godkänt (G):</strong> Minst <span className="text-primary font-bold">3 av 4 rätt på varje enskild del</span>.
                        </p>
                    </div>

                    {/* Timer & Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono font-bold text-sm ${
                            timeLeft < 300 
                                ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
                                : 'bg-secondary/70 border-border text-foreground'
                        }`}>
                            <Clock size={16} className={timeLeft < 300 ? "text-red-400" : "text-primary"} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>

                        <button
                            onClick={() => setShowHistoryModal(true)}
                            className="bg-secondary hover:bg-secondary/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:border-blue-500/50 active:scale-95 shadow-sm"
                        >
                            <History size={16} className="text-blue-400" /> Mina prov & fel
                        </button>

                        <Link
                            to="/devops-study"
                            className="bg-secondary hover:bg-secondary/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:border-emerald-500/50 active:scale-95 shadow-sm"
                        >
                            <BookOpen size={16} className="text-emerald-400" /> Studieguide
                        </Link>

                        <button
                            onClick={generateNewRandomQuiz}
                            title="Slumpar fram 20 nya frågor från frågebanken"
                            className="bg-secondary hover:bg-secondary/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:border-primary/50 active:scale-95 shadow-sm"
                        >
                            <Shuffle size={16} className="text-primary" /> Nytt slumpat prov
                        </button>

                        {!isSubmitted ? (
                            <button
                                onClick={() => {
                                    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
                                        if (!window.confirm(`Du har bara svarat på ${Object.keys(selectedAnswers).length} av ${quizQuestions.length} frågor. Vill du lämna in ändå?`)) return;
                                    }
                                    handleSubmitQuiz();
                                }}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
                            >
                                <Check size={16} /> Lämna in provet
                            </button>
                        ) : (
                            <button
                                onClick={restartCurrentQuiz}
                                className="bg-secondary hover:bg-secondary/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
                            >
                                <RotateCcw size={16} /> Gör om samma prov
                            </button>
                        )}
                    </div>
                </div>

                {/* Score & Grading Overview (Visible when submitted) */}
                {isSubmitted && (
                    <div className="space-y-6">
                        <div className={`border rounded-2xl p-6 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
                            isAllPartsPassed 
                                ? 'bg-emerald-950/20 border-emerald-500/40' 
                                : 'bg-red-950/20 border-red-500/40'
                        }`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/40">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                        isAllPartsPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {isAllPartsPassed ? <Award size={32} /> : <AlertTriangle size={32} />}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-2xl font-black">
                                                {isAllPartsPassed ? "GRATTIS! BETYG: GODKÄND (G) 🎉" : "RESULTAT: UNDERKÄND (U) ⚠️"}
                                            </h2>
                                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary font-bold">
                                                {totalCorrect} / {quizQuestions.length} Rätt ({Math.round((totalCorrect / quizQuestions.length) * 100)}%)
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {isAllPartsPassed
                                                ? "Du har uppnått minst 3 rätt på vart och ett av de 5 läranderesultaten!"
                                                : "Du måste ha minst 3 av 4 rätt på ALLA 5 delar för Godkänt betyg. Se analysen av dina svaga områden nedan:"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={generateNewRandomQuiz}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <Shuffle size={16} /> Kör ett nytt slumpat prov
                                    </button>
                                </div>
                            </div>

                            {/* XP REWARD CELEBRATION CARD */}
                            {earnedXpResult && (
                                <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-primary/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
                                            ⚡
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black text-amber-400 tracking-tight">
                                                    +{earnedXpResult.total} XP intjänat!
                                                </span>
                                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                                    Din total: {user?.xp_total ?? 0} XP
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span>+{earnedXpResult.base} XP ({totalCorrect} rätt × 10 XP)</span>
                                                {earnedXpResult.passBonus > 0 && (
                                                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                                                        • +50 XP Godkänt-bonus (G) 🏆
                                                    </span>
                                                )}
                                                {earnedXpResult.perfectBonus > 0 && (
                                                    <span className="text-purple-400 font-bold flex items-center gap-1">
                                                        • +100 XP Perfekt prov 🌟
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold">
                                        <Check size={13} /> Krediterat till din profil
                                    </div>
                                </div>
                            )}

                            {/* SMART ACTION BAR: TARGETED DRILLS */}
                            {currentWrongQuestions.length > 0 && (
                                <div className="mt-5 p-4 rounded-xl bg-card/60 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                                            <Flame size={14} /> Rekommenderad träning för att klara G:
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Du fick {currentWrongQuestions.length} fel. Träna specifikt på dessa frågor eller repetera det svaga området direkt!
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={startDrillOnCurrentErrors}
                                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                                        >
                                            <Target size={14} /> Träna på dina {currentWrongQuestions.length} fel nu
                                        </button>

                                        {failedParts.map(fp => (
                                            <button
                                                key={fp.part}
                                                onClick={() => startDrillOnSpecificPart(fp.part)}
                                                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                                            >
                                                <Flame size={14} /> Öva extra på Del {fp.part} ({fp.correct}/{fp.total})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Part-by-part score cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                                {partStats.map((stat) => (
                                    <div 
                                        key={stat.part}
                                        onClick={() => {
                                            setFilterPart(stat.part);
                                            const firstQ = quizQuestions.findIndex(q => q.part === stat.part);
                                            if (firstQ !== -1) setActiveQuestionIndex(firstQ);
                                        }}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                                            stat.isPassed 
                                                ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60' 
                                                : 'bg-red-500/10 border-red-500/30 hover:border-red-500/60'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                                            <span>Del {stat.part}</span>
                                            {stat.isPassed ? (
                                                <span className="text-emerald-400 flex items-center gap-1"><Check size={12} /> G</span>
                                            ) : (
                                                <span className="text-red-400 flex items-center gap-1"><XCircle size={12} /> U</span>
                                            )}
                                        </div>
                                        <div className="text-lg font-bold">
                                            {stat.correct} / {stat.total} rätt
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-1">
                                            {stat.isPassed ? "Godkänd (minst 3/4)" : "Underkänd (< 3 rätt)"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ============================================================== */}
                        {/* DEEP ERROR BREAKDOWN: WHAT WAS WRONG & WHAT IS ACTUALLY TRUE   */}
                        {/* ============================================================== */}
                        {currentWrongQuestions.length > 0 && (
                            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                                <div 
                                    onClick={() => setErrorAnalysisExpanded(!errorAnalysisExpanded)}
                                    className="p-5 bg-secondary/40 border-b border-border/60 flex items-center justify-between cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                                            <AlertTriangle size={16} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-base text-foreground">
                                                Analys av dina fel: Vad som var fel & Vad som egentligen gäller ({currentWrongQuestions.length} frågor)
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                Läs igenom varför ditt svar blev fel så att du tränar in rätt koncept inför måndag.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                        <span>{errorAnalysisExpanded ? "Fäll ihop" : "Visa alla fel"}</span>
                                        {errorAnalysisExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>

                                {errorAnalysisExpanded && (
                                    <div className="p-5 space-y-4">
                                        {currentWrongQuestions.map((wrong, idx) => (
                                            <div 
                                                key={idx}
                                                className="p-5 rounded-xl bg-[#141822] border border-red-500/20 space-y-4 hover:border-red-500/40 transition-colors"
                                            >
                                                {/* Meta */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-mono font-bold">
                                                            FEL #{idx + 1}
                                                        </span>
                                                        <span className="text-xs font-mono text-primary font-semibold">
                                                            {wrong.partTitle}
                                                        </span>
                                                        {wrong.topic && (
                                                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                                                                Tema: {wrong.topic}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => startDrillOnSpecificPart(wrong.part)}
                                                        className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                                                    >
                                                        Öva mer på Del {wrong.part} →
                                                    </button>
                                                </div>

                                                {/* Question text */}
                                                <div className="text-sm md:text-base font-bold text-foreground leading-relaxed">
                                                    {wrong.question}
                                                </div>

                                                {/* Answer comparison */}
                                                <div className="grid md:grid-cols-2 gap-3 text-xs md:text-sm">
                                                    {/* User Answer (Wrong) */}
                                                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-1">
                                                        <div className="font-mono text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase">
                                                            <XCircle size={14} /> Ditt valda svar (Fel):
                                                        </div>
                                                        <div className="font-medium pt-1">
                                                            <span className="font-mono font-bold mr-1.5">[{wrong.userAnswerKey}]</span>
                                                            {wrong.userAnswerText}
                                                        </div>
                                                    </div>

                                                    {/* Correct Answer */}
                                                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                                                        <div className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                                                            <CheckCircle2 size={14} /> Rätt svar på tentan:
                                                        </div>
                                                        <div className="font-medium pt-1">
                                                            <span className="font-mono font-bold mr-1.5">[{wrong.correctAnswerKey}]</span>
                                                            {wrong.correctAnswerText}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Deep Explanation */}
                                                <div className="p-4 rounded-xl bg-secondary/40 border border-border space-y-1.5">
                                                    <div className="text-xs font-mono font-bold text-primary flex items-center gap-1.5">
                                                        <HelpCircle size={14} />
                                                        VAD SOM GÄLLER EGENTLIGEN & VARFÖR DET BLEV FEL:
                                                    </div>
                                                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                                        {wrong.explanation}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-2 flex justify-end">
                                            <button
                                                onClick={startDrillOnCurrentErrors}
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                                            >
                                                <Target size={14} /> Starta träningspass med enbart dessa {currentWrongQuestions.length} frågor
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Question Navigator Bar */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground mr-2">Frågor:</span>
                        {quizQuestions.map((q, idx) => {
                            const isAnswered = !!selectedAnswers[q.id];
                            const isCurrent = idx === activeQuestionIndex;
                            let statusColor = "bg-secondary/60 text-muted-foreground border-transparent";
                            
                            if (isSubmitted) {
                                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                                statusColor = isCorrect 
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                                    : "bg-red-500/20 text-red-400 border-red-500/40";
                            } else if (isAnswered) {
                                statusColor = "bg-primary/20 text-primary border-primary/40 font-bold";
                            }

                            if (isCurrent) {
                                statusColor += " ring-2 ring-primary ring-offset-2 ring-offset-background";
                            }

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setActiveQuestionIndex(idx)}
                                    className={`w-8 h-8 rounded-lg text-xs font-mono border flex items-center justify-center transition-all hover:scale-105 ${statusColor}`}
                                >
                                    {q.id}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mode toggles */}
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                                type="checkbox"
                                checked={instantFeedback}
                                onChange={e => setInstantFeedback(e.target.checked)}
                                className="rounded bg-secondary border-border text-primary focus:ring-primary"
                            />
                            <span>Direkt facit vid klick</span>
                        </label>
                    </div>
                </div>

                {/* Filter Tabs for Del 1 - 5 */}
                <div className="flex flex-wrap gap-2 border-b border-border pb-3">
                    <button
                        onClick={() => setFilterPart(0)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            filterPart === 0 
                                ? 'bg-primary text-primary-foreground shadow' 
                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Alla Frågor ({quizQuestions.length})
                    </button>
                    {[1, 2, 3, 4, 5].map(p => {
                        const countInPart = quizQuestions.filter(q => q.part === p).length;
                        if (countInPart === 0) return null;
                        return (
                            <button
                                key={p}
                                onClick={() => {
                                    setFilterPart(p);
                                    const firstOfPart = quizQuestions.findIndex(q => q.part === p);
                                    if (firstOfPart !== -1) setActiveQuestionIndex(firstOfPart);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    filterPart === p 
                                        ? 'bg-primary text-primary-foreground shadow' 
                                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Del {p} ({countInPart})
                            </button>
                        );
                    })}
                </div>

                {/* CURRENT ACTIVE QUESTION CARD */}
                {currentQuestion && (
                    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative">
                        {/* Question Meta Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-border">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-mono font-bold text-muted-foreground">
                                    FRÅGA {currentQuestion.id} AV {quizQuestions.length}
                                </span>
                                <span className="text-xs font-mono text-primary font-semibold">
                                    {currentQuestion.partTitle}
                                </span>
                                {currentQuestion.topic && (
                                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground">
                                        Tema: {currentQuestion.topic}
                                    </span>
                                )}
                            </div>

                            {selectedAnswers[currentQuestion.id] && (
                                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                                    <Check size={12} className="text-primary" /> Besvarad
                                </span>
                            )}
                        </div>

                        {/* Question Text */}
                        <h3 className="text-xl md:text-2xl font-bold leading-relaxed">
                            {currentQuestion.question}
                        </h3>

                        {/* Answer Options */}
                        <div className="space-y-3 pt-2">
                            {currentQuestion.options.map(opt => {
                                const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
                                const showResult = isSubmitted || instantFeedback;
                                const isCorrect = opt.key === currentQuestion.correctAnswer;
                                const isSelectedAndWrong = isSelected && !isCorrect;

                                let cardStyle = "bg-secondary/40 border-border hover:bg-secondary/70 hover:border-border/80";

                                if (showResult) {
                                    if (isCorrect) {
                                        cardStyle = "bg-emerald-500/15 border-emerald-500/50 text-foreground ring-1 ring-emerald-500/30";
                                    } else if (isSelectedAndWrong) {
                                        cardStyle = "bg-red-500/15 border-red-500/50 text-foreground ring-1 ring-red-500/30";
                                    } else {
                                        cardStyle = "bg-secondary/20 border-border/40 opacity-60";
                                    }
                                } else if (isSelected) {
                                    cardStyle = "bg-primary/10 border-primary text-foreground ring-2 ring-primary/30";
                                }

                                return (
                                    <div
                                        key={opt.key}
                                        onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                                        className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all select-none ${cardStyle}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                                            showResult && isCorrect 
                                                ? 'bg-emerald-500 text-white' 
                                                : showResult && isSelectedAndWrong
                                                ? 'bg-red-500 text-white'
                                                : isSelected 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-secondary text-muted-foreground'
                                        }`}>
                                            {opt.key}
                                        </div>
                                        <div className="flex-1 text-sm md:text-base pt-1 font-medium leading-normal">
                                            {opt.text}
                                        </div>
                                        {showResult && isCorrect && (
                                            <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-1" />
                                        )}
                                        {showResult && isSelectedAndWrong && (
                                            <XCircle size={20} className="text-red-400 shrink-0 mt-1" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Explanation Box (Visible if submitted or instant feedback enabled) */}
                        {(isSubmitted || (instantFeedback && selectedAnswers[currentQuestion.id])) && (
                            <div className="mt-6 p-5 rounded-xl bg-[#161b22] border border-border/80 space-y-2 animate-in fade-in duration-200">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary">
                                    <HelpCircle size={15} />
                                    FÖRKLARING FRÅN KURSMATERIALET:
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                        )}

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between pt-6 border-t border-border">
                            <button
                                disabled={activeQuestionIndex === 0}
                                onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                                className="px-4 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-2 transition-all"
                            >
                                <ArrowLeft size={14} /> Föregående
                            </button>

                            <div className="text-xs font-mono text-muted-foreground">
                                {activeQuestionIndex + 1} / {quizQuestions.length}
                            </div>

                            <button
                                disabled={activeQuestionIndex === quizQuestions.length - 1}
                                onClick={() => setActiveQuestionIndex(prev => Math.min(quizQuestions.length - 1, prev + 1))}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-2 transition-all"
                            >
                                Nästa <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* ============================================================== */}
            {/* MODAL: PROVHISTORIK & SPARA RESULTAT / FELBANK                 */}
            {/* ============================================================== */}
            {showHistoryModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                            <div>
                                <h3 className="text-xl font-black flex items-center gap-2">
                                    <History className="text-primary" size={22} />
                                    Mina Prov, Områdesstatistik & Felbank
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Här sparas alla dina tidigare prov och svagheter så du kan träna fokuserat.
                                </p>
                            </div>

                            <button 
                                onClick={() => setShowHistoryModal(false)}
                                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* Aggregated Performance by Part */}
                            {analytics && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-foreground uppercase font-mono">
                                            Din Träffsäkerhet per Område (Över alla prov)
                                        </h4>
                                        <span className="text-xs text-muted-foreground">
                                            Totalt {analytics.totalAttempts} prov genomförda ({analytics.passRate}% godkända)
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                                        {analytics.partAggregates.map(p => (
                                            <div 
                                                key={p.part}
                                                className={`p-3.5 rounded-xl border space-y-1.5 ${
                                                    p.isWeak 
                                                        ? 'bg-red-500/10 border-red-500/30' 
                                                        : 'bg-emerald-500/10 border-emerald-500/30'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between text-xs font-mono font-bold">
                                                    <span>Del {p.part}</span>
                                                    <span className={p.isWeak ? 'text-red-400' : 'text-emerald-400'}>
                                                        {p.percent}%
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {p.correct} av {p.total} rätt
                                                </div>
                                                <button
                                                    onClick={() => startDrillOnSpecificPart(p.part)}
                                                    className="w-full mt-2 py-1 bg-secondary hover:bg-secondary/80 text-[10px] font-bold rounded text-foreground transition-colors"
                                                >
                                                    Träna Del {p.part} →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Error Bank Section */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Target className="text-amber-400" size={18} />
                                        <h4 className="font-bold text-sm text-foreground uppercase font-mono">
                                            Din Felbank ({errorBank.length} unika fel sparade)
                                        </h4>
                                    </div>

                                    {errorBank.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={startDrillOnErrorBank}
                                                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                                            >
                                                <Target size={14} /> Träna på alla {errorBank.length} sparade fel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Vill du tömma din felbank?")) {
                                                        quizTracker.clearErrorBank();
                                                        setErrorBank([]);
                                                    }
                                                }}
                                                className="p-1.5 text-muted-foreground hover:text-red-400 rounded transition-colors"
                                                title="Töm felbanken"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {errorBank.length === 0 ? (
                                    <div className="p-6 rounded-xl bg-secondary/20 border border-border text-center text-xs text-muted-foreground">
                                        🎉 Din felbank är helt tom! När du gör fel på ett prov samlas de här så du kan träna på dem.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {errorBank.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                className="p-3 rounded-xl bg-secondary/30 border border-border flex items-center justify-between gap-4 text-xs"
                                            >
                                                <div className="space-y-0.5 truncate">
                                                    <div className="font-bold truncate text-foreground">
                                                        {item.question}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">
                                                        {item.partTitle} {item.topic && `• Tema: ${item.topic}`}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        quizTracker.removeResolvedError(item.bankId);
                                                        setErrorBank(quizTracker.getErrorBank());
                                                    }}
                                                    className="text-[10px] text-muted-foreground hover:text-emerald-400 shrink-0 font-mono"
                                                    title="Markera som klar"
                                                >
                                                    Ta bort ✓
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Recent Attempts History List */}
                            <div className="space-y-3 pt-2">
                                <h4 className="font-bold text-sm text-foreground uppercase font-mono">
                                    Tidigare Provomgångar ({historyAttempts.length})
                                </h4>

                                {historyAttempts.length === 0 ? (
                                    <div className="p-6 rounded-xl bg-secondary/20 border border-border text-center text-xs text-muted-foreground">
                                        Inga genomförda prov sparade än. Gör ett prov för att se din historik!
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {historyAttempts.map((attempt) => (
                                            <div 
                                                key={attempt.id}
                                                className="p-3.5 rounded-xl bg-secondary/30 border border-border flex flex-wrap items-center justify-between gap-3 text-xs"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold">{attempt.quizTitle}</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            attempt.isAllPartsPassed 
                                                                ? 'bg-emerald-500/20 text-emerald-400' 
                                                                : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                            {attempt.isAllPartsPassed ? "GODKÄND (G)" : "UNDERKÄND (U)"}
                                                        </span>
                                                        {attempt.earnedXp ? (
                                                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                                                                <Zap size={10} className="fill-amber-300" /> +{attempt.earnedXp} XP
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">
                                                        {attempt.date} • {attempt.totalCorrect}/{attempt.totalQuestions} rätt ({Math.round((attempt.totalCorrect / attempt.totalQuestions) * 100)}%)
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {attempt.wrongQuestions.length > 0 && (
                                                        <span className="text-[11px] text-red-400 font-mono">
                                                            {attempt.wrongQuestions.length} fel
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-border flex justify-between items-center bg-secondary/20">
                            <button
                                onClick={() => {
                                    if (window.confirm("Vill du rensa all historik och alla sparade fel?")) {
                                        quizTracker.clearAllHistory();
                                        setHistoryAttempts([]);
                                        setErrorBank([]);
                                    }
                                }}
                                className="text-xs text-red-400 hover:underline font-mono"
                            >
                                Rensa all historik
                            </button>

                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="bg-primary text-primary-foreground font-bold px-5 py-2 rounded-xl text-xs"
                            >
                                Stäng
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
