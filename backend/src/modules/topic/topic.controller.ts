import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TopicService } from './topic.service';
import { Public } from '../../shared/decorators/public.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import {
  TopicResponseDto,
  TopicListItemDto,
  TopicDetailDto,
} from './dto/topic-response.dto';
import { UserLevel } from '@prisma/client';

@ApiTags('topics')
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  /**
   * List all active topics
   * GET /topics?difficulty=BEGINNER
   */
  @Get()
  @Public()
  async findAll(
    @Query('difficulty') difficulty?: string,
  ): Promise<TopicListItemDto[]> {
    return this.topicService.findAll(difficulty as UserLevel);
  }

  /**
   * Get random topic for quick start
   * GET /topics/random?difficulty=BEGINNER
   */
  @Get('random')
  @Public()
  async getRandom(
    @Query('difficulty') difficulty?: string,
  ): Promise<TopicListItemDto> {
    return this.topicService.getRandomTopic(difficulty as UserLevel);
  }

  /**
   * Get topic by ID with details
   * GET /topics/:id?stats=true
   */
  @Get(':id')
  @Public()
  async findById(
    @Param('id') topicId: string,
    @Query('stats') includeStats?: string,
  ): Promise<TopicDetailDto> {
    const stats = includeStats === 'true';
    return this.topicService.findById(topicId, stats);
  }

  /**
   * Get topic statistics
   * GET /topics/:id/stats
   */
  @Get(':id/stats')
  async getStats(
    @Param('id') topicId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.topicService.getTopicStats(topicId);
  }

  /**
   * Create new topic (admin only - TODO: add admin guard)
   * POST /topics
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateTopicDto,
    @CurrentUser('userId') userId: string,
  ): Promise<TopicResponseDto> {
    // TODO: Add admin guard in Phase 4
    return this.topicService.create(createDto);
  }

  /**
   * Update topic (admin only - TODO: add admin guard)
   * PATCH /topics/:id
   */
  @Patch(':id')
  async update(
    @Param('id') topicId: string,
    @Body() updateDto: UpdateTopicDto,
    @CurrentUser('userId') userId: string,
  ): Promise<TopicResponseDto> {
    // TODO: Add admin guard in Phase 4
    return this.topicService.update(topicId, updateDto);
  }

  /**
   * Soft delete topic (admin only - TODO: add admin guard)
   * DELETE /topics/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') topicId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    // TODO: Add admin guard in Phase 4
    return this.topicService.delete(topicId);
  }
}
