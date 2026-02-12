import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';

export interface StreakUpdateResult {
  currentStreak: number;
  previousStreak: number;
  streakContinued: boolean;
  streakBroken: boolean;
  isFirstActivity: boolean;
}

@Injectable()
export class StreakService {
  private readonly logger = new Logger(StreakService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Update user streak based on activity
   * Call this when user completes a conversation
   */
  async updateStreak(userId: string): Promise<StreakUpdateResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BusinessException(
        MappedsReturnsEnum.USER_NOT_FOUND,
        'User not found',
      );
    }

    const now = new Date();
    const today = this.getStartOfDay(now);
    const previousStreak = user.streak;
    let newStreak = user.streak;
    let streakContinued = false;
    let streakBroken = false;
    let isFirstActivity = false;

    if (!user.lastActiveAt) {
      // First activity ever
      newStreak = 1;
      isFirstActivity = true;
      this.logger.log(`User ${userId}: First activity, streak set to 1`);
    } else {
      const lastActiveDay = this.getStartOfDay(user.lastActiveAt);
      const daysDifference = this.getDaysDifference(lastActiveDay, today);

      if (daysDifference === 0) {
        // Same day - no change to streak
        newStreak = user.streak;
        this.logger.log(
          `User ${userId}: Same day activity, streak unchanged at ${newStreak}`,
        );
      } else if (daysDifference === 1) {
        // Next consecutive day - increment streak
        newStreak = user.streak + 1;
        streakContinued = true;
        this.logger.log(
          `User ${userId}: Consecutive day activity, streak ${previousStreak} → ${newStreak}`,
        );
      } else {
        // More than 1 day gap - reset streak
        newStreak = 1;
        streakBroken = true;
        this.logger.warn(
          `User ${userId}: Streak broken after ${daysDifference} days gap. Reset ${previousStreak} → 1`,
        );
      }
    }

    // Update user with new streak and lastActiveAt
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        lastActiveAt: now,
      },
    });

    return {
      currentStreak: newStreak,
      previousStreak,
      streakContinued,
      streakBroken,
      isFirstActivity,
    };
  }

  /**
   * Get user current streak
   */
  async getStreak(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true },
    });

    if (!user) {
      throw new BusinessException(
        MappedsReturnsEnum.USER_NOT_FOUND,
        'User not found',
      );
    }

    return user.streak;
  }

  /**
   * Helper: Get start of day (midnight) for a given date
   */
  private getStartOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  /**
   * Helper: Calculate days difference between two dates
   */
  private getDaysDifference(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = date2.getTime() - date1.getTime();
    return Math.floor(diff / msPerDay);
  }
}
