'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { AppConfig } from '@/app-config';
import { ChatTranscript } from '@/components/app/chat-transcript';
import {
    AgentControlBar,
    type ControlBarControls,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useConnectionTimeout } from '@/hooks/useConnectionTimout';
import { useDebugMode } from '@/hooks/useDebug';
import { ScrollArea } from '../livekit/scroll-area/scroll-area';

const MotionBottom = motion.create('div');

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const BOTTOM_VIEW_MOTION_PROPS = {
    variants: {
        visible: {
            opacity: 1,
            translateY: '0%',
        },
        hidden: {
            opacity: 0,
            translateY: '100%',
        },
    },
    initial: 'hidden' as const,
    animate: 'visible' as const,
    exit: 'hidden' as const,
    transition: {
        duration: 0.3,
        delay: 0.5,
        ease: "linear" as const,
    },
};

interface ZudioShoppingViewProps {
    appConfig: AppConfig;
    onAnimationComplete?: () => void;
}

export const ZudioShoppingView = ({
    appConfig,
    onAnimationComplete,
    ...props
}: React.ComponentProps<'section'> & ZudioShoppingViewProps) => {
    useConnectionTimeout(200_000);
    useDebugMode({ enabled: IN_DEVELOPMENT });

    const messages = useChatMessages();
    const [chatOpen, setChatOpen] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [displayedProducts, setDisplayedProducts] = useState<Array<{
        id: string;
        name: string;
        price: string;
        image: string;
        category: string;
        mentionedAt: number;
        priority: number; // 2 = exact match, 1 = category match
    }>>([]);

    // Shopping cart state
    const [cartItems, setCartItems] = useState<Array<{
        product_id: string;
        product_name: string;
        price: number;
        quantity: number;
        image: string;
    }>>([]);
    const [cartTotal, setCartTotal] = useState(0);


    // Product catalog mapping - Complete catalog with all 36 products
    const productCatalog: Record<string, { name: string; price: string; image: string; category: string }> = {
        // T-Shirts (6 items)
        'tshirt-001': { name: 'Classic Black T-Shirt', price: '₹499', image: '/products/tshirt-black.jpg', category: 'T-Shirt' },
        'tshirt-002': { name: 'White Cotton T-Shirt', price: '₹449', image: '/products/tshirt-white.png', category: 'T-Shirt' },
        'tshirt-003': { name: 'Navy Blue T-Shirt', price: '₹549', image: '/products/tshirt-navy.jpg', category: 'T-Shirt' },
        'tshirt-004': { name: 'Olive Green T-Shirt', price: '₹499', image: '/products/tshirt-olive.jpg', category: 'T-Shirt' },
        'tshirt-005': { name: 'Striped T-Shirt', price: '₹599', image: '/products/tshirt-striped.jpg', category: 'T-Shirt' },
        'tshirt-006': { name: 'Graphic Print T-Shirt', price: '₹649', image: '/products/tshirt-graphic.jpg', category: 'T-Shirt' },

        // Hoodies (5 items)
        'hoodie-001': { name: 'Black Oversized Hoodie', price: '₹1,899', image: '/products/hoodie-black.png', category: 'Hoodie' },
        'hoodie-002': { name: 'Grey Pullover Hoodie', price: '₹1,799', image: '/products/hoodie-grey.jpg', category: 'Hoodie' },
        'hoodie-003': { name: 'Maroon Zip Hoodie', price: '₹2,199', image: '/products/hoodie-maroon.jpg', category: 'Hoodie' },
        'hoodie-004': { name: 'Navy Blue Hoodie', price: '₹1,849', image: '/products/hoodie-navy.jpg', category: 'Hoodie' },
        'hoodie-005': { name: 'Beige Hoodie', price: '₹1,899', image: '/products/hoodie-beige.jpg', category: 'Hoodie' },

        // Jeans (5 items)
        'jeans-001': { name: 'Black Slim Fit Jeans', price: '₹1,499', image: '/products/jeans-black.jpg', category: 'Jeans' },
        'jeans-002': { name: 'Blue Denim Jeans', price: '₹1,299', image: '/products/jeans-blue.jpg', category: 'Jeans' },
        'jeans-003': { name: 'Dark Grey Jeans', price: '₹1,599', image: '/products/jeans-grey.jpg', category: 'Jeans' },
        'jeans-004': { name: 'Light Blue Jeans', price: '₹1,399', image: '/products/jeans-lightblue.jpg', category: 'Jeans' },
        'jeans-005': { name: 'Black Ripped Jeans', price: '₹1,699', image: '/products/jeans-ripped.jpg', category: 'Jeans' },

        // Shoes (8 items)
        'shoes-001': { name: 'White Sneakers', price: '₹1,299', image: '/products/shoes-white-sneakers.jpg', category: 'Shoes' },
        'shoes-002': { name: 'Black Running Shoes', price: '₹1,599', image: '/products/shoes-black-running.jpg', category: 'Shoes' },
        'shoes-003': { name: 'Brown Casual Shoes', price: '₹1,799', image: '/products/shoes-brown-casual.jpg', category: 'Shoes' },
        'shoes-004': { name: 'Navy Blue Canvas Shoes', price: '₹999', image: '/products/shoes-navy-canvas.jpg', category: 'Shoes' },
        'shoes-005': { name: 'Grey Sports Shoes', price: '₹1,899', image: '/products/shoes-grey-sports.jpg', category: 'Shoes' },
        'shoes-006': { name: 'Black Formal Shoes', price: '₹2,199', image: '/products/shoes-black-formal.jpg', category: 'Shoes' },
        'shoes-007': { name: 'Tan Loafers', price: '₹1,699', image: '/products/shoes-tan-loafers.jpg', category: 'Shoes' },
        'shoes-008': { name: 'Red Sneakers', price: '₹1,499', image: '/products/shoes-red-sneakers.jpg', category: 'Shoes' },

        // Accessories (6 items)
        'acc-001': { name: 'Black Leather Belt', price: '₹599', image: '/products/acc-belt-black.jpg', category: 'Accessories' },
        'acc-002': { name: 'Brown Leather Wallet', price: '₹799', image: '/products/acc-wallet-brown.jpg', category: 'Accessories' },
        'acc-003': { name: 'Black Cap', price: '₹399', image: '/products/acc-cap-black.jpg', category: 'Accessories' },
        'acc-004': { name: 'Grey Backpack', price: '₹1,499', image: '/products/acc-backpack-grey.jpg', category: 'Accessories' },
        'acc-005': { name: 'Aviator Sunglasses', price: '₹899', image: '/products/acc-sunglasses.jpg', category: 'Accessories' },
        'acc-006': { name: 'White Socks Pack', price: '₹299', image: '/products/acc-socks-white.jpg', category: 'Accessories' },

        // Winter Collection (6 items)
        'jacket-001': { name: 'Puffer Jacket Black', price: '₹2,999', image: '/products/jacket-puffer.jpg', category: 'Winter' },
        'jacket-002': { name: 'Denim Jacket Blue', price: '₹2,499', image: '/products/jacket-denim.jpg', category: 'Winter' },
        'jacket-003': { name: 'Bomber Jacket Olive', price: '₹2,799', image: '/products/jacket-bomber-olive.jpg', category: 'Winter' },
        'sweater-001': { name: 'Wool Sweater Grey', price: '₹1,899', image: '/products/sweater-grey.jpg', category: 'Winter' },
        'sweater-002': { name: 'Cardigan Beige', price: '₹1,699', image: '/products/cardigan-beige.jpg', category: 'Winter' },
        'sweater-003': { name: 'Turtleneck Sweater Black', price: '₹1,999', image: '/products/sweater-turtleneck-black.jpg', category: 'Winter' },
    };

    const controls: ControlBarControls = {
        leave: true,
        microphone: true,
        chat: true,
        camera: false,
        screenShare: false,
    };

    // Parse messages and update displayed products with smart ordering
    useEffect(() => {
        const newProducts = new Map<string, typeof displayedProducts[0]>();

        // Keep existing products
        displayedProducts.forEach(p => newProducts.set(p.id, p));

        // Parse agent messages for product mentions
        messages.forEach((msg, msgIndex) => {
            if (msg.from && !msg.from.isLocal) {
                const content = msg.message.toLowerCase();
                const messageTime = Date.now() - (messages.length - msgIndex) * 1000;

                Object.keys(productCatalog).forEach(productId => {
                    const product = productCatalog[productId];
                    const isExactMatch = content.includes(productId) || content.includes(product.name.toLowerCase());
                    const isCategoryMatch =
                        (content.includes('hoodie') && productId.startsWith('hoodie')) ||
                        (content.includes('t-shirt') && productId.startsWith('tshirt')) ||
                        (content.includes('jeans') && productId.startsWith('jeans')) ||
                        (content.includes('jacket') && productId.startsWith('jacket')) ||
                        (content.includes('sweater') && productId.startsWith('sweater')) ||
                        (content.includes('cardigan') && productId.startsWith('sweater')) ||
                        (content.includes('shoes') && productId.startsWith('shoes')) ||
                        (content.includes('sneakers') && productId.startsWith('shoes')) ||
                        (content.includes('accessories') && productId.startsWith('acc')) ||
                        (content.includes('belt') && productId.startsWith('acc')) ||
                        (content.includes('wallet') && productId.startsWith('acc')) ||
                        (content.includes('cap') && productId.startsWith('acc')) ||
                        (content.includes('backpack') && productId.startsWith('acc')) ||
                        (content.includes('sunglasses') && productId.startsWith('acc')) ||
                        (content.includes('socks') && productId.startsWith('acc'));

                    if (isExactMatch || isCategoryMatch) {
                        const existing = newProducts.get(productId);
                        newProducts.set(productId, {
                            id: productId,
                            ...product,
                            mentionedAt: isExactMatch ? Date.now() : (existing?.mentionedAt || messageTime),
                            priority: isExactMatch ? 2 : (existing?.priority || 1)
                        });
                    }
                });
            }
        });

        // Sort: First by priority (exact matches first), then by recency
        const productsArray = Array.from(newProducts.values()).sort((a, b) => {
            if (a.priority !== b.priority) return b.priority - a.priority;
            return b.mentionedAt - a.mentionedAt;
        });

        const hasChanged = productsArray.length !== displayedProducts.length ||
            JSON.stringify(productsArray.map(p => p.id)) !== JSON.stringify(displayedProducts.map(p => p.id));

        if (hasChanged) {
            setDisplayedProducts(productsArray);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, productCatalog]);


    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            // Use requestAnimationFrame for smoother scrolling
            requestAnimationFrame(() => {
                if (scrollAreaRef.current) {
                    scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
                }
            });
        }
    }, [messages]);

    // Parse cart updates from agent messages
    useEffect(() => {
        messages.forEach((msg) => {
            if (msg.from && !msg.from.isLocal) {
                const content = msg.message;

                // Look for cart-related messages
                if (content.includes('Added to cart') || content.includes('Cart (') || content.includes('🛒')) {
                    // Try to extract cart info from message
                    const itemCountMatch = content.match(/\((\d+)\s+items?,\s*₹([\d,]+)/);
                    if (itemCountMatch) {
                        const total = parseInt(itemCountMatch[2].replace(/,/g, ''));
                        setCartTotal(total);
                    }

                    // Parse individual items if present
                    const itemMatches = content.matchAll(/•\s*(.+?)\s+x(\d+)\s*=\s*₹([\d,]+)/g);
                    const parsedItems: typeof cartItems = [];

                    for (const match of itemMatches) {
                        const productName = match[1].trim();
                        const quantity = parseInt(match[2]);
                        const itemTotal = parseInt(match[3].replace(/,/g, ''));
                        const price = itemTotal / quantity;

                        // Find product ID from catalog
                        const productEntry = Object.entries(productCatalog).find(
                            ([_, product]) => product.name === productName
                        );

                        if (productEntry) {
                            const [productId, product] = productEntry;
                            parsedItems.push({
                                product_id: productId,
                                product_name: productName,
                                price: price,
                                quantity: quantity,
                                image: product.image
                            });
                        }
                    }

                    if (parsedItems.length > 0) {
                        setCartItems(parsedItems);
                    }
                }

                // Handle cart cleared/checkout
                if (content.includes('Order Placed') || content.includes('Cart is empty')) {
                    setCartItems([]);
                    setCartTotal(0);
                }
            }
        });
    }, [messages, productCatalog]);

    return (
        <section
            className="relative z-10 h-full w-full overflow-hidden bg-white text-black font-sans"
            {...props}
        >
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">ZUDIO</h1>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:inline-block text-sm font-medium text-gray-600">
                                Voice Shopping Active
                            </span>
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area - Split Layout */}
            <div className="relative h-full flex pt-20">

                {/* Left: Shopping Assistant Panel */}
                <div className="flex-1 overflow-hidden relative bg-gradient-to-br from-gray-50 to-white">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                    <div className="relative z-10 h-full flex flex-col p-4 md:p-6">
                        {/* Conversation Area */}
                        <div className="flex-1 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 mb-4 flex flex-col">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-200">
                                <div className="h-10 w-10 bg-black flex items-center justify-center flex-shrink-0">
                                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Voice Shopping</h2>
                                    <p className="text-xs text-gray-600">Speak to browse & order</p>
                                </div>
                            </div>

                            <ScrollArea ref={scrollAreaRef} className="flex-1 pr-2">
                                <ChatTranscript
                                    hidden={!chatOpen}
                                    messages={messages}
                                    className="space-y-3"
                                />

                                {messages.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="inline-block bg-gray-100 p-4 mb-3">
                                            <svg className="h-12 w-12 text-gray-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                                <line x1="3" y1="6" x2="21" y2="6" />
                                                <path d="M16 10a4 4 0 0 1-8 0" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold mb-2">Start Voice Shopping</h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Try: "Show me black hoodies" - specific items appear first!
                                        </p>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Items', value: '36' },
                                { label: 'Categories', value: '6' },
                                { label: 'Delivery', value: '2-3d' },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-black text-white p-3 text-center">
                                    <div className="text-xl font-bold">{stat.value}</div>
                                    <div className="text-[10px] uppercase tracking-wider opacity-80">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Dynamic Product Display Sidebar */}
                <div className="hidden lg:block w-80 xl:w-96 border-l-2 border-black bg-white overflow-y-auto">
                    {/* Shopping Cart Section */}
                    {cartItems.length > 0 && (
                        <div className="border-b-2 border-black">
                            <div className="bg-orange-500 text-white p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-base uppercase tracking-wider">🛒 Your Cart</h3>
                                    <div className="bg-white text-orange-500 px-2 py-1 text-xs font-bold rounded">
                                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-orange-50">
                                <div className="space-y-2">
                                    {cartItems.map((item) => (
                                        <div key={item.product_id} className="bg-white border border-orange-200 overflow-hidden flex">
                                            <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 p-2 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="font-bold text-xs leading-tight mb-1">{item.product_name}</h4>
                                                    <p className="text-[10px] text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-xs font-bold text-orange-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 pt-3 border-t-2 border-orange-200">
                                    <div className="flex justify-between items-center bg-orange-500 text-white p-3">
                                        <span className="font-bold text-sm uppercase">Total</span>
                                        <span className="font-bold text-lg">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-2 text-center">
                                        Say "checkout" to place your order
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Discussed Section */}
                    <div className="sticky top-0 bg-black text-white p-4 z-10">
                        <h3 className="font-bold text-base uppercase tracking-wider">Products Discussed</h3>
                        <p className="text-xs text-gray-400 mt-1">{displayedProducts.length} item(s) • Most recent first</p>
                    </div>

                    <div className="p-3">
                        {displayedProducts.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="bg-gray-100 p-6 mb-4 inline-block">
                                    <svg className="h-12 w-12 text-gray-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-sm mb-2">No Products Yet</h4>
                                <p className="text-xs text-gray-600">
                                    Products appear here as you discuss them. Specific items show at the top!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {displayedProducts.map((product, idx) => (
                                    <div key={product.id} className="group border border-gray-200 hover:border-black transition-all duration-200 cursor-pointer overflow-hidden relative">
                                        {product.priority === 2 && idx < 3 && (
                                            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-0.5 text-[9px] font-bold z-10 uppercase">
                                                Mentioned
                                            </div>
                                        )}
                                        <div className="relative aspect-[3/4] bg-gray-100">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-[10px] font-bold">
                                                {product.category}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-white">
                                            <h4 className="font-bold text-xs mb-0.5 truncate">{product.name}</h4>
                                            <p className="text-gray-600 text-xs">{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Control Bar */}
                <MotionBottom
                    {...BOTTOM_VIEW_MOTION_PROPS}
                    onAnimationComplete={onAnimationComplete}
                    className="absolute bottom-0 left-0 right-0 lg:right-80 xl:right-96 p-4 z-50 flex justify-center bg-gradient-to-t from-white via-white to-transparent pt-12"
                >
                    <div className="w-full max-w-2xl">
                        <AgentControlBar controls={controls} onChatOpenChange={setChatOpen} />
                    </div>
                </MotionBottom>
            </div>
        </section>
    );
};
