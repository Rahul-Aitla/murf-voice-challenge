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

const ZapIcon = () => (
    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

interface WelcomeViewProps {
    startButtonText: string;
    onStartCall: () => void;
}

export const WelcomeView = ({
    startButtonText,
    onStartCall,
    ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
    return (
        <div ref={ref} className="min-h-screen bg-[#F5F2F9]">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5B2E90]">
                            <ZapIcon />
                        </div>
                        <span className="text-xl font-bold text-[#5B2E90]">Zepto</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#5B2E90]/10 px-3 py-1 text-xs font-semibold text-[#5B2E90]">
                            SDR Demo
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                            <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                            Recording Off
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Column - Hero */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center"
                    >
                        <h1 className="mb-4 text-4xl font-bold leading-tight lg:text-5xl text-[#2D2D2D]">
                            Talk to <span className="text-[#5B2E90]">Zepto's SDR</span>
                        </h1>

                        <p className="mb-8 text-lg text-gray-600">
                            Get instant answers about delivery, partnerships, and onboarding
                        </p>

                        {/* Voice Waveform Visual */}
                        <div className="mb-8 overflow-hidden rounded-2xl bg-[#5B2E90] p-8">
                            <div className="flex h-[60px] items-center justify-center gap-2">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 rounded-full bg-white"
                                        animate={{
                                            height: [20, 40, 60, 40, 20],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="mt-4 text-center text-sm font-medium text-white">
                                Voice-powered conversation
                            </p>
                        </div>

                        {/* Key Benefits */}
                        <div className="space-y-4">
                            {[
                                { Icon: CheckIcon, text: 'Instant answers from Zepto FAQ' },
                                { Icon: PhoneIcon, text: 'Natural voice conversation' },
                                { Icon: ShieldIcon, text: 'Save lead summary as JSON' },
                            ].map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B2E90]/10">
                                        <benefit.Icon className="h-5 w-5 text-[#5B2E90]" />
                                    </div>
                                    <span className="text-gray-700">{benefit.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column - Action Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
                            <h2 className="mb-6 text-2xl font-bold text-[#2D2D2D]">
                                Ready to start?
                            </h2>

                            {/* Primary CTA */}
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="mb-4"
                            >
                                <Button
                                    onClick={onStartCall}
                                    className="group relative w-full overflow-hidden rounded-xl bg-[#FF3269] px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#E02558]"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <MicIcon />
                                        {startButtonText || 'Start voice demo'}
                                    </span>
                                </Button>
                            </motion.div>

                            <p className="mb-6 text-center text-sm text-gray-500">
                                Click to join a quick simulated call
                            </p>

                            {/* Trust Indicators */}
                            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    How it works
                                </p>
                                <div className="space-y-2">
                                    {[
                                        'Used in demo environment',
                                        'Public FAQ sourced',
                                        'No personal data stored without consent',
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-3 gap-4">
                            {[
                                { label: '10 min', sublabel: 'Delivery' },
                                { label: '6K+', sublabel: 'Products' },
                                { label: 'FREE', sublabel: '₹99+' },
                            ].map((stat, idx) => (
                                <div key={idx} className="rounded-xl bg-white border border-gray-100 p-4 text-center shadow-sm">
                                    <div className="text-lg font-bold text-[#5B2E90]">{stat.label}</div>
                                    <div className="text-xs text-gray-500">{stat.sublabel}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-6">
                <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
                    Powered by Murf AI Voice Technology • Built for{' '}
                    <span className="font-semibold text-[#5B2E90]">Murf AI Voice Challenge</span>
                </div>
            </footer>
        </div>
    );
};
