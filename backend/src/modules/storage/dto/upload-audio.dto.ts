import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UploadAudioDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;
}

export class UploadResponseDto {
  url: string;
  key: string;
  bucket: string;
}

export class GetPresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
