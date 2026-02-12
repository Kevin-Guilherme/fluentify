'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
      <div className="p-8 space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <p className="text-white font-semibold">{user?.user_metadata?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-white font-semibold">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Level</label>
              <p className="text-white font-semibold">{stats?.level || 'Beginner'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Total XP</label>
                <p className="text-2xl font-bold text-blue-400">{stats?.xp || 0}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Current Streak</label>
                <p className="text-2xl font-bold text-orange-400">{stats?.streak || 0} days</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Total Conversations</label>
                <p className="text-2xl font-bold text-green-400">{stats?.totalConversations || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
