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
import { cn } from '@/lib/utils';
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

interface GameMasterViewProps {
    appConfig: AppConfig;
    onAnimationComplete?: () => void;
}

export const GameMasterView = ({
    appConfig,
    onAnimationComplete,
    ...props
}: React.ComponentProps<'section'> & GameMasterViewProps) => {
    useConnectionTimeout(200_000);
    useDebugMode({ enabled: IN_DEVELOPMENT });

    const messages = useChatMessages();
    const [chatOpen, setChatOpen] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const controls: ControlBarControls = {
        leave: true,
        microphone: true,
        chat: true,
        camera: false,
        screenShare: false,
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <section
            className="relative z-10 h-full w-full overflow-hidden bg-black text-white font-sans"
            style={{
                backgroundImage: 'url(/fantasy-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            {...props}
        >
            {/* Dark Overlay with Vignette */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

            {/* Main Content Area */}
            <div className="relative z-20 flex h-full flex-col">

                {/* Header / Title */}
                <header className="p-6 text-center">
                    <h1 className="text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-purple-200 to-purple-600 uppercase drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)] font-serif">
                        Infinite Realms
                    </h1>
                    <p className="text-xs text-purple-300/60 tracking-widest mt-1 uppercase">Procedural Story Engine</p>
                </header>

                {/* Chat / Story Area */}
                <div className="flex-1 overflow-hidden relative">
                    <ScrollArea ref={scrollAreaRef} className="h-full px-4 pb-32 md:px-20 lg:px-64">
                        <div className="max-w-4xl mx-auto py-4">
                            <ChatTranscript
                                hidden={!chatOpen}
                                messages={messages}
                                className="space-y-6"
                            />
                        </div>
                    </ScrollArea>
                </div>

                {/* Bottom HUD */}
                <MotionBottom
                    {...BOTTOM_VIEW_MOTION_PROPS}
                    onAnimationComplete={onAnimationComplete}
                    className="absolute bottom-0 left-0 right-0 p-6 z-50 flex justify-center bg-gradient-to-t from-black/90 to-transparent pt-20"
                >
                    <div className="w-full max-w-2xl">
                        <AgentControlBar controls={controls} onChatOpenChange={setChatOpen} />
                    </div>
                </MotionBottom>

            </div>
        </section>
    );
};
