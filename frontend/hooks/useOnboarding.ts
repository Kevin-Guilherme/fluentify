'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: string;
  goal?: string;
  onboardingCompleted: boolean;
}

export function useOnboarding() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: () => api.get('/users/me'),
    retry: false, // Don't retry on 401
    enabled: true, // Always try to fetch
  });

  useEffect(() => {
    // Only run redirect logic when we have a user loaded
    if (!isLoading && user) {
      const isOnOnboardingPage = pathname === '/onboarding';

      console.log('[useOnboarding] User loaded:', {
        onboardingCompleted: user.onboardingCompleted,
        isOnOnboardingPage
      });

      // Redirect to onboarding if not completed and not already there
      if (!user.onboardingCompleted && !isOnOnboardingPage) {
        console.log('[useOnboarding] Redirecting to /onboarding');
        router.push('/onboarding');
      }

      // Redirect to dashboard if already completed and on onboarding page
      if (user.onboardingCompleted && isOnOnboardingPage) {
        console.log('[useOnboarding] Redirecting to /dashboard');
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  return {
    user,
    isLoading,
    needsOnboarding: user && !user.onboardingCompleted,
  };
}
