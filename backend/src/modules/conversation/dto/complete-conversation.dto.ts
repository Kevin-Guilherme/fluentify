import { FeedbackAnalysis } from '../../groq/feedback/groq-feedback.service';

export class CompleteConversationResponseDto {
  conversationId: string;
  status: string;
  score: number;
  xpEarned: number;
  feedback: FeedbackAnalysis;
}
