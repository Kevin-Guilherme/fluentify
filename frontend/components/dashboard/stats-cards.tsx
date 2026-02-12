import { Trophy, Flame, Star, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsCardsProps {
  xp: number;
  streak: number;
  level: string;
  totalConversations: number;
}

export function StatsCards({ xp, streak, level, totalConversations }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total XP',
      value: xp,
      icon: Trophy,
      className: 'stats-blue',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-300',
    },
    {
      label: 'Streak',
      value: `${streak} days`,
      icon: Flame,
      className: 'stats-orange',
      iconColor: 'text-orange-400',
      textColor: 'text-orange-300',
    },
    {
      label: 'Level',
      value: level,
      icon: Star,
      className: 'stats-purple',
      iconColor: 'text-purple-400',
      textColor: 'text-purple-300',
    },
    {
      label: 'Conversations',
      value: totalConversations,
      icon: MessageSquare,
      className: 'stats-green',
      iconColor: 'text-green-400',
      textColor: 'text-green-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`${stat.className} border p-4 md:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <span className="text-xs md:text-sm font-medium text-gray-200">{stat.label}</span>
            <stat.icon className={`w-4 h-4 md:w-6 md:h-6 ${stat.iconColor}`} />
          </div>
          <p className="text-2xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
          <div className={`text-xs font-semibold ${stat.textColor} hidden sm:block`}>
            {stat.label === 'Total XP' && 'Keep going!'}
            {stat.label === 'Streak' && '🔥 On fire!'}
            {stat.label === 'Level' && '⭐ Rising up'}
            {stat.label === 'Conversations' && '💬 Active'}
          </div>
        </Card>
      ))}
    </div>
  );
}
