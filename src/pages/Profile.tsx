import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, TrendingUp, AlertOctagon } from 'lucide-react';

const Profile: React.FC = () => {
    const { state } = useGame();

    return (
        <div className="flex flex-col gap-6 animate-fade-in pb-8">
            <div className="text-center mt-4">
                <div className="inline-block p-1 border-4 border-indigo-500 rounded-full mb-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-24 h-24 rounded-full bg-slate-800" />
                </div>
                <h2 className="text-2xl text-white">Student</h2>
                <p className="text-slate-400">Level {state.level} Trapper</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 flex flex-col items-center">
                    <Trophy className="text-amber-400 mb-2" size={24} />
                    <span className="text-2xl font-bold text-white">{state.xp}</span>
                    <span className="text-xs text-slate-400">Total XP</span>
                </div>
                <div className="glass-card p-4 flex flex-col items-center">
                    <TrendingUp className="text-green-400 mb-2" size={24} />
                    <span className="text-2xl font-bold text-white">{state.completedQuestions.length}</span>
                    <span className="text-xs text-slate-400">Solved</span>
                </div>
            </div>

            {/* Badges Section */}
            <div className="mt-2">
                <h3 className="text-white mb-4 px-2">Badges</h3>
                {state.badges.length === 0 ? (
                    <p className="text-slate-500 text-sm px-2">Play more to unlock badges!</p>
                ) : (
                    <div className="flex gap-4 overflow-x-auto px-2 pb-4 scrollbar-hide">
                        {state.badges.map(b => (
                            <div key={b.id} className="glass-card min-w-[120px] p-4 flex flex-col items-center text-center">
                                <div className="text-4xl mb-2">{b.icon}</div>
                                <span className="font-bold text-white text-xs">{b.name}</span>
                                <span className="text-[10px] text-slate-400 mt-1">{b.description}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Analysis Section */}
            <div className="mt-2">
                <h3 className="text-white mb-4 px-2">AI Mistake Analysis</h3>

                {state.mistakes.length === 0 ? (
                    <div className="glass-card p-8 text-center text-slate-400">
                        <p>No mistakes yet! Keep playing to let AI analyze your learning patterns.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {state.mistakes.map((m, idx) => (
                            <div key={idx} className="glass-card p-4 border-l-4 border-red-500">
                                <div className="flex items-center gap-2 mb-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                                    <AlertOctagon size={14} />
                                    {m.trapType} Detected
                                </div>
                                <p className="text-white text-sm font-medium mb-2">"{m.questionText}"</p>
                                <div className="bg-slate-900/50 p-3 rounded-lg text-xs">
                                    <p className="text-red-300 mb-1"><span className="line-through opacity-70">{m.selectedAnswer}</span></p>
                                    <p className="text-green-400 flex items-center gap-1">
                                        ➡ {m.correctAnswer}
                                    </p>
                                </div>
                                <p className="mt-3 text-xs text-slate-400 italic">
                                    AI Insight: You seem to fall for intuitive answers in {m.topic}. Remember to apply first principles before answering.
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Link (Hidden-ish) */}
            <div className="mt-8 text-center">
                <a href="/admin" className="text-xs text-slate-600 hover:text-slate-400">Teacher/Admin Access</a>
            </div>
        </div>
    );
};

export default Profile;
