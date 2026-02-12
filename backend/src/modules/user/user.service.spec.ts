import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';
import { ConversationStatus, UserLevel } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      conversation: {
        count: jest.fn(),
        aggregate: jest.fn(),
        findMany: jest.fn(),
      },
      userAchievement: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get(PrismaService);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        level: UserLevel.BEGINNER,
        xp: 100,
        streak: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById('user-1');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should throw BusinessException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById('invalid-id')).rejects.toThrow(
        BusinessException,
      );
      await expect(service.getUserById('invalid-id')).rejects.toMatchObject({
        code: MappedsReturnsEnum.USER_NOT_FOUND,
      });
    });
  });

  describe('getUserStats', () => {
    it('should return user stats successfully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        level: UserLevel.BEGINNER,
        xp: 100,
        streak: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: new Date(),
      };

      const mockAchievements = [
        { id: 'ach-1', type: 'FIRST_CONVERSATION', unlockedAt: new Date() },
      ];

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.conversation.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(7); // completed
      prisma.conversation.aggregate
        .mockResolvedValueOnce({ _sum: { xpEarned: 500 } }) // xp
        .mockResolvedValueOnce({ _avg: { score: 75.5 } }); // score
      prisma.userAchievement.findMany.mockResolvedValue(mockAchievements);

      const result = await service.getUserStats('user-1');

      expect(result).toEqual({
        xp: 100,
        streak: 5,
        level: UserLevel.BEGINNER,
        totalConversations: 10,
        completedConversations: 7,
        totalXpEarned: 500,
        averageScore: 75.5,
        achievements: mockAchievements,
      });
    });

    it('should handle user with no conversations', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        level: UserLevel.BEGINNER,
        xp: 0,
        streak: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: null,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.conversation.count.mockResolvedValue(0);
      prisma.conversation.aggregate.mockResolvedValue({
        _sum: { xpEarned: null },
        _avg: { score: null },
      });
      prisma.userAchievement.findMany.mockResolvedValue([]);

      const result = await service.getUserStats('user-1');

      expect(result.totalConversations).toBe(0);
      expect(result.totalXpEarned).toBe(0);
    });
  });

  describe('updateStreak', () => {
    it('should set streak to 1 for first activity', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        level: UserLevel.BEGINNER,
        xp: 0,
        streak: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: null,
      };

      const mockUpdatedUser = { ...mockUser, streak: 1, lastActiveAt: new Date() };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateStreak('user-1');

      expect(result.streak).toBe(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          streak: 1,
          lastActiveAt: expect.any(Date),
        }),
      });
    });

    it('should increment streak when active next day', async () => {
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 25); // 25 hours ago

      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        level: UserLevel.BEGINNER,
        xp: 100,
        streak: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: yesterday,
      };

      const mockUpdatedUser = { ...mockUser, streak: 6 };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateStreak('user-1');

      expect(result.streak).toBe(6);
    });

    it('should reset streak when missed a day', async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setHours(threeDaysAgo.getHours() - 72); // 3 days ago

      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        level: UserLevel.BEGINNER,
        xp: 100,
        streak: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: threeDaysAgo,
      };

      const mockUpdatedUser = { ...mockUser, streak: 1 };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateStreak('user-1');

      expect(result.streak).toBe(1);
    });
  });

  describe('getConversationHistory', () => {
    it('should return paginated conversation history', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        level: UserLevel.BEGINNER,
        xp: 100,
        streak: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: new Date(),
      };

      const mockConversations = [
        {
          id: 'conv-1',
          userId: 'user-1',
          topicId: 'topic-1',
          status: ConversationStatus.COMPLETED,
          score: 80,
          xpEarned: 80,
          duration: 300,
          createdAt: new Date(),
          updatedAt: new Date(),
          topic: {
            title: 'Travel',
            emoji: '✈️',
          },
          messages: [{ id: 'msg-1' }, { id: 'msg-2' }],
        },
      ];

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.conversation.count.mockResolvedValue(1);
      prisma.conversation.findMany.mockResolvedValue(mockConversations);

      const result = await service.getConversationHistory('user-1', 1, 10);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.hasMore).toBe(false);
      expect(result.items[0]).toMatchObject({
        id: 'conv-1',
        topicTitle: 'Travel',
        topicEmoji: '✈️',
        messageCount: 2,
      });
    });

    it('should handle empty conversation history', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        level: UserLevel.BEGINNER,
        xp: 0,
        streak: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: null,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.conversation.count.mockResolvedValue(0);
      prisma.conversation.findMany.mockResolvedValue([]);

      const result = await service.getConversationHistory('user-1');

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });
});
