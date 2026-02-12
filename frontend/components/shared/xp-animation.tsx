'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface XpAnimationProps {
  xpAmount: number;
  onComplete?: () => void;
  triggerKey?: string | number; // To trigger animation when this changes
}

export function XpAnimation({ xpAmount, onComplete, triggerKey }: XpAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (xpAmount > 0) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [xpAmount, onComplete, triggerKey]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0, opacity: 0, scale: 0.5 }}
          animate={{ y: -60, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: 3,
            }}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/20"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="text-3xl font-bold">+{xpAmount} XP</span>
            <Sparkles className="w-6 h-6 animate-pulse" />
          </motion.div>

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: Math.cos((i * Math.PI) / 4) * 60,
                y: Math.sin((i * Math.PI) / 4) * 60 - 30,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 1.5,
                delay: 0.3,
                ease: 'easeOut',
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface XpGainIndicatorProps {
  xpAmount: number;
  position?: 'top' | 'center' | 'bottom';
}

/**
 * Compact XP gain indicator for inline use (e.g., after completing a conversation)
 */
export function XpGainIndicator({ xpAmount, position = 'center' }: XpGainIndicatorProps) {
  const positionClasses = {
    top: 'top-4 left-1/2 -translate-x-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scale: 0.8 }}
      animate={{ y: -20, opacity: 1, scale: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className={`fixed ${positionClasses[position]} z-40 pointer-events-none`}
    >
      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg">
        <Sparkles className="w-5 h-5" />
        <span className="text-xl font-bold">+{xpAmount} XP</span>
      </div>
    </motion.div>
  );
}
