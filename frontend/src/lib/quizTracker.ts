export interface WrongQuestionDetail {
    bankId: number;
    part: number;
    partTitle: string;
    topic: string;
    question: string;
    userAnswerKey: string;
    userAnswerText: string;
    correctAnswerKey: string;
    correctAnswerText: string;
    explanation: string;
}

export interface PartScore {
    part: number;
    correct: number;
    total: number;
    isPassed: boolean; // >= 3 of 4 (or >= 75%)
}

export interface QuizAttempt {
    id: string;
    date: string;
    timestamp: number;
    quizTitle: string;
    totalCorrect: number;
    totalQuestions: number;
    earnedXp?: number;
    isAllPartsPassed: boolean;
    partScores: PartScore[];
    wrongQuestions: WrongQuestionDetail[];
}

const STORAGE_KEY = "learntrail_devops_attempts_v1";
const ERROR_BANK_KEY = "learntrail_devops_error_bank_v1";

export const quizTracker = {
    // Get all previous attempts
    getAttempts(): QuizAttempt[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    // Save a new attempt
    saveAttempt(attempt: Omit<QuizAttempt, "id" | "date" | "timestamp">): QuizAttempt {
        const fullAttempt: QuizAttempt = {
            ...attempt,
            id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            date: new Date().toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }),
            timestamp: Date.now()
        };

        const existing = this.getAttempts();
        const updated = [fullAttempt, ...existing].slice(0, 50); // Keep last 50
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error("Failed to save attempt to localStorage", e);
        }

        // Also update persistent error bank
        this.addWrongQuestionsToBank(attempt.wrongQuestions);

        return fullAttempt;
    },

    // Persistent Error Bank (Distinct questions the user got wrong)
    getErrorBank(): WrongQuestionDetail[] {
        try {
            const raw = localStorage.getItem(ERROR_BANK_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    addWrongQuestionsToBank(wrongList: WrongQuestionDetail[]) {
        const current = this.getErrorBank();
        const map = new Map<number, WrongQuestionDetail>();
        // Add existing
        current.forEach(item => map.set(item.bankId, item));
        // Overwrite or add new
        wrongList.forEach(item => map.set(item.bankId, item));

        const updated = Array.from(map.values());
        try {
            localStorage.setItem(ERROR_BANK_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error("Failed to update error bank", e);
        }
    },

    removeResolvedError(bankId: number) {
        const current = this.getErrorBank();
        const filtered = current.filter(item => item.bankId !== bankId);
        try {
            localStorage.setItem(ERROR_BANK_KEY, JSON.stringify(filtered));
        } catch (e) {
            console.error("Failed to remove resolved error", e);
        }
    },

    clearErrorBank() {
        try {
            localStorage.removeItem(ERROR_BANK_KEY);
        } catch (e) {
            console.error("Failed to clear error bank", e);
        }
    },

    clearAllHistory() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(ERROR_BANK_KEY);
        } catch (e) {
            console.error("Failed to clear history", e);
        }
    },

    // Calculate aggregated analytics across all attempts
    getAnalytics() {
        const attempts = this.getAttempts();
        if (attempts.length === 0) {
            return null;
        }

        const totalAttempts = attempts.length;
        const passedAttempts = attempts.filter(a => a.isAllPartsPassed).length;
        const passRate = Math.round((passedAttempts / totalAttempts) * 100);
        const totalEarnedXp = attempts.reduce((acc, a) => acc + (a.earnedXp || 0), 0);

        // Aggregate by part (1 to 5)
        const partAggregates = [1, 2, 3, 4, 5].map(partNum => {
            let correctSum = 0;
            let totalSum = 0;

            attempts.forEach(a => {
                const p = a.partScores.find(score => score.part === partNum);
                if (p) {
                    correctSum += p.correct;
                    totalSum += p.total;
                }
            });

            const percent = totalSum > 0 ? Math.round((correctSum / totalSum) * 100) : 100;
            return {
                part: partNum,
                correct: correctSum,
                total: totalSum,
                percent,
                isWeak: percent < 75 // Below G requirement
            };
        });

        // Identify the weakest part
        const sortedByWeakness = [...partAggregates].sort((a, b) => a.percent - b.percent);
        const weakestPart = sortedByWeakness[0];

        return {
            totalAttempts,
            passedAttempts,
            passRate,
            totalEarnedXp,
            partAggregates,
            weakestPart,
            latestAttempt: attempts[0]
        };
    }
};

