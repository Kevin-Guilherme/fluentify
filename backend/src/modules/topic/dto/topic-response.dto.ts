import { Topic, UserLevel } from '@prisma/client';

export class TopicResponseDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: UserLevel;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export class TopicListItemDto {
  id: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: UserLevel;
  category: string;
}

export class TopicDetailDto extends TopicResponseDto {
  systemPrompt: string;
  conversationCount?: number;
}
