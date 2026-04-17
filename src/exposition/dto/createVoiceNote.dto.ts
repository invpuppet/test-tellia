import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsUrl } from 'class-validator';

export default class CreateVoiceNoteDto {
  @ApiProperty({ example: 'device-001' })
  @IsString()
  deviceId!: string;

  @ApiProperty({ example: '2026-03-10T10:30:00Z' })
  @IsDateString()
  timestamp!: string;

  @ApiProperty({ example: 'https://example.com/audio.wav' })
  @IsUrl({ require_tld: false })
  audioUrl!: string;
}
