import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';
import * as fs from 'fs/promises';

// Mock fs/promises
jest.mock('fs/promises');

describe('StorageService', () => {
  let service: StorageService;
  let configService: jest.Mocked<ConfigService>;
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'PORT') return '3001';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    configService = module.get(ConfigService);

    // Mock mkdir to prevent actual directory creation
    mockFs.mkdir.mockResolvedValue(undefined);
  });

  describe('uploadAudio', () => {
    it('should upload audio successfully', async () => {
      const mockBuffer = Buffer.from('audio-data');
      const conversationId = 'conv-123';
      const fileName = 'test-audio.mp3';

      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      const result = await service.uploadAudio(
        mockBuffer,
        conversationId,
        fileName,
      );

      expect(result.bucket).toBe('local-filesystem');
      expect(result.key).toContain(conversationId);
      expect(result.key).toContain('test-audio.mp3');
      expect(result.url).toContain('http://localhost:3001/uploads/audio');
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should sanitize file names', async () => {
      const mockBuffer = Buffer.from('audio-data');
      const conversationId = 'conv-123';
      const fileName = 'test audio @#$%.mp3';

      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      const result = await service.uploadAudio(
        mockBuffer,
        conversationId,
        fileName,
      );

      expect(result.key).not.toContain('@');
      expect(result.key).not.toContain('#');
      expect(result.key).not.toContain(' ');
      expect(result.key).toContain('_');
    });

    it('should throw BusinessException on upload failure', async () => {
      const mockBuffer = Buffer.from('audio-data');
      const conversationId = 'conv-123';
      const fileName = 'test.mp3';

      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockRejectedValue(new Error('Disk full'));

      await expect(
        service.uploadAudio(mockBuffer, conversationId, fileName),
      ).rejects.toThrow(BusinessException);
      await expect(
        service.uploadAudio(mockBuffer, conversationId, fileName),
      ).rejects.toMatchObject({
        code: MappedsReturnsEnum.STORAGE_ERROR,
      });
    });
  });

  describe('getPresignedUrl', () => {
    it('should return URL for existing file', async () => {
      const key = 'conv-123/audio.mp3';

      mockFs.access.mockResolvedValue(undefined);

      const result = await service.getPresignedUrl(key);

      expect(result).toContain('http://localhost:3001/uploads/audio');
      expect(result).toContain(key);
    });

    it('should throw error when file not found', async () => {
      const key = 'non-existent/file.mp3';

      mockFs.access.mockRejectedValue(new Error('File not found'));

      await expect(service.getPresignedUrl(key)).rejects.toThrow(
        BusinessException,
      );
      await expect(service.getPresignedUrl(key)).rejects.toMatchObject({
        code: MappedsReturnsEnum.STORAGE_ERROR,
      });
    });
  });

  describe('deleteAudio', () => {
    it('should delete audio file successfully', async () => {
      const key = 'conv-123/audio.mp3';

      mockFs.unlink.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([]);
      mockFs.rmdir.mockResolvedValue(undefined);

      await service.deleteAudio(key);

      expect(mockFs.unlink).toHaveBeenCalled();
    });

    it('should remove empty conversation directory', async () => {
      const key = 'conv-123/audio.mp3';

      mockFs.unlink.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([]);
      mockFs.rmdir.mockResolvedValue(undefined);

      await service.deleteAudio(key);

      expect(mockFs.rmdir).toHaveBeenCalled();
    });

    it('should not remove directory if it has other files', async () => {
      const key = 'conv-123/audio.mp3';

      mockFs.unlink.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue(['other-file.mp3'] as any);

      await service.deleteAudio(key);

      expect(mockFs.rmdir).not.toHaveBeenCalled();
    });

    it('should throw error on delete failure', async () => {
      const key = 'conv-123/audio.mp3';

      mockFs.unlink.mockRejectedValue(new Error('Permission denied'));

      await expect(service.deleteAudio(key)).rejects.toThrow(BusinessException);
      await expect(service.deleteAudio(key)).rejects.toMatchObject({
        code: MappedsReturnsEnum.STORAGE_ERROR,
      });
    });
  });

  describe('validateFileSize', () => {
    it('should return true for valid file size', () => {
      const validSize = 5 * 1024 * 1024; // 5MB
      expect(service.validateFileSize(validSize)).toBe(true);
    });

    it('should return false for file size exceeding limit', () => {
      const invalidSize = 15 * 1024 * 1024; // 15MB (max is 10MB)
      expect(service.validateFileSize(invalidSize)).toBe(false);
    });

    it('should return true for file at exactly max size', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      expect(service.validateFileSize(maxSize)).toBe(true);
    });
  });

  describe('validateAudioFile', () => {
    it('should return true for valid audio extensions', () => {
      expect(service.validateAudioFile('audio.mp3')).toBe(true);
      expect(service.validateAudioFile('audio.wav')).toBe(true);
      expect(service.validateAudioFile('audio.ogg')).toBe(true);
      expect(service.validateAudioFile('audio.webm')).toBe(true);
      expect(service.validateAudioFile('audio.m4a')).toBe(true);
    });

    it('should return false for invalid extensions', () => {
      expect(service.validateAudioFile('video.mp4')).toBe(false);
      expect(service.validateAudioFile('document.pdf')).toBe(false);
      expect(service.validateAudioFile('image.jpg')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(service.validateAudioFile('audio.MP3')).toBe(true);
      expect(service.validateAudioFile('audio.WAV')).toBe(true);
    });

    it('should return false for files without extension', () => {
      expect(service.validateAudioFile('audiofile')).toBe(false);
    });
  });

  describe('listConversationFiles', () => {
    it('should list all files for a conversation', async () => {
      const conversationId = 'conv-123';
      const mockFiles = ['audio1.mp3', 'audio2.mp3'];

      mockFs.readdir.mockResolvedValue(mockFiles as any);

      const result = await service.listConversationFiles(conversationId);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('conv-123/audio1.mp3');
      expect(result[1]).toBe('conv-123/audio2.mp3');
    });

    it('should return empty array when directory not found', async () => {
      const conversationId = 'conv-123';

      mockFs.readdir.mockRejectedValue(new Error('Directory not found'));

      const result = await service.listConversationFiles(conversationId);

      expect(result).toHaveLength(0);
    });

    it('should return empty array when no files exist', async () => {
      const conversationId = 'conv-123';

      mockFs.readdir.mockResolvedValue([] as any);

      const result = await service.listConversationFiles(conversationId);

      expect(result).toHaveLength(0);
    });
  });
});
