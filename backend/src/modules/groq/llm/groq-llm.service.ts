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
    try {
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
        max_tokens: 500,
      });

      const response = chatCompletion.choices[0]?.message?.content || '';

      if (!response) {
        throw new Error('Empty response from Groq LLM');
      }

      this.logger.log('LLM response generated successfully');
      return response;
    } catch (error) {
      this.logger.error('LLM generation failed', error);
      throw new BusinessException(
        MappedsReturnsEnum.GROQ_API_ERROR,
        'Failed to generate response',
      );
    }
  }
}
