import { UserLevel } from '@prisma/client';

export class UserProgressDto {
  currentXP: number;
  currentLevel: UserLevel;
  nextLevel: UserLevel | null;
  nextLevelXP: number | null;
  progressPercentage: number;
  xpToNextLevel: number | null;
}

export class LevelUpResult {
  leveledUp: boolean;
  newLevel: UserLevel | null;
  previousLevel: UserLevel;
  currentXP: number;
}
