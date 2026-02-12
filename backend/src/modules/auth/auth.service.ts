import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Sync user from Supabase to local database
   * Creates user if not exists, updates if exists
   */
  async syncUser(
    supabaseId: string,
    syncData: SyncUserDto,
  ): Promise<User> {
    this.logger.log(`Syncing user: ${syncData.email}`);

    const user = await this.prisma.user.upsert({
      where: { supabaseId },
      update: {
        name: syncData.name,
        email: syncData.email,
        avatarUrl: syncData.avatarUrl,
        updatedAt: new Date(),
      },
      create: {
        supabaseId,
        name: syncData.name,
        email: syncData.email,
        avatarUrl: syncData.avatarUrl,
      },
    });

    this.logger.log(`User synced: ${user.id}`);
    return user;
  }

  /**
   * Get user by Supabase ID
   */
  async getUserBySupabaseId(supabaseId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { supabaseId },
    });
  }

  /**
   * Get or create user by Supabase ID
   * Used by JWT strategy to ensure user exists
   */
  async getOrCreateUser(supabaseId: string, email: string): Promise<User> {
    let user = await this.getUserBySupabaseId(supabaseId);

    if (!user) {
      // Auto-create user if doesn't exist
      this.logger.log(`Auto-creating user for: ${email}`);
      user = await this.prisma.user.create({
        data: {
          supabaseId,
          email,
          name: email.split('@')[0], // Default name from email
        },
      });
    }

    return user;
  }

  /**
   * Get user by local ID
   */
  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
