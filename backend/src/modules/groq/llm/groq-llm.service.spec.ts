import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GroqLlmService } from './groq-llm.service';

describe('GroqLlmService', () => {
  let service: GroqLlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroqLlmService,
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

    service = module.get<GroqLlmService>(GroqLlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
