'use client';

import { ReactNode } from 'react';
import { Trophy, Flame, Star } from 'lucide-react';

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
    <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>

        {/* Stats Section or Children */}
        <div className="flex items-center gap-4">
          {children}
          {showStats && (
            <>
              {xp !== undefined && (
                <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">{xp} XP</span>
                </div>
              )}
              {streak !== undefined && (
                <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold text-white">{streak} days</span>
                </div>
              )}
              {level !== undefined && (
                <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-white">{level}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
