export class CompleteConversationResponseDto {
  conversationId: string;
  status: string;
  score: number;
  xpEarned: number;
  feedback: {
    grammarScore: number;
    vocabularyScore: number;
    fluencyScore: number;
    overallScore: number;
    grammarErrors: any[];
    suggestions: string[];
    strengths: string[];
  };
}
