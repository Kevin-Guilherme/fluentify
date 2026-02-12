'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface StreakIndicatorProps {
  streak: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  className?: string;
}

const getStreakColor = (streak: number): string => {
  if (streak >= 30) return 'from-red-500 to-orange-500'; // Hot streak
  if (streak >= 14) return 'from-orange-500 to-yellow-500'; // Good streak
  if (streak >= 7) return 'from-yellow-500 to-amber-500'; // Building streak
  return 'from-amber-500 to-yellow-600'; // Starting streak
};

const getStreakMessage = (streak: number): string => {
  if (streak === 0) return 'Start your streak!';
  if (streak === 1) return 'First day!';
  if (streak < 7) return 'Keep it going!';
  if (streak < 14) return '1 week streak!';
  if (streak < 30) return '2+ weeks!';
  if (streak < 100) return 'On fire!';
  return 'Legendary!';
};

export function StreakIndicator({
  streak,
  showAnimation = false,
  size = 'md',
  compact = false,
  className,
}: StreakIndicatorProps) {
  const [prevStreak, setPrevStreak] = useState(streak);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (showAnimation && streak > prevStreak) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      setPrevStreak(streak);
      return () => clearTimeout(timer);
    }
  }, [streak, prevStreak, showAnimation]);

  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      padding: 'px-3 py-1.5',
    },
    md: {
      icon: 'w-5 h-5',
      text: 'text-base',
      padding: 'px-4 py-2',
    },
    lg: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      padding: 'px-5 py-3',
    },
  };

  const styles = sizeClasses[size];
  const gradient = getStreakColor(streak);

  if (compact) {
    return (
      <motion.div
        animate={animate ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
        className={cn('flex items-center gap-1.5', className)}
      >
        <Flame className={cn(styles.icon, `text-orange-400`)} />
        <span className={cn(styles.text, 'font-bold text-white')}>{streak}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={animate ? { scale: [1, 1.1, 1] } : {}}
      className={cn(
        'bg-slate-800 rounded-lg flex items-center gap-2 relative overflow-hidden',
        styles.padding,
        className
      )}
    >
      {/* Background gradient on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        className={cn('absolute inset-0 bg-gradient-to-r', gradient)}
      />

      {/* Flame Icon */}
      <motion.div
        animate={
          animate
            ? {
                scale: [1, 1.3, 1],
                rotate: [0, -15, 15, 0],
              }
            : streak > 0
            ? {
                scale: [1, 1.05, 1],
                rotate: [0, -3, 3, 0],
              }
            : {}
        }
        transition={
          animate
            ? { duration: 0.6 }
            : {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }
        }
      >
        <Flame
          className={cn(
            styles.icon,
            streak === 0 ? 'text-gray-500' : 'text-orange-400'
          )}
        />
      </motion.div>

      {/* Streak Count */}
      <div className="flex flex-col relative z-10">
        <motion.span
          key={streak}
          initial={animate ? { scale: 1.5, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(styles.text, 'font-bold text-white leading-none')}
        >
          {streak}
        </motion.span>
        {!compact && (
          <span className="text-xs text-gray-400 leading-none mt-0.5">
            {streak === 1 ? 'day' : 'days'}
          </span>
        )}
      </div>

      {/* Particles on animation */}
      <AnimatePresence>
        {animate && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 5) * 30,
                  y: Math.sin((i * Math.PI * 2) / 5) * 30,
                  opacity: 0,
                  scale: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Large streak card for dashboard
 */
interface StreakCardProps {
  streak: number;
  lastActiveDate?: string;
  className?: string;
}

export function StreakCard({ streak, lastActiveDate, className }: StreakCardProps) {
  const gradient = getStreakColor(streak);
  const message = getStreakMessage(streak);

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Flame className="w-8 h-8 text-orange-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Streak</h3>
            <p className="text-sm text-gray-400">{message}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <motion.span
          key={streak}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
            gradient
          )}
        >
          {streak}
        </motion.span>
        <span className="text-2xl text-gray-400 mb-2">
          {streak === 1 ? 'day' : 'days'}
        </span>
      </div>

      {/* Progress bar to next milestone */}
      {streak < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Current: {streak} days</span>
            <span>
              Next:{' '}
              {streak < 7 ? '7' : streak < 14 ? '14' : streak < 30 ? '30' : '100'} days
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((streak % (streak < 7 ? 7 : streak < 14 ? 14 : streak < 30 ? 30 : 100)) /
                    (streak < 7 ? 7 : streak < 14 ? 14 : streak < 30 ? 30 : 100)) *
                  100
                }%`,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn('h-full bg-gradient-to-r', gradient)}
            />
          </div>
        </div>
      )}

      {lastActiveDate && (
        <p className="text-xs text-gray-500 mt-3">
          Last active: {new Date(lastActiveDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
