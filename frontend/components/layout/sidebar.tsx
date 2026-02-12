'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Topics',
    href: '/topics',
    icon: MessageSquare,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  // 🎨 DEMO MODE: Mock user data
  const mockUser = {
    name: 'Demo User',
    email: 'demo@fluentify.com',
    level: 'Beginner'
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/dashboard" className="block transform transition-transform duration-300 hover:scale-105">
          <Logo variant="logomark" animate size={48} />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg px-4 py-3 mb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {mockUser.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-gray-400">Level: {mockUser.level}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => alert('Demo mode - Sign out disabled')}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
