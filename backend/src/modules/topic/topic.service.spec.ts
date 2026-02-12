import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';
import { UserLevel } from '@prisma/client';

describe('TopicService', () => {
  let service: TopicService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      topic: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
    prisma = module.get(PrismaService);
  });

  describe('findAll', () => {
    it('should return all active topics', async () => {
      const mockTopics = [
        {
          id: 'topic-1',
          title: 'Travel',
          description: 'Travel conversation',
          emoji: '✈️',
          difficulty: UserLevel.BEGINNER,
          category: 'GENERAL',
        },
        {
          id: 'topic-2',
          title: 'Business',
          description: 'Business conversation',
          emoji: '💼',
          difficulty: UserLevel.INTERMEDIATE,
          category: 'PROFESSIONAL',
        },
      ];

      prisma.topic.findMany.mockResolvedValue(mockTopics);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Travel');
      expect(result[1].title).toBe('Business');
      expect(prisma.topic.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          description: true,
          emoji: true,
          difficulty: true,
          category: true,
        },
        orderBy: { sortOrder: 'asc' },
      });
    });

    it('should filter topics by difficulty', async () => {
      const mockTopics = [
        {
          id: 'topic-1',
          title: 'Travel',
          description: 'Travel conversation',
          emoji: '✈️',
          difficulty: UserLevel.BEGINNER,
          category: 'GENERAL',
        },
      ];

      prisma.topic.findMany.mockResolvedValue(mockTopics);

      const result = await service.findAll(UserLevel.BEGINNER);

      expect(result).toHaveLength(1);
      expect(result[0].difficulty).toBe(UserLevel.BEGINNER);
      expect(prisma.topic.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isActive: true,
            difficulty: UserLevel.BEGINNER,
          },
        }),
      );
    });

    it('should return empty array when no topics found', async () => {
      prisma.topic.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return topic details', async () => {
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

      prisma.topic.findUnique.mockResolvedValue(mockTopic);

      const result = await service.findById('topic-1');

      expect(result.id).toBe('topic-1');
      expect(result.title).toBe('Travel');
      expect(result.systemPrompt).toBe('You are a travel assistant');
    });

    it('should include conversation count when requested', async () => {
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
        conversations: [{ id: 'conv-1' }, { id: 'conv-2' }],
      };

      prisma.topic.findUnique.mockResolvedValue(mockTopic);

      const result = await service.findById('topic-1', true);

      expect(result.conversationCount).toBe(2);
    });

    it('should throw error when topic not found', async () => {
      prisma.topic.findUnique.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        BusinessException,
      );
      await expect(service.findById('invalid-id')).rejects.toMatchObject({
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

      await expect(service.findById('topic-1')).rejects.toThrow(
        BusinessException,
      );
    });
  });

  describe('getRandomTopic', () => {
    it('should return random topic', async () => {
      const mockTopics = [
        {
          id: 'topic-1',
          title: 'Travel',
          description: 'Travel conversation',
          emoji: '✈️',
          difficulty: UserLevel.BEGINNER,
          category: 'GENERAL',
        },
        {
          id: 'topic-2',
          title: 'Business',
          description: 'Business conversation',
          emoji: '💼',
          difficulty: UserLevel.INTERMEDIATE,
          category: 'PROFESSIONAL',
        },
      ];

      prisma.topic.findMany.mockResolvedValue(mockTopics);

      const result = await service.getRandomTopic();

      expect(result).toBeDefined();
      expect(['topic-1', 'topic-2']).toContain(result.id);
    });

    it('should return random topic filtered by difficulty', async () => {
      const mockTopics = [
        {
          id: 'topic-1',
          title: 'Travel',
          description: 'Travel conversation',
          emoji: '✈️',
          difficulty: UserLevel.BEGINNER,
          category: 'GENERAL',
        },
      ];

      prisma.topic.findMany.mockResolvedValue(mockTopics);

      const result = await service.getRandomTopic(UserLevel.BEGINNER);

      expect(result.id).toBe('topic-1');
      expect(result.difficulty).toBe(UserLevel.BEGINNER);
    });

    it('should throw error when no topics available', async () => {
      prisma.topic.findMany.mockResolvedValue([]);

      await expect(service.getRandomTopic()).rejects.toThrow(BusinessException);
      await expect(service.getRandomTopic()).rejects.toMatchObject({
        code: MappedsReturnsEnum.TOPIC_NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    it('should create new topic', async () => {
      const createDto = {
        slug: 'travel',
        title: 'Travel',
        description: 'Travel conversation',
        emoji: '✈️',
        category: 'GENERAL',
        systemPrompt: 'You are a travel assistant',
        difficulty: UserLevel.BEGINNER,
        sortOrder: 0,
      };

      const mockTopic = {
        id: 'topic-1',
        ...createDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.topic.create.mockResolvedValue(mockTopic);

      const result = await service.create(createDto);

      expect(result.id).toBe('topic-1');
      expect(result.title).toBe('Travel');
      expect(prisma.topic.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'travel',
          title: 'Travel',
          isActive: true,
        }),
      });
    });
  });

  describe('update', () => {
    it('should update existing topic', async () => {
      const mockExistingTopic = {
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

      const mockUpdatedTopic = {
        ...mockExistingTopic,
        title: 'Updated Travel',
      };

      prisma.topic.findUnique.mockResolvedValue(mockExistingTopic);
      prisma.topic.update.mockResolvedValue(mockUpdatedTopic);

      const result = await service.update('topic-1', { title: 'Updated Travel' });

      expect(result.title).toBe('Updated Travel');
    });
  });

  describe('delete', () => {
    it('should soft delete topic by setting isActive to false', async () => {
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

      prisma.topic.findUnique.mockResolvedValue(mockTopic);
      prisma.topic.update.mockResolvedValue({ ...mockTopic, isActive: false });

      await service.delete('topic-1');

      expect(prisma.topic.update).toHaveBeenCalledWith({
        where: { id: 'topic-1' },
        data: { isActive: false },
      });
    });
  });
});
