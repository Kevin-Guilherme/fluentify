import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';
import { ConversationStatus, MessageRole, UserLevel } from '@prisma/client';

describe('ConversationService', () => {
  let service: ConversationService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      topic: {
        findUnique: jest.fn(),
      },
      conversation: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      message: {
        create: jest.fn(),
      },
      conversationFeedback: {
        create: jest.fn(),
      },
      user: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    prisma = module.get(PrismaService);
  });

  describe('createConversation', () => {
    it('should create conversation successfully', async () => {
      const mockTopic = {
        id: 'topic-1',
        slug: 'travel',
        title: 'Travel',
        description: 'Travel conversation',
        emoji: '✈️',
        category: 'GENERAL',
        systemPrompt: 'You are a travel assistant',
        difficulty: UserLevel.BEGINNER,
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockConversation = {
        id: 'conv-1',
        userId: 'user-1',
        topicId: 'topic-1',
        status: ConversationStatus.ACTIVE,
        score: null,
        xpEarned: null,
        duration: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        topic: {
          title: 'Travel',
          emoji: '✈️',
        },
        messages: [
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            role: MessageRole.SYSTEM,
            content: 'You are a travel assistant',
            audioUrl: null,
            duration: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      prisma.topic.findUnique.mockResolvedValue(mockTopic);
      prisma.conversation.create.mockResolvedValue(mockConversation);

      const result = await service.createConversation('user-1', {
        topicId: 'topic-1',
      });

      expect(result.id).toBe('conv-1');
      expect(result.status).toBe(ConversationStatus.ACTIVE);
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe(MessageRole.SYSTEM);
    });

    it('should throw error when topic not found', async () => {
      prisma.topic.findUnique.mockResolvedValue(null);

      await expect(
        service.createConversation('user-1', { topicId: 'invalid-topic' }),
      ).rejects.toThrow(BusinessException);
      await expect(
        service.createConversation('user-1', { topicId: 'invalid-topic' }),
      ).rejects.toMatchObject({
        code: MappedsReturnsEnum.TOPIC_NOT_FOUND,
      });
    });

    it('should throw error when topic is inactive', async () => {
      const mockTopic = {
        id: 'topic-1',
        slug: 'travel',
        title: 'Travel',
        description: 'Travel conversation',
        emoji: '✈️',
        category: 'GENERAL',
        systemPrompt: 'You are a travel assistant',
        difficulty: UserLevel.BEGINNER,
        isActive: false,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.topic.findUnique.mockResolvedValue(mockTopic);

      await expect(
        service.createConversation('user-1', { topicId: 'topic-1' }),
      ).rejects.toThrow(BusinessException);
    });
  });

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      const mockConversation = {
        id: 'conv-1',
        userId: 'user-1',
        topicId: 'topic-1',
        status: ConversationStatus.ACTIVE,
        score: null,
        xpEarned: null,
        duration: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        topic: {
          title: 'Travel',
          emoji: '✈️',
        },
        messages: [],
      };

      const mockMessage = {
        id: 'msg-1',
        conversationId: 'conv-1',
        role: MessageRole.USER,
        content: 'Hello, how are you?',
        audioUrl: null,
        duration: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.conversation.findFirst.mockResolvedValue(mockConversation);
      prisma.message.create.mockResolvedValue(mockMessage);

      const result = await service.sendMessage('conv-1', 'user-1', {
        content: 'Hello, how are you?',
      });

      expect(result.id).toBe('msg-1');
      expect(result.role).toBe(MessageRole.USER);
      expect(result.content).toBe('Hello, how are you?');
    });

    it('should throw error when conversation already completed', async () => {
      const mockConversation = {
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
        messages: [],
      };

      prisma.conversation.findFirst.mockResolvedValue(mockConversation);

      await expect(
        service.sendMessage('conv-1', 'user-1', { content: 'Test' }),
      ).rejects.toThrow(BusinessException);
      await expect(
        service.sendMessage('conv-1', 'user-1', { content: 'Test' }),
      ).rejects.toMatchObject({
        code: MappedsReturnsEnum.CONVERSATION_ALREADY_COMPLETED,
      });
    });
  });

  describe('completeConversation', () => {
    it('should complete conversation successfully', async () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      const mockConversation = {
        id: 'conv-1',
        userId: 'user-1',
        topicId: 'topic-1',
        status: ConversationStatus.ACTIVE,
        score: null,
        xpEarned: null,
        duration: null,
        createdAt: fiveMinutesAgo,
        updatedAt: now,
        topic: {
          title: 'Travel',
          emoji: '✈️',
        },
        messages: [
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            role: MessageRole.SYSTEM,
            content: 'System prompt',
            audioUrl: null,
            duration: null,
            createdAt: fiveMinutesAgo,
            updatedAt: fiveMinutesAgo,
          },
          {
            id: 'msg-2',
            conversationId: 'conv-1',
            role: MessageRole.USER,
            content: 'User message',
            audioUrl: null,
            duration: null,
            createdAt: now,
            updatedAt: now,
          },
        ],
      };

      const mockUpdatedConversation = {
        ...mockConversation,
        status: ConversationStatus.COMPLETED,
        score: 75,
        xpEarned: 75,
        duration: 300,
      };

      prisma.conversation.findFirst.mockResolvedValue(mockConversation);
      prisma.conversation.update.mockResolvedValue(mockUpdatedConversation);
      prisma.conversationFeedback.create.mockResolvedValue({} as any);
      prisma.user.update.mockResolvedValue({} as any);

      const result = await service.completeConversation('conv-1', 'user-1');

      expect(result.conversationId).toBe('conv-1');
      expect(result.status).toBe(ConversationStatus.COMPLETED);
      expect(result.score).toBe(75);
      expect(result.xpEarned).toBe(75);
      expect(result.feedback).toBeDefined();
      expect(result.feedback.overallScore).toBe(75);
    });

    it('should throw error when conversation not found', async () => {
      prisma.conversation.findFirst.mockResolvedValue(null);

      await expect(
        service.completeConversation('invalid-id', 'user-1'),
      ).rejects.toThrow(BusinessException);
      await expect(
        service.completeConversation('invalid-id', 'user-1'),
      ).rejects.toMatchObject({
        code: MappedsReturnsEnum.CONVERSATION_NOT_FOUND,
      });
    });

    it('should throw error when conversation already completed', async () => {
      const mockConversation = {
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
        messages: [],
      };

      prisma.conversation.findFirst.mockResolvedValue(mockConversation);

      await expect(
        service.completeConversation('conv-1', 'user-1'),
      ).rejects.toThrow(BusinessException);
    });
  });

  describe('listConversations', () => {
    it('should list user conversations', async () => {
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
        {
          id: 'conv-2',
          userId: 'user-1',
          topicId: 'topic-2',
          status: ConversationStatus.ACTIVE,
          score: null,
          xpEarned: null,
          duration: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          topic: {
            title: 'Business',
            emoji: '💼',
          },
          messages: [{ id: 'msg-3' }],
        },
      ];

      prisma.conversation.findMany.mockResolvedValue(mockConversations);

      const result = await service.listConversations('user-1');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('conv-1');
      expect(result[0].topicTitle).toBe('Travel');
      expect(result[0].messageCount).toBe(2);
      expect(result[1].messageCount).toBe(1);
    });

    it('should return empty array when no conversations', async () => {
      prisma.conversation.findMany.mockResolvedValue([]);

      const result = await service.listConversations('user-1');

      expect(result).toHaveLength(0);
    });
  });
});
