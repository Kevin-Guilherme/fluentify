'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Mic,
  User,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Topics',
    href: '/topics',
    icon: MessageSquare,
  },
  {
    name: 'Practice',
    href: '/topics',
    icon: Mic,
    highlight: true,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'More',
    href: '#',
    icon: Menu,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isHighlight = item.highlight;

            // More button shows dropdown
            if (item.name === 'More') {
              return (
                <button
                  key={item.name}
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1"
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300',
                      'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-1 text-gray-400 font-medium">
                    {item.name}
                  </span>
                </button>
              );
            }

            // Highlight button (Practice/Mic) - larger and centered
            if (isHighlight) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 -mt-6"
                >
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-2xl transition-all duration-300 shadow-2xl',
                      'w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white',
                      'hover:scale-110 hover:shadow-blue-500/50'
                    )}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs mt-2 text-white font-semibold">
                    {item.name}
                  </span>
                </Link>
              );
            }

            // Regular navigation items
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1"
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    'text-xs mt-1 font-medium',
                    isActive ? 'text-blue-400' : 'text-gray-400'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* More Menu Dropdown */}
      {showMenu && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="md:hidden fixed bottom-20 right-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[200px]">
            <div className="p-2">
              <Link
                href="/dashboard"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  setShowMenu(false);
                  alert('Demo mode - Sign out disabled');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
