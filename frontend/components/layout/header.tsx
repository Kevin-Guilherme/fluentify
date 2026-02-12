'use client';

import { ReactNode } from 'react';
import { Trophy, Star } from 'lucide-react';
import { StreakIndicator } from '@/components/shared/streak-indicator';

interface HeaderProps {
  title: string;
  subtitle?: string;
  xp?: number;
  streak?: number;
  level?: string;
  children?: ReactNode;
}

export function Header({ title, subtitle, xp, streak, level, children }: HeaderProps) {
  const showStats = xp !== undefined || streak !== undefined || level !== undefined;

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-1 hidden sm:block">{subtitle}</p>}
        </div>

        {/* Stats Section or Children */}
        <div className="flex items-center gap-2 md:gap-4">
          {children}
          {showStats && (
            <>
              {xp !== undefined && (
                <div className="bg-slate-800 rounded-lg px-3 md:px-4 py-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  <span className="font-semibold text-white text-sm md:text-base">
                    <span className="hidden sm:inline">{xp} XP</span>
                    <span className="sm:hidden">{xp}</span>
                  </span>
                </div>
              )}
              {streak !== undefined && (
                <StreakIndicator
                  streak={streak}
                  size="md"
                  className="hidden sm:flex"
                />
              )}
              {streak !== undefined && (
                <StreakIndicator
                  streak={streak}
                  size="sm"
                  compact
                  className="sm:hidden"
                />
              )}
              {level !== undefined && (
                <div className="bg-slate-800 rounded-lg px-3 md:px-4 py-2 flex items-center gap-2">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                  <span className="font-semibold text-white text-sm md:text-base">{level}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
