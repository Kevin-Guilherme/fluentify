import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    // Local storage directory: backend/uploads/audio/
    this.uploadDir = path.join(process.cwd(), 'uploads', 'audio');

    // Base URL for accessing files (e.g., http://localhost:3001/uploads/audio/)
    const port = this.configService.get<string>('PORT') || '3001';
    this.baseUrl = `http://localhost:${port}/uploads/audio`;

    // Create directory structure on startup
    this.initializeStorage();

    this.logger.log('LocalStorageService initialized (DEV mode)');
    this.logger.log(`Upload directory: ${this.uploadDir}`);
    this.logger.log(`Base URL: ${this.baseUrl}`);
  }

  /**
   * Initialize local storage directory
   */
  private async initializeStorage() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      this.logger.log('Upload directory created/verified');
    } catch (error) {
      this.logger.error('Failed to create upload directory', error);
    }
  }

  /**
   * Upload audio file to local filesystem
   * @param file Buffer with audio data
   * @param conversationId ID of the conversation
   * @param fileName Original file name
   * @returns Object with URL, key, and bucket
   */
  async uploadAudio(
    file: Buffer,
    conversationId: string,
    fileName: string,
  ): Promise<{ url: string; key: string; bucket: string }> {
    try {
      // Generate unique key: audio/{conversationId}/{timestamp}-{fileName}
      const timestamp = Date.now();
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `${conversationId}/${timestamp}-${sanitizedFileName}`;

      // Create conversation directory
      const conversationDir = path.join(this.uploadDir, conversationId);
      await fs.mkdir(conversationDir, { recursive: true });

      // Save file
      const filePath = path.join(this.uploadDir, key);
      await fs.writeFile(filePath, file);

      // Generate URL
      const url = `${this.baseUrl}/${key}`;

      this.logger.log(`Audio uploaded successfully: ${key}`);

      return {
        url,
        key,
        bucket: 'local-filesystem',
      };
    } catch (error) {
      this.logger.error('Failed to upload audio', error);
      throw new BusinessException(
        MappedsReturnsEnum.STORAGE_ERROR,
        'Failed to upload audio file',
      );
    }
  }

  /**
   * Get presigned URL for accessing a file
   * For local storage, just returns the public URL (no expiration)
   * @param key File key
   * @param expiresIn Not used in local storage
   * @returns Public URL
   */
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      // Check if file exists
      const filePath = path.join(this.uploadDir, key);
      await fs.access(filePath);

      const url = `${this.baseUrl}/${key}`;
      this.logger.log(`URL generated for: ${key}`);

      return url;
    } catch (error) {
      this.logger.error('File not found', error);
      throw new BusinessException(
        MappedsReturnsEnum.STORAGE_ERROR,
        'File not found',
      );
    }
  }

  /**
   * Delete audio file from local filesystem
   * @param key File key
   */
  async deleteAudio(key: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, key);
      await fs.unlink(filePath);

      this.logger.log(`Audio deleted successfully: ${key}`);

      // Try to remove empty conversation directory
      const conversationId = key.split('/')[0];
      const conversationDir = path.join(this.uploadDir, conversationId);
      try {
        const files = await fs.readdir(conversationDir);
        if (files.length === 0) {
          await fs.rmdir(conversationDir);
          this.logger.log(`Empty directory removed: ${conversationId}`);
        }
      } catch (err) {
        // Ignore if directory is not empty or doesn't exist
      }
    } catch (error) {
      this.logger.error('Failed to delete audio', error);
      throw new BusinessException(
        MappedsReturnsEnum.STORAGE_ERROR,
        'Failed to delete audio file',
      );
    }
  }

  /**
   * Get content type based on file extension
   */
  private getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();

    const contentTypes: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      webm: 'audio/webm',
      m4a: 'audio/mp4',
    };

    return contentTypes[ext || ''] || 'audio/mpeg';
  }

  /**
   * Validate file size (max 10MB for audio)
   */
  validateFileSize(fileSize: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return fileSize <= maxSize;
  }

  /**
   * Validate audio file extension
   */
  validateAudioFile(fileName: string): boolean {
    const validExtensions = ['mp3', 'wav', 'ogg', 'webm', 'm4a'];
    const ext = fileName.split('.').pop()?.toLowerCase();
    return validExtensions.includes(ext || '');
  }

  /**
   * Get local file path (useful for direct file access)
   */
  getFilePath(key: string): string {
    return path.join(this.uploadDir, key);
  }

  /**
   * List all files for a conversation
   */
  async listConversationFiles(conversationId: string): Promise<string[]> {
    try {
      const conversationDir = path.join(this.uploadDir, conversationId);
      const files = await fs.readdir(conversationDir);
      return files.map((file) => `${conversationId}/${file}`);
    } catch (error) {
      this.logger.error('Failed to list files', error);
      return [];
    }
  }
}
