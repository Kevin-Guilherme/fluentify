'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelProgressProps {
  currentXp: number;
  nextLevelXp: number;
  level: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const XP_PER_LEVEL: Record<string, number> = {
  BEGINNER: 1000,
  INTERMEDIATE: 2500,
  ADVANCED: 5000,
};

const getNextLevelXp = (level: string): number => {
  const levelUpper = level.toUpperCase();
  return XP_PER_LEVEL[levelUpper] || 1000;
};

const getLevelInfo = (level: string) => {
  const levelUpper = level.toUpperCase();
  const config = {
    BEGINNER: {
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      next: 'Intermediate',
    },
    INTERMEDIATE: {
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      next: 'Advanced',
    },
    ADVANCED: {
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      next: 'Master',
    },
  };

  return config[levelUpper as keyof typeof config] || config.BEGINNER;
};

export function LevelProgress({
  currentXp,
  nextLevelXp,
  level,
  className,
  showLabel = true,
  size = 'md',
}: LevelProgressProps) {
  const progress = Math.min((currentXp / nextLevelXp) * 100, 100);
  const xpRemaining = Math.max(nextLevelXp - currentXp, 0);
  const levelInfo = getLevelInfo(level);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className={cn('flex items-center justify-between mb-2', textSizeClasses[size])}>
          <div className="flex items-center gap-2">
            <Star className={cn('text-yellow-400', size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />
            <span className="text-gray-300 font-medium">
              Level Progress
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('font-semibold bg-gradient-to-r', levelInfo.gradient, 'bg-clip-text text-transparent')}>
              {currentXp.toLocaleString()}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{nextLevelXp.toLocaleString()} XP</span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className={cn('w-full bg-slate-800 rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn(
            'h-full bg-gradient-to-r rounded-full relative',
            levelInfo.gradient
          )}
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>

      {/* Next Level Info */}
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn('mt-2 text-center', textSizeClasses[size])}
        >
          <span className="text-gray-400">
            {xpRemaining.toLocaleString()} XP to{' '}
          </span>
          <span className={cn('font-semibold bg-gradient-to-r', levelInfo.gradient, 'bg-clip-text text-transparent')}>
            {levelInfo.next}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Compact circular progress indicator for dashboard cards
 */
interface CircularLevelProgressProps {
  currentXp: number;
  nextLevelXp: number;
  level: string;
  size?: number;
}

export function CircularLevelProgress({
  currentXp,
  nextLevelXp,
  level,
  size = 120,
}: CircularLevelProgressProps) {
  const progress = Math.min((currentXp / nextLevelXp) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const levelInfo = getLevelInfo(level);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-slate-800"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={`text-${levelInfo.color}-500`} stopColor="currentColor" />
            <stop offset="100%" className={`text-${levelInfo.color}-300`} stopColor="currentColor" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Star className="w-6 h-6 text-yellow-400 mb-1" />
        <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
