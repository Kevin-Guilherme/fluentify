import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatsDto } from './dto/user-stats.dto';
import {
  ConversationHistoryDto,
  ConversationHistoryItemDto,
} from './dto/conversation-history.dto';
import { User, ConversationStatus } from '@prisma/client';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

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
}
