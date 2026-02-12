'use client';

import { Sidebar } from '@/components/layout/sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🎨 DEMO MODE: Auth guard disabled for visual preview
  // TODO: Re-enable auth guard for production

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
