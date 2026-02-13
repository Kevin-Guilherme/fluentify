import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseJwtStrategy } from './strategies/supabase-jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Module({
  imports: [PassportModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseJwtStrategy, JwtAuthGuard, SupabaseAuthGuard],
  exports: [AuthService, JwtAuthGuard, SupabaseAuthGuard],
})
export class AuthModule {}
