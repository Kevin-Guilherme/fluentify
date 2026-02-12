import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../../shared/enums/mapped-returns.enum';

interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
}

@Injectable()
export class GroqSttService {
  private readonly logger = new Logger(GroqSttService.name);
  private readonly groq: Groq;
  private readonly maxRetries = 3;

  constructor(private config: ConfigService) {
    const apiKey = config.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }
    this.groq = new Groq({ apiKey });
  }

  async transcribeAudio(
    buffer: Buffer,
    fileName = 'audio.mp3',
  ): Promise<TranscriptionResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.log(`Transcription attempt ${attempt}/${this.maxRetries}`);

        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        ) as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const file = new File([blob], fileName, { type: 'audio/mpeg' });
        const transcription = await this.groq.audio.transcriptions.create({
          file,
          model: 'whisper-large-v3-turbo',
          language: 'en',
        });

        this.logger.log('Transcription successful');
        return {
          text: transcription.text,
          language: 'en',
          duration: 0,
        };
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `Transcription attempt ${attempt} failed: ${error.message}`,
        );

        if (attempt < this.maxRetries) {
          await this.delay(1000 * attempt);
        }
      }
    }

    this.logger.error('Transcription failed after all retries', lastError);
    throw new BusinessException(
      MappedsReturnsEnum.GROQ_TRANSCRIPTION_FAILED,
      'Failed to transcribe audio',
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
