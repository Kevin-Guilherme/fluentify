import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatsDto } from './dto/user-stats.dto';
import { ConversationHistoryDto } from './dto/conversation-history.dto';
import { UserProgressDto } from './dto/user-progress.dto';
import { User } from '@prisma/client';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET /users/me
   * Get current user profile
   */
  @Get('me')
  async getMe(@CurrentUser() user: any): Promise<User> {
    return this.userService.getUserById(user.userId);
  }

  /**
   * PATCH /users/me
   * Update current user profile
   */
  @Patch('me')
  async updateMe(
    @CurrentUser() user: any,
    @Body() updateData: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(user.userId, updateData);
  }

  /**
   * GET /users/me/stats
   * Get current user statistics for dashboard
   */
  @Get('me/stats')
  async getMyStats(@CurrentUser() user: any): Promise<UserStatsDto> {
    return this.userService.getUserStats(user.userId);
  }

  /**
   * GET /users/me/history?page=1&pageSize=10
   * Get current user conversation history (paginated)
   */
  @Get('me/history')
  async getMyHistory(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
  ): Promise<ConversationHistoryDto> {
    return this.userService.getConversationHistory(user.userId, page, pageSize);
  }

  /**
   * GET /users/me/progress
   * Get current user progress towards next level
   */
  @Get('me/progress')
  async getMyProgress(@CurrentUser() user: any): Promise<UserProgressDto> {
    return this.userService.getUserProgress(user.userId);
  }
}
