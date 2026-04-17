import { Module } from '@nestjs/common';
import TranscriptionModule from './transcription/transcription.module';
import AudioDowloadModule from './audioDownload/audioDownload.module';
import StructuringModule from './structuring/structuring.module';
import GroqModule from './groq/groq.module';

@Module({
  imports: [
    GroqModule,
    TranscriptionModule,
    AudioDowloadModule,
    StructuringModule,
  ],
  exports: [
    GroqModule,
    TranscriptionModule,
    AudioDowloadModule,
    StructuringModule,
  ],
})
export default class InfrastructureModule {}
