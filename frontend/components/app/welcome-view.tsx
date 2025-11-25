'use client';

import { Button } from '@/components/livekit/button';
import { motion } from 'motion/react';

// upGrad Education icon
function EducationIcon() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative mb-8"
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        {/* Graduation Cap / Book Icon */}
        <g className="animate-pulse-slow">
          {/* Book base */}
          <rect x="30" y="50" width="60" height="45" rx="4" fill="url(#gradientUpGrad)" />
          <rect x="35" y="55" width="50" height="35" rx="2" fill="rgba(255,255,255,0.2)" />

          {/* Book pages */}
          <line x1="60" y1="55" x2="60" y2="90" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="40" y1="65" x2="55" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1="65" y1="65" x2="80" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1="40" y1="75" x2="55" y2="75" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1="65" y1="75" x2="80" y2="75" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* Graduation cap on top */}
          <path d="M60 25 L35 35 L35 40 L60 50 L85 40 L85 35 Z" fill="url(#gradientOrange)" />
          <circle cx="60" cy="25" r="4" fill="url(#gradientOrange)" />
          <rect x="58" y="25" width="4" height="18" fill="url(#gradientOrange)" />
        </g>

        {/* Gradient definitions - upGrad colors */}
        <defs>
          <linearGradient id="gradientUpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B2E90" /> {/* upGrad Purple */}
            <stop offset="100%" stopColor="#7B4EBF" />
          </linearGradient>
          <linearGradient id="gradientOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" /> {/* upGrad Orange */}
            <stop offset="100%" stopColor="#FF8A5B" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

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
    <div ref={ref} className="bg-background relative h-screen overflow-hidden">
      {/* Clean section without backdrop blur */}
      <section className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <EducationIcon />

          {/* Main heading with gradient text */}
          <h1
            className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl"
            style={{
              backgroundImage: 'linear-gradient(135deg, #5B2E90 0%, #FF6B35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            upGrad Voice Learning
          </h1>

          <p className="text-muted-foreground mx-auto mb-4 max-w-xl text-lg leading-relaxed md:text-xl">
            Learn programming through interactive AI voice conversations
          </p>

          <p className="text-foreground/70 mx-auto mb-10 max-w-md leading-relaxed">
            Choose your learning mode: Learn concepts, Quiz yourself, or Teach back to reinforce understanding.
          </p>

          {/* CTA Button with clean gradient */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="mb-12"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onStartCall}
              className="relative overflow-hidden px-10 py-6 text-lg font-semibold shadow-lg transition-shadow hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #5B2E90 0%, #FF6B35 100%)',
                border: 'none',
              }}
            >
              <span className="relative z-10">{startButtonText}</span>
            </Button>
          </motion.div>

          {/* Feature pills - refined design */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { text: 'Learn Mode', gradient: 'linear-gradient(135deg, #5B2E90 0%, #7B4EBF 100%)' },
              { text: 'Quiz Mode', gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8A5B 100%)' },
              { text: 'Teach Back Mode', gradient: 'linear-gradient(135deg, #5B2E90 0%, #FF6B35 100%)' }
            ].map((feature, i) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                className="bg-card border-border flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium shadow-sm transition-shadow hover:shadow-md"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: feature.gradient }}
                >
                  ✓
                </span>
                <span className="text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer - clean and simple */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed bottom-6 left-0 flex w-full items-center justify-center px-6"
      >
        <p className="text-muted-foreground text-center text-xs md:text-sm">
          Powered by AI voice technology •{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.livekit.io/agents/start/voice-ai/"
            className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          >
            Learn more
          </a>
        </p>
      </motion.div>
    </div>
  );
};
