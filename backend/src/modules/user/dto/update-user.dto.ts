import { IsOptional, IsString, MaxLength, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserLevel } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsEnum(UserLevel)
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  level?: UserLevel;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  goal?: string;

  @IsBoolean()
  @IsOptional()
  onboardingCompleted?: boolean;
}
