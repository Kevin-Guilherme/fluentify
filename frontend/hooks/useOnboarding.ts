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

  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: () => api.get('/users/me'),
  });

  useEffect(() => {
    if (!isLoading && user) {
      const isOnOnboardingPage = pathname === '/onboarding';

      // Redirect to onboarding if not completed and not already there
      if (!user.onboardingCompleted && !isOnOnboardingPage) {
        router.push('/onboarding');
      }

      // Redirect to dashboard if already completed and on onboarding page
      if (user.onboardingCompleted && isOnOnboardingPage) {
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
