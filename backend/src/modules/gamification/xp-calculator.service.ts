import { Injectable } from '@nestjs/common';
import { FeedbackAnalysis } from '../groq/feedback/groq-feedback.service';
import { UserLevel } from '@prisma/client';

@Injectable()
export class XpCalculatorService {
  /**
   * Calcula XP baseado no feedback e duração
   */
  calculateXP(
    feedback: FeedbackAnalysis,
    durationSeconds: number,
    userStreak: number,
    userLevel: UserLevel,
  ): number {
    // Base XP: média dos scores
    const baseXP =
      (feedback.overallScore +
        feedback.vocabularyScore +
        feedback.fluencyScore) /
      3;

    // Bonus por duração (max 2min = 20% bonus)
    const maxDuration = 120; // 2 minutos
    const durationBonus = Math.min((durationSeconds / maxDuration) * 0.2, 0.2);

    // Bonus por streak (max 30 dias = 30% bonus)
    const streakBonus = Math.min(userStreak * 0.01, 0.3);

    // Multiplicador por nível
    const levelMultiplier = {
      [UserLevel.BEGINNER]: 1.0,
      [UserLevel.INTERMEDIATE]: 1.2,
      [UserLevel.ADVANCED]: 1.5,
      [UserLevel.FLUENT]: 2.0,
    };

    // XP final
    const xp =
      baseXP *
      (1 + durationBonus + streakBonus) *
      levelMultiplier[userLevel];

    return Math.round(xp);
  }

  /**
   * Determina level baseado em XP total
   */
  getLevel(totalXP: number): {
    level: number;
    title: string;
    currentXP: number;
    nextLevelXP: number;
    progress: number;
  } {
    const levels = [
      { level: 1, min: 0, max: 100, title: 'Beginner I' },
      { level: 2, min: 100, max: 250, title: 'Beginner II' },
      { level: 3, min: 250, max: 500, title: 'Beginner III' },
      { level: 4, min: 500, max: 1000, title: 'Intermediate I' },
      { level: 5, min: 1000, max: 2000, title: 'Intermediate II' },
      { level: 6, min: 2000, max: 3500, title: 'Intermediate III' },
      { level: 7, min: 3500, max: 5500, title: 'Advanced I' },
      { level: 8, min: 5500, max: 8000, title: 'Advanced II' },
      { level: 9, min: 8000, max: 12000, title: 'Advanced III' },
      { level: 10, min: 12000, max: Infinity, title: 'Fluent' },
    ];

    const currentLevel =
      levels.find((l) => totalXP >= l.min && totalXP < l.max) ||
      levels[levels.length - 1];

    const progress =
      currentLevel.max === Infinity
        ? 100
        : Math.round(
            ((totalXP - currentLevel.min) /
              (currentLevel.max - currentLevel.min)) *
              100,
          );

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      currentXP: totalXP,
      nextLevelXP: currentLevel.max === Infinity ? totalXP : currentLevel.max,
      progress,
    };
  }

  /**
   * Calcula e atualiza streak
   */
  calculateStreak(
    lastActivityDate: Date | null,
    currentDate: Date = new Date(),
  ): {
    streak: number;
    isActive: boolean;
    lostStreak: boolean;
  } {
    if (!lastActivityDate) {
      return { streak: 1, isActive: true, lostStreak: false };
    }

    const hoursSinceLastActivity =
      (currentDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60);

    // Se < 24h = ainda dentro do dia
    if (hoursSinceLastActivity < 24) {
      return { streak: 1, isActive: true, lostStreak: false }; // Mesma sessão
    }

    // Se < 48h = mantém streak
    if (hoursSinceLastActivity < 48) {
      return { streak: 1, isActive: true, lostStreak: false }; // Novo dia, streak continua
    }

    // Se > 48h = perdeu streak
    return { streak: 1, isActive: true, lostStreak: true }; // Resetou
  }
}
