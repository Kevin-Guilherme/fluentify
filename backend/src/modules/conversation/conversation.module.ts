import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { GroqModule } from '../groq/groq.module';
import { XpCalculatorService } from '../gamification/xp-calculator.service';

@Module({
  imports: [PrismaModule, GroqModule],
  controllers: [ConversationController],
  providers: [ConversationService, XpCalculatorService],
  exports: [ConversationService],
})
export class ConversationModule {}
