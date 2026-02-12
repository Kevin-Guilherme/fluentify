export interface User {
  id: string;
  email: string;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'FLUENT';
  xp: number;
  streak: number;
  goal?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  systemPrompt: string;
  exampleQuestions: string[];
}

export interface Conversation {
  id: string;
  userId: string;
  topicId: string;
  topic?: Topic;
  score: number | null;
  xpEarned: number;
  startedAt: string;
  completedAt: string | null;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  audioUrl: string | null;
  feedback: Feedback | null;
  createdAt: string;
}

export interface Feedback {
  id: string;
  messageId: string;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  overallScore: number;
  grammarErrors: GrammarError[];
  suggestions: string[];
  strengths: string[];
}

export interface GrammarError {
  text: string;
  correction: string;
  explanation: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  level: string;
  totalConversations: number;
  weeklyActivity: {
    day: string;
    count: number;
  }[];
  recentConversations: Conversation[];
}

export interface FeedbackAnalysis {
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  pronunciationScore?: number;
  overallScore: number;
  grammarErrors: GrammarError[];
  suggestions: string[];
  strengths: string[];
  focusAreas?: string[];
}
