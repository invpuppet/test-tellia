import { Module } from '@nestjs/common';
import TranscriptionModule from './transcription/transcription.module';
import AudioDowloadModule from './audioDownload/audioDownload.module';

@Module({
  imports: [TranscriptionModule, AudioDowloadModule],
  exports: [TranscriptionModule, AudioDowloadModule],
})
export default class InfranstructureModule {}
