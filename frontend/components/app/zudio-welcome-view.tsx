'use client';

import { Button } from '@/components/livekit/button';
import { motion } from 'motion/react';
import { forwardRef } from 'react';

// Icons
const MicIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
);

const ShoppingBagIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
);

interface WelcomeViewProps {
    startButtonText: string;
    onStartCall: () => void;
}

export const ZudioWelcomeView = forwardRef<HTMLDivElement, React.ComponentProps<'div'> & WelcomeViewProps>(({
    startButtonText,
    onStartCall,
    ...props
}, ref) => {
    return (
        <div ref={ref} {...props} className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ZUDIO</h1>
                            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                                <a href="#" className="hover:text-gray-600 transition-colors">MEN'S</a>
                                <a href="#" className="hover:text-gray-600 transition-colors">WOMEN'S</a>
                                <a href="#" className="hover:text-gray-600 transition-colors">GOODS</a>
                                <a href="#" className="hover:text-gray-600 transition-colors">LOOKBOOK</a>
                            </nav>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <button className="hidden md:block text-sm font-medium hover:text-gray-600 transition-colors">
                                REWARDS
                            </button>
                            <ShoppingBagIcon className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gradient-to-br from-orange-50 via-white to-gray-50">
                <div className="absolute inset-0 bg-[url('/ecommerce-bg.png')] bg-cover bg-center opacity-10" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 h-full flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold mb-6">
                                <SparklesIcon className="h-4 w-4" />
                                VOICE SHOPPING ENABLED
                            </div>

                            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                                WINTER
                                <br />
                                <span className="text-gray-600">COLLECTION</span>
                            </h2>

                            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg leading-relaxed">
                                Shop the latest trends with your voice. Just speak what you're looking for, and let our AI assistant help you find the perfect style.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={onStartCall}
                                    className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-none text-base font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <MicIcon className="h-5 w-5" />
                                        {startButtonText || 'START VOICE SHOPPING'}
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                                </Button>

                                <button className="border-2 border-black px-8 py-4 rounded-none text-base font-bold hover:bg-black hover:text-white transition-all">
                                    BROWSE CATALOG
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4 mt-12">
                                {[
                                    { label: 'Voice Search', value: 'AI Powered' },
                                    { label: 'Fast Delivery', value: '2-3 Days' },
                                    { label: 'Easy Returns', value: '30 Days' },
                                ].map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        className="border-l-2 border-black pl-3"
                                    >
                                        <div className="text-xs text-gray-600 uppercase tracking-wider">{feature.label}</div>
                                        <div className="text-sm font-bold mt-1">{feature.value}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right - Voice Assistant Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <div className="relative bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-black" />

                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <div className="inline-block bg-black text-white px-3 py-1 text-xs font-bold mb-4">
                                            AI ASSISTANT
                                        </div>
                                        <h3 className="text-3xl font-bold mb-2">Shop Smarter</h3>
                                        <p className="text-gray-600">
                                            Your personal shopping assistant powered by AI
                                        </p>
                                    </div>

                                    {/* Voice Visualizer */}
                                    <div className="bg-gray-100 p-6 mb-6">
                                        <div className="flex items-center justify-center gap-2 h-24">
                                            {[...Array(8)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-2 bg-black rounded-full"
                                                    animate={{
                                                        height: [20, 60, 40, 80, 30, 50, 20],
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
                                        <p className="text-center text-sm font-medium mt-4">
                                            "Show me black hoodies under ₹2000"
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-100 p-4">
                                            <div className="text-2xl font-bold">500+</div>
                                            <div className="text-xs text-gray-600 uppercase">Products</div>
                                        </div>
                                        <div className="bg-gray-100 p-4">
                                            <div className="text-2xl font-bold">24/7</div>
                                            <div className="text-xs text-gray-600 uppercase">Available</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-bold mb-2">FEATURED</h3>
                            <p className="text-gray-600">Trending this season</p>
                        </div>
                        <button className="hidden md:block border-2 border-black px-6 py-3 text-sm font-bold hover:bg-black hover:text-white transition-all">
                            VIEW ALL
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'BLACK OVERSIZED HOODIE',
                                price: '₹1,899',
                                category: 'TRENDING',
                                image: '/products/hoodie-black.png',
                            },
                            {
                                name: 'SLIM FIT JEANS',
                                price: '₹1,499',
                                category: 'BESTSELLER',
                                image: '/products/jeans-black.jpg',
                            },
                            {
                                name: 'PUFFER JACKET',
                                price: '₹2,999',
                                category: 'WINTER',
                                image: '/products/jacket-puffer.jpg',
                            },
                        ].map((product, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative overflow-hidden bg-gray-100 mb-4 aspect-[3/4]">
                                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold z-10">
                                        {product.category}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="w-full bg-white text-black py-3 text-sm font-bold hover:bg-black hover:text-white transition-all">
                                            QUICK VIEW
                                        </button>
                                    </div>
                                    {/* Product Image */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-lg">{product.name}</h4>
                                    <p className="text-gray-600">{product.price}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button className="md:hidden border-2 border-black px-8 py-3 text-sm font-bold hover:bg-black hover:text-white transition-all">
                            VIEW ALL PRODUCTS
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-black text-white">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-5xl font-bold mb-4">HOW IT WORKS</h3>
                        <p className="text-gray-400 text-lg">Shopping made simple with voice</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'SPEAK',
                                description: 'Tell our AI what you\'re looking for - color, size, style, or price range'
                            },
                            {
                                step: '02',
                                title: 'BROWSE',
                                description: 'Get instant product recommendations tailored to your preferences'
                            },
                            {
                                step: '03',
                                title: 'ORDER',
                                description: 'Confirm your selection and complete your purchase with voice commands'
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="border border-white p-8 hover:bg-white hover:text-black transition-all duration-300 group"
                            >
                                <div className="text-6xl font-bold mb-4 text-gray-800 group-hover:text-black">
                                    {item.step}
                                </div>
                                <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                                <p className="text-gray-400 group-hover:text-gray-700">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold text-lg mb-4">ZUDIO</h4>
                            <p className="text-sm text-gray-600">
                                Fashion for everyone. Quality you can trust.
                            </p>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-4 uppercase">Shop</h5>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-black">Men's</a></li>
                                <li><a href="#" className="hover:text-black">Women's</a></li>
                                <li><a href="#" className="hover:text-black">Accessories</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-4 uppercase">Support</h5>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-black">Contact</a></li>
                                <li><a href="#" className="hover:text-black">Returns</a></li>
                                <li><a href="#" className="hover:text-black">Shipping</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-4 uppercase">Legal</h5>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-black">Privacy</a></li>
                                <li><a href="#" className="hover:text-black">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
                        © 2024 ZUDIO. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
});

ZudioWelcomeView.displayName = 'ZudioWelcomeView';
