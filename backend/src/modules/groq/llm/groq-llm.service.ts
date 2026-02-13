import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../../shared/enums/mapped-returns.enum';
import {
  buildConversationPrompt,
  UserLevel,
} from '../prompts/conversation.prompt';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class GroqLlmService {
  private readonly logger = new Logger(GroqLlmService.name);
  private readonly groq: Groq;

  constructor(private config: ConfigService) {
    const apiKey = config.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }
    this.groq = new Groq({ apiKey });
  }

  /**
   * Gera resposta da IA em uma conversação com system prompt por nível
   */
  async generateResponse(
    conversationHistory: Message[],
    userLevel: UserLevel,
    topic: string,
    userName?: string,
  ): Promise<string> {
    return this.retryWithBackoff(async () => {
      // Construir system prompt baseado no nível do usuário
      const systemPrompt = buildConversationPrompt(userLevel, topic, userName);

      const messageList: Message[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
      ];

      this.logger.log(
        `Generating LLM response for ${userLevel} level on topic: ${topic}`,
      );

      const chatCompletion = await this.groq.chat.completions.create({
        messages: messageList,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 150, // Respostas curtas (50 palavras ~= 75 tokens)
        top_p: 1,
        frequency_penalty: 0.2, // Evitar repetição de palavras
        presence_penalty: 0.1, // Incentivar novos tópicos
      });

      const response = chatCompletion.choices[0]?.message?.content || '';

      if (!response) {
        throw new Error('Empty response from Groq LLM');
      }

      this.logger.log('LLM response generated successfully');
      return response;
    });
  }

  /**
   * Retry logic com backoff exponencial para rate limiting
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        const isRateLimitError =
          error?.status === 429 ||
          error?.message?.toLowerCase().includes('rate limit');

        if (isRateLimitError && attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          this.logger.warn(
            `Rate limited (429), retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`,
          );
          await this.delay(delay);
        } else if (attempt === maxRetries || !isRateLimitError) {
          this.logger.error('LLM generation failed', error);
          throw new BusinessException(
            MappedsReturnsEnum.GROQ_API_ERROR,
            'Failed to generate response',
          );
        }
      }
    }

    throw new BusinessException(
      MappedsReturnsEnum.GROQ_API_ERROR,
      'Max retries exceeded',
    );
  }

  /**
   * Helper: delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
