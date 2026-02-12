'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: string;
  newLevel: string;
  xpGained: number;
}

const getLevelGradient = (level: string): string => {
  const levelUpper = level.toUpperCase();
  if (levelUpper === 'BEGINNER') return 'from-blue-500 to-cyan-500';
  if (levelUpper === 'INTERMEDIATE') return 'from-purple-500 to-pink-500';
  if (levelUpper === 'ADVANCED') return 'from-orange-500 to-red-500';
  return 'from-blue-500 to-purple-600';
};

export function LevelUpModal({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  xpGained,
}: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Play celebration sound (optional)
      // const audio = new Audio('/sounds/level-up.mp3');
      // audio.play().catch(() => {});
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center"
            >
              {/* Animated Trophy Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: 'backOut' }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    <Trophy className="w-24 h-24 text-yellow-400" />
                  </motion.div>

                  {/* Sparkles Animation */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: Math.cos((i * Math.PI) / 3) * 40,
                        y: Math.sin((i * Math.PI) / 3) * 40,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="absolute top-1/2 left-1/2"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Title */}
              <DialogHeader>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <DialogTitle className="text-3xl mb-2">🎉 Level Up!</DialogTitle>
                  <DialogDescription className="text-lg">
                    Congratulations! You reached
                  </DialogDescription>
                </motion.div>
              </DialogHeader>

              {/* Level Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="my-6"
              >
                <div
                  className={`inline-block bg-gradient-to-r ${getLevelGradient(
                    newLevel
                  )} text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-2xl`}
                >
                  {newLevel}
                </div>
              </motion.div>

              {/* XP Earned */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <p className="text-gray-400 text-sm mb-2">XP Earned</p>
                <div className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                  >
                    +{xpGained}
                  </motion.span>
                  <span className="text-xl text-gray-400">XP</span>
                </div>
              </motion.div>

              {/* Old Level → New Level */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-slate-800 rounded-lg">{oldLevel}</span>
                  <span>→</span>
                  <span
                    className={`px-3 py-1 bg-gradient-to-r ${getLevelGradient(
                      newLevel
                    )} text-white rounded-lg font-semibold`}
                  >
                    {newLevel}
                  </span>
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button onClick={onClose} size="lg" className="w-full">
                  Continue Learning
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
