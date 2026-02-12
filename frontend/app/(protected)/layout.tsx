'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useOnboarding } from '@/hooks/useOnboarding';
import { usePathname } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboardingPage = pathname === '/onboarding';

  // Trigger onboarding check (will auto-redirect if needed)
  useOnboarding();

  // Onboarding page has its own full-screen layout
  if (isOnboardingPage) {
    return <>{children}</>;
  }

  // Regular protected layout with sidebar
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
