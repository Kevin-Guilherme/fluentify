import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GroqSttService } from './groq-stt.service';

describe('GroqSttService', () => {
  let service: GroqSttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroqSttService,
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

    service = module.get<GroqSttService>(GroqSttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
