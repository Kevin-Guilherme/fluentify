import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import {
  UploadAudioDto,
  UploadResponseDto,
  GetPresignedUrlDto,
} from './dto/upload-audio.dto';
import { BusinessException } from '../../shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '../../shared/enums/mapped-returns.enum';

@ApiTags('storage')
@ApiBearerAuth('JWT')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Upload audio file
   * POST /storage/audio
   */
  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadAudio(
    @CurrentUser('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadAudioDto,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file size
    if (!this.storageService.validateFileSize(file.size)) {
      throw new BusinessException(
        MappedsReturnsEnum.FILE_TOO_LARGE,
        'File size exceeds 10MB limit',
      );
    }

    // Validate audio format
    if (!this.storageService.validateAudioFile(file.originalname)) {
      throw new BusinessException(
        MappedsReturnsEnum.INVALID_AUDIO_FORMAT,
        'Invalid audio format. Supported: mp3, wav, ogg, webm, m4a',
      );
    }

    // Upload to R2
    const result = await this.storageService.uploadAudio(
      file.buffer,
      uploadDto.conversationId,
      file.originalname,
    );

    return result;
  }

  /**
   * Get presigned URL for file access
   * POST /storage/presigned-url
   */
  @Post('presigned-url')
  async getPresignedUrl(
    @CurrentUser('userId') userId: string,
    @Body() dto: GetPresignedUrlDto,
  ): Promise<{ url: string }> {
    const url = await this.storageService.getPresignedUrl(dto.key);
    return { url };
  }

  /**
   * Delete audio file
   * DELETE /storage/audio/:key
   */
  @Delete('audio/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAudio(
    @CurrentUser('userId') userId: string,
    @Param('key') key: string,
  ): Promise<void> {
    // Decode key from URL encoding
    const decodedKey = decodeURIComponent(key);
    await this.storageService.deleteAudio(decodedKey);
  }
}
