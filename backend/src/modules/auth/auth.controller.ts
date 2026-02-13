import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { SyncUserDto } from './dto/sync-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/sync
   * Sync user from Supabase to local database
   * Called after login/signup on frontend
   */
  @Post('sync')
  async syncUser(
    @CurrentUser() user: any,
    @Body() syncData: SyncUserDto,
  ): Promise<AuthResponseDto> {
    const syncedUser = await this.authService.syncUser(
      user.supabaseId,
      syncData,
    );

    return {
      user: syncedUser,
    };
  }

  /**
   * GET /auth/me
   * Get current authenticated user
   */
  @Get('me')
  async getMe(@CurrentUser() user: any): Promise<AuthResponseDto> {
    const dbUser = await this.authService.getUserBySupabaseId(user.supabaseId);

    if (!dbUser) {
      throw new Error('User not found in database. Please sync first.');
    }

    return {
      user: dbUser,
    };
  }

  /**
   * GET /auth/health
   * Public health check for auth module
   */
  @Get('health')
  @Public()
  health() {
    return { status: 'ok', module: 'auth' };
  }
}
