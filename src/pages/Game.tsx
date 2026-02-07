import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Brain } from 'lucide-react';
import { useGame, type Mistake } from '../context/GameContext';
import { questions } from '../data/questions';

const Game: React.FC = () => {
    const { state: navState } = useLocation();
    const navigate = useNavigate();
    const { addXp, recordMistake, recordSuccess, getAllQuestions } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Filter questions by subject (mock filter)
    const currentSubject = navState?.subject || 'cs';
    const allQuestions = getAllQuestions(questions);
    const gameQuestions = allQuestions.filter(q => q.topic === currentSubject || q.topic === 'science'); // simple mock include

    const currentQuestion = gameQuestions[currentIndex];

    const handleSelect = (optId: string) => {
        if (isAnswered) return;
        setSelectedId(optId);
        setIsAnswered(true);

        const option = currentQuestion.options.find(o => o.id === optId);
        if (!option) return;

        if (option.isCorrect) {
            addXp(50);
            recordSuccess(currentQuestion.id);
        } else {
            const mistake: Mistake = {
                questionId: currentQuestion.id,
                questionText: currentQuestion.text,
                selectedAnswer: option.text,
                correctAnswer: currentQuestion.options.find(o => o.isCorrect)?.text || '',
                topic: currentQuestion.topic,
                trapType: option.isTrap ? 'Trap' : 'Error'
            };
            recordMistake(mistake);
        }
    };

    const handleNext = () => {
        if (currentIndex < gameQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedId(null);
        } else {
            // End of level
            navigate('/profile');
        }
    };

    if (!currentQuestion) return <div className="p-4 text-center">No questions found for this topic.</div>;

    const selectedOption = currentQuestion.options.find(o => o.id === selectedId);
    const isCorrect = selectedOption?.isCorrect;
    const isTrap = selectedOption?.isTrap;

    return (
        <div className="flex flex-col h-full animate-fade-in pb-20">
            {/* Progress */}
            <div className="flex justify-between text-xs text-slate-400 mb-2 px-2">
                <span>Question {currentIndex + 1} / {gameQuestions.length}</span>
                <span>{currentSubject.toUpperCase()}</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full mb-6 mx-2">
                <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex) / gameQuestions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <div className="glass-card mb-6 mx-2">
                <h2 className="text-xl font-bold text-white mb-4">{currentQuestion.text}</h2>

                <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((opt) => {
                        let itemClass = "w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700";

                        if (isAnswered) {
                            if (opt.id === selectedId) {
                                if (opt.isCorrect) itemClass = "!bg-green-500/20 !border-green-500 text-white";
                                else if (opt.isTrap) itemClass = "!bg-yellow-500/20 !border-yellow-500 text-white";
                                else itemClass = "!bg-red-500/20 !border-red-500 text-white";
                            } else if (opt.isCorrect) {
                                itemClass = "!bg-green-500/20 !border-green-500 text-white opacity-60";
                            } else {
                                itemClass = "opacity-40 border-transparent";
                            }
                        }

                        return (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.id)}
                                disabled={isAnswered}
                                className={itemClass}
                            >
                                {opt.text}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Feedback Area */}
            {isAnswered && (
                <div className={`mt-auto mx-2 p-4 rounded-xl animate-fade-in ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-slate-800 border border-slate-700'}`}>
                    <div className="flex items-start gap-3">
                        {isCorrect ? (
                            <div className="p-2 bg-green-500 rounded-full"><Brain size={20} className="text-white" /></div>
                        ) : (
                            <div className="p-2 bg-amber-500 rounded-full"><AlertTriangle size={20} className="text-white" /></div>
                        )}
                        <div>
                            <h4 className={`font-bold ${isCorrect ? 'text-green-400' : 'text-amber-400'}`}>
                                {isCorrect ? "Excellent!" : isTrap ? "It's a TRAP!" : "Incorrect"}
                            </h4>
                            <p className="text-sm text-slate-300 mt-1">
                                {selectedOption?.feedback || currentQuestion.explanation}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleNext}
                        className="w-full mt-4 btn btn-primary flex justify-center items-center gap-2"
                    >
                        {currentIndex < gameQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game;
