import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Atom, Globe } from 'lucide-react';

const subjects = [
    { id: 'cs', name: 'Computer Science', icon: <Code size={24} />, color: 'var(--primary)' },
    { id: 'science', name: 'Physics & Science', icon: <Atom size={24} />, color: 'var(--accent-cyan)' },
    { id: 'math', name: 'Mathematics', icon: <BookOpen size={24} />, color: 'var(--accent-purple)' },
    { id: 'history', name: 'History', icon: <Globe size={24} />, color: 'var(--accent-amber)' },
];

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleSelect = (id: string) => {
        // Navigate to game with subject param (simulated via state or context, but here just directly)
        // In a real app, we'd persist the selection
        navigate('/game', { state: { subject: id } });
    };

    return (
        <div className="flex flex-col gap-4 animate-fade-in">
            <div className="mb-4">
                <h1 className="text-white">Choose Subject</h1>
                <p className="text-slate-400">Select a domain to challenge your misconceptions.</p>
            </div>

            <div className="grid-cols-2 grid gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {subjects.map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => handleSelect(sub.id)}
                        className="glass-card flex flex-col items-center justify-center p-4 gap-4 hover:scale-105 transition-all text-center"
                        style={{ minHeight: '140px' }}
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                            style={{ background: `${sub.color}20`, color: sub.color }}
                        >
                            {sub.icon}
                        </div>
                        <span className="font-bold text-white text-sm">{sub.name}</span>
                    </button>
                ))}
            </div>

            <div className="mt-6">
                <h3 className="text-white mb-2">Daily Challenge</h3>
                <div className="glass-card p-4 flex items-center justify-between">
                    <div>
                        <span className="font-bold text-white block">Trap Master</span>
                        <span className="text-xs text-slate-400">Identify 5 hidden traps today</span>
                    </div>
                    <button className="btn btn-primary text-xs !py-2 !px-3">Start</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
