'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useOnboarding } from '@/hooks/useOnboarding';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isOnboardingPage = pathname === '/onboarding';
  const { user, loading } = useAuth();

  // ALWAYS call hooks at the top level (not conditionally!)
  const onboardingState = useOnboarding();

  // Debug logs
  useEffect(() => {
    console.log('[ProtectedLayout] Auth state:', { loading, hasUser: !!user, pathname });
  }, [loading, user, pathname]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('[ProtectedLayout] No user, redirecting to /login');
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

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
