import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { Question } from '../data/questions';

const Admin: React.FC = () => {
    const { addCustomQuestion, state } = useGame();

    // Form State
    const [topic, setTopic] = useState('cs');
    const [text, setText] = useState('');
    const [explanation, setExplanation] = useState('');
    const [options, setOptions] = useState([
        { id: 'opt1', text: '', isCorrect: true, isTrap: false, feedback: '' },
        { id: 'opt2', text: '', isCorrect: false, isTrap: true, feedback: '' },
        { id: 'opt3', text: '', isCorrect: false, isTrap: false, feedback: '' },
    ]);

    const handleOptionChange = (idx: number, field: string, value: string | boolean) => {
        const newOptions = [...options];
        (newOptions[idx] as any)[field] = value;
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newQuestion: Question = {
            id: `custom_${Date.now()}`,
            text,
            topic,
            explanation,
            options: options.map(o => ({
                ...o,
                id: `opt_${Date.now()}_${Math.random()}`
            }))
        };

        addCustomQuestion(newQuestion);

        // Reset form
        setText('');
        setExplanation('');
        setOptions([
            { id: 'opt1', text: '', isCorrect: true, isTrap: false, feedback: '' },
            { id: 'opt2', text: '', isCorrect: false, isTrap: true, feedback: '' },
            { id: 'opt3', text: '', isCorrect: false, isTrap: false, feedback: '' },
        ]);
        alert("Question Added!");
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in pb-20">
            <div className="mx-4 mb-2">
                <h1 className="text-white">Admin Panel</h1>
                <p className="text-slate-400">Add new concepts and traps manually.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-2">
                <div className="glass-card p-4">
                    <label className="block text-slate-400 text-sm mb-1">Subject</label>
                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-indigo-500"
                    >
                        <option value="cs">Computer Science</option>
                        <option value="math">Mathematics</option>
                        <option value="science">Physics & Science</option>
                        <option value="history">History</option>
                    </select>
                </div>

                <div className="glass-card p-4">
                    <label className="block text-slate-400 text-sm mb-1">Question Text</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-indigo-500 h-24"
                        placeholder="e.g. What is the result of..."
                        required
                    />
                </div>

                <div className="glass-card p-4 flex flex-col gap-4">
                    <h3 className="text-white text-sm uppercase font-bold tracking-wider">Answer Options</h3>

                    {options.map((opt, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-500 font-bold">OPTION {idx + 1}</span>
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                                        <input
                                            type="radio"
                                            name="correct"
                                            checked={opt.isCorrect}
                                            onChange={() => {
                                                const newOpts = options.map((o, i) => ({ ...o, isCorrect: i === idx }));
                                                setOptions(newOpts);
                                            }}
                                        />
                                        <span className={opt.isCorrect ? "text-green-400" : "text-slate-500"}>Correct</span>
                                    </label>

                                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={opt.isTrap}
                                            onChange={(e) => handleOptionChange(idx, 'isTrap', e.target.checked)}
                                            disabled={opt.isCorrect}
                                        />
                                        <span className={opt.isTrap ? "text-amber-400" : "text-slate-500"}>Is Trap?</span>
                                    </label>
                                </div>
                            </div>

                            <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                                className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700 text-sm mb-2"
                                placeholder="Option text..."
                                required
                            />

                            {(opt.isTrap) && (
                                <input
                                    type="text"
                                    value={opt.feedback}
                                    onChange={(e) => handleOptionChange(idx, 'feedback', e.target.value)}
                                    className="w-full bg-amber-900/20 text-amber-200 p-2 rounded border border-amber-900/50 text-xs placeholder-amber-700"
                                    placeholder="Trap feedback explanation..."
                                    required
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="glass-card p-4">
                    <label className="block text-slate-400 text-sm mb-1">General Explanation</label>
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-indigo-500 h-20"
                        placeholder="Why is the correct answer correct?"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                    <Save size={18} /> Save Question
                </button>
            </form>

            {/* List Analysis of Custom Questions */}
            {state.customQuestions.length > 0 && (
                <div className="mx-4 mt-6">
                    <h3 className="text-white mb-2">Custom Questions Added ({state.customQuestions.length})</h3>
                    <div className="flex flex-col gap-2">
                        {state.customQuestions.map(q => (
                            <div key={q.id} className="glass-card p-3 text-sm text-slate-300">
                                {q.text} <span className="text-xs text-slate-500">({q.topic})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Admin;
