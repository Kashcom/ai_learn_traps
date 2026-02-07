import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Play, User, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Layout: React.FC = () => {
    const { pathname } = useLocation();
    const { state, getLevelProgress } = useGame();

    const isActive = (path: string) => pathname === path ? 'text-cyan-400' : 'text-slate-400';

    return (
        <div className="flex flex-col min-h-screen max-w-[480px] mx-auto bg-slate-900 shadow-2xl overflow-hidden relative">

            {/* Top Bar - sticky */}
            <header className="sticky top-0 z-10 glass-card mx-2 mt-2 flex items-center justify-between !py-3 !px-4 !border-none !rounded-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
                        {state.level}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">LEVEL {state.level}</span>
                        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                                style={{ width: `${getLevelProgress()}%` }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Zap size={18} fill="currentColor" />
                    <span>{state.xp}</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto glass-card !rounded-none !rounded-t-2xl !p-0 border-b-0">
                <div className="flex justify-around items-center h-16">
                    <Link to="/" className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/')}`}>
                        <Home size={24} />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>

                    <Link to="/game" className="relative -top-6">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 border-4 border-slate-900 hover:scale-105 transition-transform">
                            <Play size={24} fill="white" className="text-white ml-1" />
                        </div>
                    </Link>

                    <Link to="/profile" className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/profile')}`}>
                        <User size={24} />
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
