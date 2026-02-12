import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import {
  ConversationResponseDto,
  MessageResponseDto,
  ConversationListItemDto,
} from './dto/conversation-response.dto';
import { CompleteConversationResponseDto } from './dto/complete-conversation.dto';

@ApiTags('conversations')
@ApiBearerAuth('JWT')
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  /**
   * Create new conversation
   * POST /conversations
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createDto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    return this.conversationService.createConversation(userId, createDto);
  }

  /**
   * Get conversation by ID
   * GET /conversations/:id
   */
  @Get(':id')
  async getById(
    @Param('id') conversationId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<ConversationResponseDto> {
    return this.conversationService.getConversation(conversationId, userId);
  }

  /**
   * List user conversations
   * GET /conversations
   */
  @Get()
  async list(
    @CurrentUser('userId') userId: string,
  ): Promise<ConversationListItemDto[]> {
    return this.conversationService.listConversations(userId);
  }

  /**
   * Send text message
   * POST /conversations/:id/messages
   */
  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Param('id') conversationId: string,
    @CurrentUser('userId') userId: string,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    return this.conversationService.sendMessage(
      conversationId,
      userId,
      sendMessageDto,
    );
  }

  /**
   * Complete conversation (finish and get feedback)
   * POST /conversations/:id/complete
   */
  @Post(':id/complete')
  async complete(
    @Param('id') conversationId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<CompleteConversationResponseDto> {
    return this.conversationService.completeConversation(
      conversationId,
      userId,
    );
  }

  /**
   * Abandon conversation
   * PATCH /conversations/:id/abandon
   */
  @Patch(':id/abandon')
  @HttpCode(HttpStatus.NO_CONTENT)
  async abandon(
    @Param('id') conversationId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.conversationService.abandonConversation(conversationId, userId);
  }
}
