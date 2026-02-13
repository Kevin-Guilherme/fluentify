import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/public.decorator';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase: any;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY not configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[SupabaseAuthGuard] Initialized');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[SupabaseAuthGuard] No valid authorization header');
      throw new UnauthorizedException('No authorization token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    try {
      console.log('[SupabaseAuthGuard] Validating token...');

      // Validate token with Supabase
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error || !data.user) {
        console.error('[SupabaseAuthGuard] Token validation failed:', error?.message);
        throw new UnauthorizedException('Invalid or expired token');
      }

      console.log('[SupabaseAuthGuard] Token valid for user:', data.user.email);

      // Get or create user in local database
      const user = await this.authService.getOrCreateUser(
        data.user.id,
        data.user.email,
      );

      console.log('[SupabaseAuthGuard] User synced to local DB:', user.id);

      // Attach user to request
      request.user = {
        userId: user.id,
        supabaseId: data.user.id,
        email: data.user.email,
        role: data.user.role || 'authenticated',
      };

      return true;
    } catch (error) {
      console.error('[SupabaseAuthGuard] Error:', error.message);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
