'use client';

import { Button } from '@/components/livekit/button';
import { motion } from 'motion/react';

// Custom SVG Icons
const MicIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const FamPayLogo = () => (
    <svg className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
);

interface WelcomeViewProps {
    startButtonText: string;
    onStartCall: () => void;
}

import { forwardRef } from 'react';

export const WelcomeView = forwardRef<HTMLDivElement, React.ComponentProps<'div'> & WelcomeViewProps>(({
    startButtonText,
    onStartCall,
    ...props
}, ref) => {
    return (
        <div ref={ref} {...props} className="min-h-screen bg-[#FAFAFA] text-black font-sans overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6A316] text-black">
                            <span className="text-xl font-bold">F</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">FamPay</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden md:block rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black">
                            Fraud Alert Demo
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="hidden md:inline">System Online</span>
                            <span className="md:hidden">Online</span>
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
                        <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#F6A316]/10 px-4 py-2 text-sm font-bold text-[#F6A316] mb-6">
                            <span className="text-lg">🛡️</span> Bank-Grade Security
                        </div>

                        <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight lg:text-6xl">
                            Secure your <br />
                            <span className="text-[#F6A316]">Money</span> with Voice.
                        </h1>

                        <p className="mb-8 text-lg text-gray-600 font-medium leading-relaxed max-w-lg">
                            Experience the future of fraud detection. Talk to our AI agent to verify transactions instantly and securely.
                        </p>

                        {/* Voice Waveform Visual */}
                        <div className="mb-10 overflow-hidden rounded-3xl bg-black p-6 md:p-8 shadow-2xl relative w-full max-w-md mx-auto lg:mx-0">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            </div>
                            <div className="flex h-[80px] items-center justify-center gap-3">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 rounded-full bg-[#F6A316]"
                                        animate={{
                                            height: [20, 50, 80, 40, 20],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="mt-6 text-center text-sm font-bold text-white/80 uppercase tracking-widest">
                                AI Listening...
                            </p>
                        </div>

                        {/* Key Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { Icon: ShieldIcon, text: 'Real-time Fraud Check' },
                                { Icon: PhoneIcon, text: 'Voice Verification' },
                                { Icon: CheckIcon, text: 'Instant Resolution' },
                            ].map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-gray-100"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6A316]/10">
                                        <benefit.Icon className="h-5 w-5 text-[#F6A316]" />
                                    </div>
                                    <span className="font-semibold text-gray-800">{benefit.text}</span>
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
                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-[#F6A316]/20 blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-black/5 blur-3xl"></div>

                        <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-200 bg-white p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-black text-4xl shadow-xl">
                                    🤖
                                </div>
                                <h2 className="text-3xl font-bold text-black">
                                    Fraud Alert
                                </h2>
                                <p className="mt-2 text-gray-500">
                                    Simulate a suspicious transaction call
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
                                    className="group relative w-full overflow-hidden rounded-2xl bg-black px-8 py-6 text-lg font-bold text-white shadow-xl transition-all hover:bg-gray-900 hover:shadow-2xl"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <MicIcon />
                                        {startButtonText || 'Start Simulation'}
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                                </Button>
                            </motion.div>

                            {/* Trust Indicators */}
                            <div className="rounded-2xl bg-[#F6A316]/5 p-6 border border-[#F6A316]/10">
                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#F6A316]">
                                    Scenario Details
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Persona</span>
                                        <span className="font-semibold text-black">Bank Fraud Agent</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Task</span>
                                        <span className="font-semibold text-black">Verify Transaction</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Security</span>
                                        <span className="font-semibold text-black">Mock Data Only</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-100 bg-white py-6 md:py-8">
                <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <div>
                        &copy; 2024 FamPay Clone. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-black transition-colors">Privacy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms</a>
                        <a href="#" className="hover:text-black transition-colors">Security</a>
                    </div>
                </div>
            </footer>
        </div>

    );
});

WelcomeView.displayName = 'WelcomeView';
