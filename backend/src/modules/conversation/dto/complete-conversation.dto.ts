import { FeedbackAnalysis } from '../../groq/feedback/groq-feedback.service';
import { UserLevel } from '@prisma/client';

export class CompleteConversationResponseDto {
  conversationId: string;
  status: string;
  score: number;
  xpEarned: number;
  feedback: FeedbackAnalysis;
  streak?: {
    current: number;
    previous: number;
    continued: boolean;
    broken: boolean;
  };
  levelUp?: {
    leveledUp: boolean;
    newLevel?: UserLevel;
    previousLevel: UserLevel;
  };
}
