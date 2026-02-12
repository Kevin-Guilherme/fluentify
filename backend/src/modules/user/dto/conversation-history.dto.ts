import { ConversationStatus } from '@prisma/client';

export class ConversationHistoryItemDto {
  id: string;
  topicTitle: string;
  topicEmoji: string;
  status: ConversationStatus;
  score: number | null;
  xpEarned: number | null;
  duration: number | null;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationHistoryDto {
  items: ConversationHistoryItemDto[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
