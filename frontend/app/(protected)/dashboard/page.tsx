'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ActivityGraph } from '@/components/dashboard/activity-graph';
import { RecentConversations } from '@/components/dashboard/recent-conversations';
import { LevelProgress } from '@/components/shared/level-progress';
import { Button } from '@/components/ui/button';
import { usersApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => usersApi.getStats(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-8 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const weeklyActivity = stats?.weeklyActivity || [
    { day: 'Mon', count: 0 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 0 },
    { day: 'Thu', count: 0 },
    { day: 'Fri', count: 0 },
    { day: 'Sat', count: 0 },
    { day: 'Sun', count: 0 },
  ];

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Track your progress and continue learning"
        xp={stats?.xp || 0}
        streak={stats?.streak || 0}
        level={stats?.level || 'Beginner'}
      />
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        <StatsCards
          xp={stats?.xp || 0}
          streak={stats?.streak || 0}
          level={stats?.level || 'Beginner'}
          totalConversations={stats?.totalConversations || 0}
        />

        {/* Level Progress Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
          <LevelProgress
            currentXp={stats?.xp || 0}
            nextLevelXp={1000}
            level={stats?.level || 'Beginner'}
            size="lg"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ActivityGraph weeklyActivity={weeklyActivity} />
          <RecentConversations conversations={stats?.recentConversations || []} />
        </div>

        <div className="flex justify-center pt-4 md:pt-6">
          <Button
            size="lg"
            onClick={() => router.push('/topics')}
            className="gap-2 w-full sm:w-auto"
          >
            <Zap className="w-5 h-5" />
            Start New Conversation
          </Button>
        </div>
      </div>
    </div>
  );
}
