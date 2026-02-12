import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GroqSttService } from './stt/groq-stt.service';
import { GroqLlmService } from './llm/groq-llm.service';
import { GroqFeedbackService } from './feedback/groq-feedback.service';

@Module({
  imports: [ConfigModule],
  providers: [GroqSttService, GroqLlmService, GroqFeedbackService],
  exports: [GroqSttService, GroqLlmService, GroqFeedbackService],
})
export class GroqModule {}
