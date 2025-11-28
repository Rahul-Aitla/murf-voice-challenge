'use client';

import { Button } from '@/components/livekit/button';
import { motion } from 'motion/react';
import { forwardRef, useState } from 'react';

// Zomato Red: #E23744
const ZOMATO_RED = '#E23744';

// Custom SVG Icons
const MicIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
);

const UtensilsIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3" />
    </svg>
);

const BikeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6h5l-3 13" />
        <path d="M9 17h5" />
        <path d="M2 14h4" />
        <path d="M5.5 14l3-9h5" />
    </svg>
);

const ShoppingBagIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

interface WelcomeViewProps {
    startButtonText: string;
    onStartCall: (settings: { voiceId: string; language: string }) => void;
}

export const WelcomeView = forwardRef<HTMLDivElement, React.ComponentProps<'div'> & WelcomeViewProps>(({
    startButtonText,
    onStartCall,
    ...props
}, ref) => {
    const [voiceId, setVoiceId] = useState('en-US-cooper');
    const [language, setLanguage] = useState('en-US');

    const handleStart = () => {
        onStartCall({ voiceId, language });
    };

    return (
        <div ref={ref} {...props} className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center gap-2">
                        {/* Zomato-style Logo */}
                        <div className="flex items-center justify-center">
                            <span className="text-3xl font-extrabold italic tracking-tight text-[#E23744]">zomato</span>
                            <span className="ml-2 text-sm font-medium text-gray-500 uppercase tracking-widest">Voice</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden md:block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Grocery & Food
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs text-green-700 border border-green-100">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="hidden md:inline">Open Now</span>
                            <span className="md:hidden">Open</span>
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-12 lg:py-20">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20 items-center">
                    {/* Left Column - Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="inline-flex items-center gap-2 self-start rounded-lg bg-[#E23744]/10 px-4 py-2 text-sm font-bold text-[#E23744] mb-6">
                            <span className="text-lg">🍽️</span> Order with your voice
                        </div>

                        <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
                            Craving something? <br />
                            Just <span className="text-[#E23744]">Say It.</span>
                        </h1>

                        <p className="mb-8 text-xl text-gray-500 font-light leading-relaxed max-w-lg">
                            From "Ingredients for Pasta" to "Maggi and Chai", our AI assistant is ready to take your order instantly.
                        </p>

                        {/* Food Search Visual */}
                        <div className="mb-10 overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-xl relative w-full max-w-md mx-auto lg:mx-0">
                            <div className="h-2 bg-[#E23744] w-full"></div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                                        🍕
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                                        🥗
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 w-32 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-2 w-20 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-center">
                                    <div className="flex h-8 items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1.5 rounded-full bg-[#E23744]"
                                                animate={{
                                                    height: [10, 25, 10],
                                                    opacity: [0.5, 1, 0.5]
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Listening for order...
                                </p>
                            </div>
                        </div>

                        {/* Key Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { Icon: UtensilsIcon, text: 'Smart Ordering' },
                                { Icon: ShoppingBagIcon, text: 'Grocery & Food' },
                                { Icon: BikeIcon, text: 'Fast Delivery' },
                            ].map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 p-4 text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-[#E23744]">
                                        <benefit.Icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{benefit.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column - Action Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative w-full max-w-md mx-auto lg:mx-0"
                    >
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E23744] text-3xl text-white shadow-lg">
                                    🎙️
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Start Ordering
                                </h2>
                                <p className="mt-2 text-gray-500 text-sm">
                                    Select your preferred voice and language
                                </p>
                            </div>

                            {/* Voice Settings */}
                            <div className="mb-8 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Voice Persona</label>
                                    <select
                                        value={voiceId}
                                        onChange={(e) => setVoiceId(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-[#E23744] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744] transition-all"
                                    >
                                        <option value="en-US-cooper">Cooper (US Male)</option>
                                        <option value="en-US-denise">Denise (US Female)</option>
                                        <option value="hi-IN-aman">Aman (Indian Male)</option>
                                        <option value="en-IN-anusha">Anusha (Indian Female)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Language</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-[#E23744] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744] transition-all"
                                    >
                                        <option value="en-US">English (US)</option>
                                        <option value="hi-IN">Hindi</option>
                                    </select>
                                </div>
                            </div>

                            {/* Primary CTA */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mb-6"
                            >
                                <Button
                                    onClick={handleStart}
                                    className="group relative w-full overflow-hidden rounded-xl bg-[#E23744] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-[#d12330] hover:shadow-xl"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <MicIcon />
                                        {startButtonText || 'Start Ordering'}
                                    </span>
                                </Button>
                            </motion.div>

                            {/* Trust Indicators */}
                            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-center">
                                <p className="text-xs text-gray-500">
                                    Powered by <span className="font-semibold text-gray-700">LiveKit</span> & <span className="font-semibold text-gray-700">Murf AI</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-100 bg-white py-8">
                <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <div>
                        &copy; 2024 Zomato Voice Clone.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-[#E23744] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#E23744] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#E23744] transition-colors">Security</a>
                    </div>
                </div>
            </footer>
        </div>
    );
});

WelcomeView.displayName = 'WelcomeView';
