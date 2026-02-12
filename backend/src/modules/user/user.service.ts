import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatsDto } from './dto/user-stats.dto';
import {
  ConversationHistoryDto,
  ConversationHistoryItemDto,
} from './dto/conversation-history.dto';
import {
  UserProgressDto,
  LevelUpResult,
} from './dto/user-progress.dto';
import { User, ConversationStatus, UserLevel } from '@prisma/client';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  // XP thresholds for each level
  private readonly LEVEL_THRESHOLDS = {
    [UserLevel.BEGINNER]: 0,
    [UserLevel.INTERMEDIATE]: 1000,
    [UserLevel.ADVANCED]: 5000,
    [UserLevel.FLUENT]: 15000,
  };

  constructor(private prisma: PrismaService) {}

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BusinessException(
        MappedsReturnsEnum.USER_NOT_FOUND,
        'User not found',
      );
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, data: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(userId);

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get user statistics for dashboard
   */
  async getUserStats(userId: string): Promise<UserStatsDto> {
    const user = await this.getUserById(userId);

    // Count total and completed conversations
    const [totalConversations, completedConversations] = await Promise.all([
      this.prisma.conversation.count({
        where: { userId },
      }),
      this.prisma.conversation.count({
        where: {
          userId,
          status: ConversationStatus.COMPLETED,
        },
      }),
    ]);

    // Calculate total XP earned from conversations
    const xpAggregation = await this.prisma.conversation.aggregate({
      where: {
        userId,
        status: ConversationStatus.COMPLETED,
        xpEarned: { not: null },
      },
      _sum: {
        xpEarned: true,
      },
    });

    const totalXpEarned = xpAggregation._sum.xpEarned || 0;

    // Calculate average score
    const scoreAggregation = await this.prisma.conversation.aggregate({
      where: {
        userId,
        status: ConversationStatus.COMPLETED,
        score: { not: null },
      },
      _avg: {
        score: true,
      },
    });

    const averageScore = scoreAggregation._avg.score;

    // Get achievements
    const achievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        unlockedAt: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    return {
      xp: user.xp,
      streak: user.streak,
      level: user.level,
      totalConversations,
      completedConversations,
      totalXpEarned,
      averageScore,
      achievements,
    };
  }

  /**
   * Get user conversation history with pagination
   */
  async getConversationHistory(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ConversationHistoryDto> {
    const user = await this.getUserById(userId);

    const skip = (page - 1) * pageSize;

    // Get total count
    const total = await this.prisma.conversation.count({
      where: { userId: user.id },
    });

    // Get conversations with topic info and message count
    const conversations = await this.prisma.conversation.findMany({
      where: { userId: user.id },
      include: {
        topic: {
          select: {
            title: true,
            emoji: true,
          },
        },
        messages: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    });

    const items: ConversationHistoryItemDto[] = conversations.map((conv) => ({
      id: conv.id,
      topicTitle: conv.topic.title,
      topicEmoji: conv.topic.emoji,
      status: conv.status,
      score: conv.score,
      xpEarned: conv.xpEarned,
      duration: conv.duration,
      messageCount: conv.messages.length,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    return {
      items,
      total,
      page,
      pageSize,
      hasMore: skip + pageSize < total,
    };
  }

  /**
   * Update user last active timestamp
   */
  async updateLastActive(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastActiveAt: new Date(),
      },
    });
  }

  /**
   * Update user streak
   * Should be called when user completes a conversation
   */
  async updateStreak(userId: string): Promise<User> {
    const user = await this.getUserById(userId);

    const now = new Date();
    const lastActive = user.lastActiveAt;

    let newStreak = user.streak;

    if (!lastActive) {
      // First activity
      newStreak = 1;
    } else {
      const hoursSinceLastActive =
        (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastActive < 24) {
        // Same day, no change
        newStreak = user.streak;
      } else if (hoursSinceLastActive < 48) {
        // Next day, increment
        newStreak = user.streak + 1;
      } else {
        // Missed a day, reset
        newStreak = 1;
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        lastActiveAt: now,
      },
    });
  }

  /**
   * Get user progress towards next level
   */
  async getUserProgress(userId: string): Promise<UserProgressDto> {
    const user = await this.getUserById(userId);

    const currentLevel = user.level;
    const currentXP = user.xp;
    const nextLevel = this.getNextLevel(currentLevel);
    const nextLevelXP = nextLevel ? this.LEVEL_THRESHOLDS[nextLevel] : null;
    const currentLevelXP = this.LEVEL_THRESHOLDS[currentLevel];

    let progressPercentage = 0;
    let xpToNextLevel = null;

    if (nextLevelXP !== null) {
      const xpInCurrentLevel = currentXP - currentLevelXP;
      const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
      progressPercentage = Math.min(
        100,
        Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100),
      );
      xpToNextLevel = nextLevelXP - currentXP;
    } else {
      // Already at max level
      progressPercentage = 100;
    }

    return {
      currentXP,
      currentLevel,
      nextLevel,
      nextLevelXP,
      progressPercentage,
      xpToNextLevel,
    };
  }

  /**
   * Check if user should level up and update level if needed
   * Returns level up result
   */
  async checkLevelUp(userId: string): Promise<LevelUpResult> {
    const user = await this.getUserById(userId);

    const previousLevel = user.level;
    const currentXP = user.xp;
    const newLevel = this.calculateLevelFromXP(currentXP);

    if (newLevel !== previousLevel) {
      // User leveled up!
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          level: newLevel,
        },
      });

      this.logger.log(
        `User ${userId} leveled up: ${previousLevel} → ${newLevel} (XP: ${currentXP})`,
      );

      return {
        leveledUp: true,
        newLevel,
        previousLevel,
        currentXP,
      };
    }

    return {
      leveledUp: false,
      newLevel: null,
      previousLevel,
      currentXP,
    };
  }

  /**
   * Helper: Calculate level based on XP
   */
  private calculateLevelFromXP(xp: number): UserLevel {
    if (xp >= this.LEVEL_THRESHOLDS[UserLevel.FLUENT]) {
      return UserLevel.FLUENT;
    } else if (xp >= this.LEVEL_THRESHOLDS[UserLevel.ADVANCED]) {
      return UserLevel.ADVANCED;
    } else if (xp >= this.LEVEL_THRESHOLDS[UserLevel.INTERMEDIATE]) {
      return UserLevel.INTERMEDIATE;
    } else {
      return UserLevel.BEGINNER;
    }
  }

  /**
   * Helper: Get next level
   */
  private getNextLevel(currentLevel: UserLevel): UserLevel | null {
    const levelOrder = [
      UserLevel.BEGINNER,
      UserLevel.INTERMEDIATE,
      UserLevel.ADVANCED,
      UserLevel.FLUENT,
    ];

    const currentIndex = levelOrder.indexOf(currentLevel);
    if (currentIndex === -1 || currentIndex === levelOrder.length - 1) {
      return null; // Already at max level
    }

    return levelOrder[currentIndex + 1];
  }
}
