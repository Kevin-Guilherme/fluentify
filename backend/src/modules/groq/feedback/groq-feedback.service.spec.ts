import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GroqFeedbackService } from './groq-feedback.service';

describe('GroqFeedbackService', () => {
  let service: GroqFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroqFeedbackService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GROQ_API_KEY') return 'test-api-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GroqFeedbackService>(GroqFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
