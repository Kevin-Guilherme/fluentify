import { IsNotEmpty, IsString, IsEnum, IsOptional, MaxLength, IsInt } from 'class-validator';
import { UserLevel } from '@prisma/client';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  emoji: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @IsEnum(UserLevel)
  @IsNotEmpty()
  difficulty: UserLevel;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
