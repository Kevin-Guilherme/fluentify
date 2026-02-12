import { UserLevel } from '@prisma/client';

export class UserStatsDto {
  xp: number;
  streak: number;
  level: UserLevel;
  totalConversations: number;
  completedConversations: number;
  totalXpEarned: number;
  averageScore: number | null;
  achievements: {
    id: string;
    type: string;
    unlockedAt: Date;
  }[];
}
