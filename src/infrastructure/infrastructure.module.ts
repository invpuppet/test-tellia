import { Module } from '@nestjs/common';
import TranscriptionModule from './transcription/transcription.module';
import AudioDowloadModule from './audioDownload/audioDownload.module';
import StructuringModule from './structuring/structuring.module';
import GroqModule from './groq/groq.module';
import RepositoryModule from './repository/repository.module';

@Module({
  imports: [
    GroqModule,
    TranscriptionModule,
    AudioDowloadModule,
    StructuringModule,
    RepositoryModule,
  ],
  exports: [
    GroqModule,
    TranscriptionModule,
    AudioDowloadModule,
    StructuringModule,
    RepositoryModule,
  ],
})
export default class InfrastructureModule {}
