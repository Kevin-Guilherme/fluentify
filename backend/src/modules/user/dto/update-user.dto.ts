import { IsOptional, IsString, MaxLength, IsBoolean, IsEnum } from 'class-validator';

enum UserLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  FLUENT = 'fluent',
}

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
  level?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  goal?: string;

  @IsBoolean()
  @IsOptional()
  onboardingCompleted?: boolean;
}
