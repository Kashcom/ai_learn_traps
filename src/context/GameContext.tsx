import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Question } from '../data/questions';

// Types
export interface Mistake {
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    topic: string;
    trapType: string;
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    dateUnlocked: string;
}

interface GameState {
    xp: number;
    level: number;
    streak: number;
    mistakes: Mistake[];
    completedQuestions: string[];
    badges: Badge[];
    customQuestions: Question[];
}

interface GameContextType {
    state: GameState;
    addXp: (amount: number) => void;
    recordMistake: (mistake: Mistake) => void;
    recordSuccess: (questionId: string) => void;
    getLevelProgress: () => number;
    addCustomQuestion: (question: Question) => void;
    getAllQuestions: (defaultQuestions: Question[]) => Question[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GameState>(() => {
        const saved = localStorage.getItem('ai_traps_state');
        return saved ? JSON.parse(saved) : {
            xp: 0,
            level: 1,
            streak: 0,
            mistakes: [],
            completedQuestions: [],
            badges: [],
            customQuestions: []
        };
    });

    useEffect(() => {
        localStorage.setItem('ai_traps_state', JSON.stringify(state));
    }, [state]);

    const checkBadges = (newState: GameState) => {
        const currentBadgeIds = new Set(newState.badges.map(b => b.id));
        const newBadges: Badge[] = [];

        // Streak Badges
        if (newState.streak >= 3 && !currentBadgeIds.has('streak_3')) {
            newBadges.push({ id: 'streak_3', name: 'Sharp Eye', icon: '🎯', description: 'Achieved a 3-question streak', dateUnlocked: new Date().toISOString() });
        }

        // XP Badges
        if (newState.level >= 5 && !currentBadgeIds.has('level_5')) {
            newBadges.push({ id: 'level_5', name: 'Scholar', icon: '🎓', description: 'Reached Level 5', dateUnlocked: new Date().toISOString() });
        }

        // Mistake Badges (Learning)
        if (newState.mistakes.length >= 5 && !currentBadgeIds.has('learner')) {
            newBadges.push({ id: 'learner', name: 'Humble Student', icon: '📝', description: 'Analyzed 5 mistakes', dateUnlocked: new Date().toISOString() });
        }

        if (newBadges.length > 0) {
            // Could trigger a toast notification here
            setState(prev => ({ ...prev, badges: [...prev.badges, ...newBadges] }));
        }
    };

    const addXp = (amount: number) => {
        setState(prev => {
            const newXp = prev.xp + amount;
            const nextLevelXp = prev.level * 1000;
            let newLevel = prev.level;
            if (newXp >= nextLevelXp) {
                newLevel += 1;
            }
            const newState = { ...prev, xp: newXp, level: newLevel };
            checkBadges(newState);
            return newState;
        });
    };

    const recordMistake = (mistake: Mistake) => {
        setState(prev => {
            const newState = {
                ...prev,
                mistakes: [...prev.mistakes, mistake],
                streak: 0
            };
            checkBadges(newState);
            return newState;
        });
    };

    const recordSuccess = (questionId: string) => {
        setState(prev => {
            const newState = {
                ...prev,
                completedQuestions: [...prev.completedQuestions, questionId],
                streak: prev.streak + 1
            };
            checkBadges(newState);
            return newState;
        });
    };

    const getLevelProgress = () => {
        const currentLevelBase = (state.level - 1) * 1000;
        const nextLevelBase = state.level * 1000;
        const progress = state.xp - currentLevelBase;
        const totalNeeded = nextLevelBase - currentLevelBase;
        return Math.min(100, Math.max(0, (progress / totalNeeded) * 100));
    };

    const addCustomQuestion = (question: Question) => {
        setState(prev => ({
            ...prev,
            customQuestions: [...prev.customQuestions, question]
        }));
    };

    const getAllQuestions = (defaultQuestions: Question[]) => {
        return [...defaultQuestions, ...state.customQuestions];
    };

    return (
        <GameContext.Provider value={{
            state,
            addXp,
            recordMistake,
            recordSuccess,
            getLevelProgress,
            addCustomQuestion,
            getAllQuestions
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within GameProvider");
    return context;
};
