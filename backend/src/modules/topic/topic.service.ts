import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';
import { Topic, UserLevel } from '@prisma/client';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import {
  TopicResponseDto,
  TopicListItemDto,
  TopicDetailDto,
} from './dto/topic-response.dto';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * List all active topics
   * @param difficulty Optional filter by difficulty
   */
  async findAll(difficulty?: UserLevel): Promise<TopicListItemDto[]> {
    const topics = await this.prisma.topic.findMany({
      where: {
        isActive: true,
        ...(difficulty && { difficulty }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        emoji: true,
        difficulty: true,
        category: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    this.logger.log(
      `Found ${topics.length} topics${difficulty ? ` with difficulty: ${difficulty}` : ''}`,
    );

    return topics;
  }

  /**
   * Get topic by ID with details
   * @param topicId Topic ID
   * @param includeStats Include conversation count
   */
  async findById(
    topicId: string,
    includeStats = false,
  ): Promise<TopicDetailDto> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        ...(includeStats && {
          conversations: {
            select: { id: true },
          },
        }),
      },
    });

    if (!topic || !topic.isActive) {
      throw new BusinessException(
        MappedsReturnsEnum.TOPIC_NOT_FOUND,
        'Topic not found or inactive',
      );
    }

    const response: TopicDetailDto = {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      emoji: topic.emoji,
      category: topic.category,
      systemPrompt: topic.systemPrompt,
      difficulty: topic.difficulty,
      isActive: topic.isActive,
      sortOrder: topic.sortOrder,
      createdAt: topic.createdAt,
    };

    if (includeStats && 'conversations' in topic) {
      response.conversationCount = topic.conversations.length;
    }

    this.logger.log(`Topic found: ${topic.title}`);

    return response;
  }

  /**
   * Get topics by difficulty level
   */
  async findByDifficulty(difficulty: UserLevel): Promise<TopicListItemDto[]> {
    return this.findAll(difficulty);
  }

  /**
   * Get random topic for quick start
   * @param difficulty Optional difficulty filter
   */
  async getRandomTopic(difficulty?: UserLevel): Promise<TopicListItemDto> {
    const topics = await this.findAll(difficulty);

    if (topics.length === 0) {
      throw new BusinessException(
        MappedsReturnsEnum.TOPIC_NOT_FOUND,
        'No topics available',
      );
    }

    const randomIndex = Math.floor(Math.random() * topics.length);
    const randomTopic = topics[randomIndex];

    this.logger.log(`Random topic selected: ${randomTopic.title}`);

    return randomTopic;
  }

  /**
   * Create new topic (admin only)
   */
  async create(data: CreateTopicDto): Promise<TopicResponseDto> {
    const topic = await this.prisma.topic.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        emoji: data.emoji,
        category: data.category,
        systemPrompt: data.systemPrompt,
        difficulty: data.difficulty,
        sortOrder: data.sortOrder || 0,
        isActive: true,
      },
    });

    this.logger.log(`Topic created: ${topic.title}`);

    return this.mapToResponse(topic);
  }

  /**
   * Update topic (admin only)
   */
  async update(
    topicId: string,
    data: UpdateTopicDto,
  ): Promise<TopicResponseDto> {
    // Verify topic exists
    await this.findById(topicId);

    const topic = await this.prisma.topic.update({
      where: { id: topicId },
      data,
    });

    this.logger.log(`Topic updated: ${topic.title}`);

    return this.mapToResponse(topic);
  }

  /**
   * Soft delete topic (admin only)
   * Sets isActive to false instead of deleting
   */
  async delete(topicId: string): Promise<void> {
    // Verify topic exists
    await this.findById(topicId);

    await this.prisma.topic.update({
      where: { id: topicId },
      data: { isActive: false },
    });

    this.logger.log(`Topic deactivated: ${topicId}`);
  }

  /**
   * Get topic statistics
   */
  async getTopicStats(topicId: string): Promise<{
    topicId: string;
    topicTitle: string;
    totalConversations: number;
    completedConversations: number;
    averageScore: number;
  }> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        conversations: {
          select: {
            id: true,
            status: true,
            score: true,
          },
        },
      },
    });

    if (!topic) {
      throw new BusinessException(
        MappedsReturnsEnum.TOPIC_NOT_FOUND,
        'Topic not found',
      );
    }

    const completedConversations = topic.conversations.filter(
      (c) => c.status === 'COMPLETED',
    );

    const averageScore =
      completedConversations.length > 0
        ? completedConversations.reduce(
            (sum, c) => sum + (c.score || 0),
            0,
          ) / completedConversations.length
        : 0;

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      totalConversations: topic.conversations.length,
      completedConversations: completedConversations.length,
      averageScore: Math.round(averageScore),
    };
  }

  /**
   * Helper: Map Topic to Response DTO
   */
  private mapToResponse(topic: Topic): TopicResponseDto {
    return {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      emoji: topic.emoji,
      category: topic.category,
      difficulty: topic.difficulty,
      isActive: topic.isActive,
      sortOrder: topic.sortOrder,
      createdAt: topic.createdAt,
    };
  }
}
