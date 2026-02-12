import { Conversation, Message, ConversationStatus, MessageRole } from '@prisma/client';

export class MessageResponseDto {
  id: string;
  role: MessageRole;
  content: string;
  audioUrl: string | null;
  duration: number | null;
  createdAt: Date;
}

export class ConversationResponseDto {
  id: string;
  topicId: string;
  topicTitle: string;
  topicEmoji: string;
  status: ConversationStatus;
  score: number | null;
  xpEarned: number | null;
  duration: number | null;
  messages: MessageResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationListItemDto {
  id: string;
  topicTitle: string;
  topicEmoji: string;
  status: ConversationStatus;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
