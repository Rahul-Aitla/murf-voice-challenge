'use client';

import { Button } from '@/components/livekit/button';
import { motion } from 'motion/react';
import { forwardRef } from 'react';


const PlayIcon = () => (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const SwordIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="14.5 17.5 3 6 6 3 17.5 14.5" />
        <line x1="13" y1="19" x2="19" y2="13" />
        <line x1="16" y1="16" x2="20" y2="20" />
        <line x1="19" y1="21" x2="21" y2="19" />
    </svg>
);

const ScrollIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2Z" />
        <path d="M15 2v20" />
        <path d="M15 7h4" />
        <path d="M15 12h4" />
        <path d="M15 17h4" />
    </svg>
);

const DiceIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="1" />
        <circle cx="15" cy="15" r="1" />
    </svg>
);

interface WelcomeViewProps {
    startButtonText: string;
    onStartCall: () => void;
}

export const GameMasterWelcomeView = forwardRef<HTMLDivElement, React.ComponentProps<'div'> & WelcomeViewProps>(({
    startButtonText,
    onStartCall,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            {...props}
            className="min-h-screen text-white font-sans overflow-x-hidden relative"
            style={{
                backgroundImage: 'url(/fantasy-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

            {/* Header */}
            <header className="relative z-50 border-b border-purple-500/20 bg-black/40 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            <span className="text-xl font-bold">GM</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400">
                            Voice Game Master
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden md:block rounded-full bg-purple-900/40 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-200">
                            D&D 5e Style
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-black/40 border border-white/10 px-3 py-1 text-xs text-gray-300">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                            <span className="hidden md:inline">World Ready</span>
                            <span className="md:hidden">Ready</span>
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-12 lg:py-20">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20 items-center">
                    {/* Left Column - Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="inline-flex items-center gap-2 self-start rounded-full bg-purple-600/20 border border-purple-500/30 px-4 py-2 text-sm font-bold text-purple-300 mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            <DiceIcon className="h-5 w-5 text-purple-400" />
                            <span className="tracking-wide uppercase text-xs">Interactive Voice Adventure</span>
                        </div>

                        <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight lg:text-7xl font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            Your Story <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Begins Now</span>
                        </h1>

                        <p className="mb-8 text-lg text-gray-300 font-medium leading-relaxed max-w-lg drop-shadow-md">
                            Step into a new world every time. Speak your actions, roll the dice with your voice, and let the AI Game Master guide your fate.
                        </p>

                        {/* Key Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { Icon: SwordIcon, text: 'Epic Battles' },
                                { Icon: ScrollIcon, text: 'Rich Storytelling' },
                                { Icon: DiceIcon, text: 'Dynamic Choices' },
                            ].map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    className="flex items-center gap-3 rounded-xl bg-black/40 backdrop-blur-md p-3 border border-white/10 hover:border-purple-500/50 transition-colors"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20 text-purple-400">
                                        <benefit.Icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-semibold text-gray-200">{benefit.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative w-full max-w-md mx-auto lg:mx-0"
                    >
                      
                        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-purple-600/30 blur-[100px]"></div>
                        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-cyan-600/20 blur-[100px]"></div>

                        <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-xl p-5 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-900 to-black border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.5),transparent)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                    <svg className="h-12 w-12 text-purple-200 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                                        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                                        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-white font-serif tracking-wide">
                                    The Game Master
                                </h2>
                                <p className="mt-2 text-purple-200/60">
                                    Awaits your command...
                                </p>
                            </div>

                            {/* Primary CTA */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mb-6"
                            >
                                <Button
                                    onClick={onStartCall}
                                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 px-8 py-6 text-lg font-bold text-white shadow-[0_0_20px_rgba(126,34,206,0.5)] transition-all hover:shadow-[0_0_30px_rgba(126,34,206,0.8)] hover:from-purple-600 hover:to-indigo-600 border border-white/20"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3 uppercase tracking-widest">
                                        <PlayIcon />
                                        {startButtonText || 'Start Adventure'}
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                                </Button>
                            </motion.div>

                            {/* Campaign Info */}
                            <div className="rounded-2xl bg-black/40 p-6 border border-white/10">
                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-purple-400">
                                    Campaign Settings
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Setting</span>
                                        <span className="font-semibold text-white">Multiverse</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Location</span>
                                        <span className="font-semibold text-white">Procedural</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Difficulty</span>
                                        <span className="font-semibold text-white">Adaptive</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md py-6 md:py-8">
                <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <div>
                        &copy; 2024 Voice Game Master. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">Rules</a>
                        <a href="#" className="hover:text-white transition-colors">Lore</a>
                        <a href="#" className="hover:text-white transition-colors">Credits</a>
                    </div>
                </div>
            </footer>
        </div>
    );
});

GameMasterWelcomeView.displayName = 'GameMasterWelcomeView';
