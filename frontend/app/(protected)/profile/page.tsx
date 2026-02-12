'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LevelProgress } from '@/components/shared/level-progress';
import { StreakCard } from '@/components/shared/streak-indicator';
import { usersApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => usersApi.getStats(),
  });

  return (
    <div>
      <Header
        title="Profile"
        subtitle="Manage your account and view your progress"
        xp={stats?.xp || 0}
        streak={stats?.streak || 0}
        level={stats?.level || 'Beginner'}
      />
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div>
              <label className="text-xs md:text-sm text-gray-400">Name</label>
              <p className="text-sm md:text-base text-white font-semibold">{user?.user_metadata?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs md:text-sm text-gray-400">Email</label>
              <p className="text-sm md:text-base text-white font-semibold break-all">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs md:text-sm text-gray-400">Level</label>
              <p className="text-sm md:text-base text-white font-semibold">{stats?.level || 'Beginner'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {/* Level Progress */}
            <LevelProgress
              currentXp={stats?.xp || 0}
              nextLevelXp={1000}
              level={stats?.level || 'Beginner'}
              size="md"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-slate-800">
              <div>
                <label className="text-xs md:text-sm text-gray-400">Total XP</label>
                <p className="text-xl md:text-2xl font-bold text-blue-400">{stats?.xp || 0}</p>
              </div>
              <div>
                <label className="text-xs md:text-sm text-gray-400">Total Conversations</label>
                <p className="text-xl md:text-2xl font-bold text-green-400">{stats?.totalConversations || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <StreakCard
          streak={stats?.streak || 0}
          lastActiveDate={new Date().toISOString()}
        />
      </div>
    </div>
  );
}
