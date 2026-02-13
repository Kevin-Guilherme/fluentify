import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { createClient } from '@supabase/supabase-js';

export interface JwtPayload {
  sub: string; // Supabase user ID
  email: string;
  aud: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private supabase: any;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseKey = configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY not defined');
    }

    console.log('[SupabaseJwtStrategy] Initializing with Supabase client');

    // Initialize Supabase client for token verification
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: supabaseKey, // This won't be used, but passport requires it
      passReqToCallback: true, // We need the request to get the token
    });

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async validate(req: any, payload: JwtPayload) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        console.error('[SupabaseJwtStrategy] No authorization header');
        throw new UnauthorizedException('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');

      console.log('[SupabaseJwtStrategy] Validating token with Supabase');

      // Verify token with Supabase
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error || !data.user) {
        console.error('[SupabaseJwtStrategy] Token validation failed:', error?.message);
        throw new UnauthorizedException('Invalid token');
      }

      console.log('[SupabaseJwtStrategy] Token valid for user:', data.user.email);

      // Get or create user in local database
      const user = await this.authService.getOrCreateUser(
        data.user.id,
        data.user.email,
      );

      console.log('[SupabaseJwtStrategy] User validated:', user.id);

      return {
        userId: user.id, // Local user ID
        supabaseId: data.user.id,
        email: data.user.email,
        role: data.user.role || 'authenticated',
      };
    } catch (error) {
      console.error('[SupabaseJwtStrategy] Validation error:', error.message);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
