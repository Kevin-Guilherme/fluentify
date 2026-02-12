'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { topicsApi, conversationsApi, usersApi } from '@/lib/api';
import { cn } from '@/lib/utils';

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export default function TopicsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');

  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => usersApi.getStats(),
  });

  const { data: topics, isLoading } = useQuery({
    queryKey: ['topics', selectedDifficulty],
    queryFn: () =>
      topicsApi.getAll(
        selectedDifficulty !== 'ALL' ? { difficulty: selectedDifficulty } : undefined
      ),
  });

  const createConversation = useMutation({
    mutationFn: (topicId: string) =>
      conversationsApi.create({ topicId }),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      router.push(`/conversation/${conversation.id}`);
    },
  });

  const difficulties: (Difficulty | 'ALL')[] = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  return (
    <div>
      <Header
        title="Topics"
        subtitle="Choose a topic to practice"
        xp={stats?.xp || 0}
        streak={stats?.streak || 0}
        level={stats?.level || 'Beginner'}
      />
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Difficulty Filter */}
        <div className="flex gap-2 md:gap-3 flex-wrap">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={cn(
                'px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 touch-manipulation',
                selectedDifficulty === difficulty
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700 hover:border-slate-600 hover:text-white hover:scale-105'
              )}
            >
              {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-8 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {topics?.map((topic) => (
              <Card
                key={topic.id}
                className="p-5 md:p-6 cursor-pointer bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:from-blue-900/30 hover:to-purple-900/30 active:scale-95 touch-manipulation min-h-[180px] md:min-h-[200px]"
                onClick={() => createConversation.mutate(topic.id)}
              >
                <div className="text-5xl md:text-6xl mb-3 md:mb-4 transform transition-transform duration-300 hover:scale-110">
                  {topic.emoji}
                </div>
                <h3 className="font-bold text-white text-base md:text-lg mb-2">
                  {topic.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg',
                      topic.difficulty === 'BEGINNER' && 'bg-green-500/20 text-green-400 border border-green-500/40',
                      topic.difficulty === 'INTERMEDIATE' && 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
                      topic.difficulty === 'ADVANCED' && 'bg-red-500/20 text-red-400 border border-red-500/40'
                    )}
                  >
                    {topic.difficulty}
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {topic.category}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {topics?.length === 0 && !isLoading && (
          <div className="text-center py-12 md:py-20">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6">🔍</div>
            <p className="text-lg md:text-xl font-semibold text-gray-300 mb-2">No topics found</p>
            <p className="text-sm md:text-base text-gray-400">Try selecting a different difficulty level.</p>
          </div>
        )}
      </div>
    </div>
  );
}
