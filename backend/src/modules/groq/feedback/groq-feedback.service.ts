import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../../shared/enums/mapped-returns.enum';
import { buildFeedbackPrompt, UserLevel } from '../prompts/feedback.prompt';

export interface GrammarError {
  error: string;
  correction: string;
  explanation: string;
}

export interface VocabularyHighlight {
  word: string;
  context: string;
  alternative: string;
}

export interface PronunciationIssue {
  word: string;
  issue: string;
  tip: string;
}

export interface FeedbackAnalysis {
  grammarErrors: GrammarError[];
  vocabularyScore: number;
  vocabularyHighlights: VocabularyHighlight[];
  fluencyScore: number;
  fluencyNotes: string;
  pronunciationIssues: PronunciationIssue[];
  overallScore: number;
  suggestions: string[];
  strengths: string[];
  focusAreas: string[];
}

@Injectable()
export class GroqFeedbackService {
  private readonly logger = new Logger(GroqFeedbackService.name);
  private readonly groq: Groq;

  constructor(private config: ConfigService) {
    const apiKey = config.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }
    this.groq = new Groq({ apiKey });
  }

  /**
   * Analisa a resposta falada do usuário com feedback detalhado
   */
  async analyzeSpeaking(
    userTranscription: string,
    conversationContext: string,
    userLevel: UserLevel,
  ): Promise<FeedbackAnalysis> {
    try {
      this.logger.log(
        `Analyzing speaking for ${userLevel} level: ${conversationContext}`,
      );

      const prompt = buildFeedbackPrompt(
        userTranscription,
        conversationContext,
        userLevel,
      );

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a professional English teacher specializing in spoken English analysis. Output ONLY valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3, // Mais determinístico
        max_tokens: 2000,
      });

      const responseText = chatCompletion.choices[0]?.message?.content || '';

      if (!responseText) {
        throw new Error('Empty response from Groq');
      }

      const feedback = this.parseJsonResponse(responseText);
      this.validateFeedback(feedback);

      this.logger.log('Speaking analysis completed successfully');
      return feedback;
    } catch (error) {
      this.logger.error('Feedback analysis failed', error);

      if (error instanceof BusinessException) {
        throw error;
      }

      throw new BusinessException(
        MappedsReturnsEnum.GROQ_API_ERROR,
        `Failed to analyze speaking: ${error.message}`,
      );
    }
  }

  private parseJsonResponse(responseText: string): FeedbackAnalysis {
    try {
      // Remove markdown code blocks se existirem
      let cleanedText = responseText.trim();

      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```$/, '');
      }

      const feedback = JSON.parse(cleanedText);
      return feedback;
    } catch (error) {
      this.logger.warn(
        'Failed to parse JSON response, using fallback',
        error.message,
      );
      return this.getFallbackFeedback();
    }
  }

  /**
   * Valida estrutura do feedback
   */
  private validateFeedback(feedback: FeedbackAnalysis): void {
    const required = [
      'grammarErrors',
      'vocabularyScore',
      'fluencyScore',
      'overallScore',
      'suggestions',
      'strengths',
      'focusAreas',
    ];

    for (const field of required) {
      if (!(field in feedback)) {
        throw new BusinessException(
          MappedsReturnsEnum.GROQ_API_ERROR,
          `Missing required field in feedback: ${field}`,
        );
      }
    }

    // Validar scores (0-100)
    const scores: Array<keyof Pick<FeedbackAnalysis, 'vocabularyScore' | 'fluencyScore' | 'overallScore'>> = [
      'vocabularyScore',
      'fluencyScore',
      'overallScore',
    ];
    for (const scoreField of scores) {
      const value = feedback[scoreField];
      if (typeof value !== 'number' || value < 0 || value > 100) {
        this.logger.warn(`Invalid score for ${scoreField}: ${value}, using 70`);
        feedback[scoreField] = 70;
      }
    }
  }

  private getFallbackFeedback(): FeedbackAnalysis {
    return {
      grammarErrors: [],
      vocabularyScore: 75,
      vocabularyHighlights: [
        {
          word: 'your response',
          context: 'You communicated your ideas clearly',
          alternative: 'Keep practicing to expand your vocabulary',
        },
      ],
      fluencyScore: 75,
      fluencyNotes: 'Good effort in expressing your thoughts',
      pronunciationIssues: [],
      overallScore: 75,
      suggestions: [
        'Keep practicing speaking regularly',
        'Try to speak more to build confidence',
        'Focus on expressing your ideas clearly',
      ],
      strengths: [
        'Good effort in responding',
        'You attempted to communicate your thoughts',
      ],
      focusAreas: [
        'Continue regular speaking practice',
        'Work on building vocabulary',
      ],
    };
  }
}
