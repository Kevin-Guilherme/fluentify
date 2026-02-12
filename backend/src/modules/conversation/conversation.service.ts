import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';
import {
  Conversation,
  ConversationStatus,
  MessageRole,
  Message,
} from '@prisma/client';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import {
  ConversationResponseDto,
  MessageResponseDto,
  ConversationListItemDto,
} from './dto/conversation-response.dto';
import { CompleteConversationResponseDto } from './dto/complete-conversation.dto';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create new conversation
   */
  async createConversation(
    userId: string,
    data: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    this.logger.log(`Creating conversation for user ${userId}`);

    // Verify topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: data.topicId },
    });

    if (!topic || !topic.isActive) {
      throw new BusinessException(
        MappedsReturnsEnum.TOPIC_NOT_FOUND,
        'Topic not found or inactive',
      );
    }

    // Create conversation with initial system message
    const conversation = await this.prisma.conversation.create({
      data: {
        userId,
        topicId: data.topicId,
        status: ConversationStatus.ACTIVE,
        messages: {
          create: {
            role: MessageRole.SYSTEM,
            content: topic.systemPrompt,
          },
        },
      },
      include: {
        topic: {
          select: {
            title: true,
            emoji: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return this.mapToConversationResponse(conversation);
  }

  /**
   * Get conversation by ID
   */
  async getConversation(
    conversationId: string,
    userId: string,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId, // Ensure user owns this conversation
      },
      include: {
        topic: {
          select: {
            title: true,
            emoji: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      throw new BusinessException(
        MappedsReturnsEnum.CONVERSATION_NOT_FOUND,
        'Conversation not found',
      );
    }

    return this.mapToConversationResponse(conversation);
  }

  /**
   * Send text message
   */
  async sendMessage(
    conversationId: string,
    userId: string,
    data: SendMessageDto,
  ): Promise<MessageResponseDto> {
    // Verify conversation exists and is active
    const conversation = await this.getConversation(conversationId, userId);

    if (conversation.status !== ConversationStatus.ACTIVE) {
      throw new BusinessException(
        MappedsReturnsEnum.CONVERSATION_ALREADY_COMPLETED,
        'Cannot send message to completed or abandoned conversation',
      );
    }

    // Create user message
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        role: MessageRole.USER,
        content: data.content,
      },
    });

    this.logger.log(
      `Message sent in conversation ${conversationId}: ${data.content.substring(0, 50)}...`,
    );

    return this.mapToMessageResponse(message);
  }

  /**
   * Send assistant (AI) response
   * Will be called by AI orchestration service
   */
  async sendAssistantMessage(
    conversationId: string,
    content: string,
  ): Promise<MessageResponseDto> {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        role: MessageRole.ASSISTANT,
        content,
      },
    });

    return this.mapToMessageResponse(message);
  }

  /**
   * Complete conversation and calculate feedback
   * For now, returns mock feedback. Will be replaced with AI feedback in Phase 2
   */
  async completeConversation(
    conversationId: string,
    userId: string,
  ): Promise<CompleteConversationResponseDto> {
    const conversation = await this.getConversation(conversationId, userId);

    if (conversation.status !== ConversationStatus.ACTIVE) {
      throw new BusinessException(
        MappedsReturnsEnum.CONVERSATION_ALREADY_COMPLETED,
        'Conversation already completed',
      );
    }

    // Calculate conversation duration (in seconds)
    const firstMessage = conversation.messages[0];
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const duration = Math.floor(
      (lastMessage.createdAt.getTime() - firstMessage.createdAt.getTime()) /
        1000,
    );

    // Mock feedback for now (will be replaced with AI in Phase 2)
    const mockFeedback = {
      grammarScore: 75,
      vocabularyScore: 80,
      fluencyScore: 70,
      overallScore: 75,
      grammarErrors: [],
      suggestions: ['Great job! Keep practicing.'],
      strengths: ['Good vocabulary usage', 'Clear communication'],
    };

    const xpEarned = mockFeedback.overallScore; // Simple XP calculation

    // Update conversation
    const updatedConversation = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.COMPLETED,
        score: mockFeedback.overallScore,
        xpEarned,
        duration,
      },
    });

    // Create feedback record
    await this.prisma.conversationFeedback.create({
      data: {
        conversationId,
        grammarScore: mockFeedback.grammarScore,
        vocabularyScore: mockFeedback.vocabularyScore,
        fluencyScore: mockFeedback.fluencyScore,
        overallScore: mockFeedback.overallScore,
        grammarErrors: mockFeedback.grammarErrors,
        suggestions: mockFeedback.suggestions,
        strengths: mockFeedback.strengths,
      },
    });

    // Update user XP
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: xpEarned,
        },
      },
    });

    this.logger.log(`Conversation ${conversationId} completed. XP earned: ${xpEarned}`);

    return {
      conversationId,
      status: ConversationStatus.COMPLETED,
      score: mockFeedback.overallScore,
      xpEarned,
      feedback: mockFeedback,
    };
  }

  /**
   * List user conversations
   */
  async listConversations(userId: string): Promise<ConversationListItemDto[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: { userId },
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
    });

    return conversations.map((conv) => ({
      id: conv.id,
      topicTitle: conv.topic.title,
      topicEmoji: conv.topic.emoji,
      status: conv.status,
      messageCount: conv.messages.length,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));
  }

  /**
   * Abandon conversation (user left without completing)
   */
  async abandonConversation(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const conversation = await this.getConversation(conversationId, userId);

    if (conversation.status !== ConversationStatus.ACTIVE) {
      return; // Already completed or abandoned
    }

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.ABANDONED,
      },
    });

    this.logger.log(`Conversation ${conversationId} abandoned`);
  }

  /**
   * Helper: Map to ConversationResponseDto
   */
  private mapToConversationResponse(conversation: any): ConversationResponseDto {
    return {
      id: conversation.id,
      topicId: conversation.topicId,
      topicTitle: conversation.topic.title,
      topicEmoji: conversation.topic.emoji,
      status: conversation.status,
      score: conversation.score,
      xpEarned: conversation.xpEarned,
      duration: conversation.duration,
      messages: conversation.messages.map((m: Message) =>
        this.mapToMessageResponse(m),
      ),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  /**
   * Helper: Map to MessageResponseDto
   */
  private mapToMessageResponse(message: Message): MessageResponseDto {
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      audioUrl: message.audioUrl,
      duration: message.duration,
      createdAt: message.createdAt,
    };
  }
}
