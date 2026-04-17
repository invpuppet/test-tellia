import { Module } from '@nestjs/common';
import { TRANSCRIPTION_PORT } from '../../domain/ports/transcription.port';
import TranscriptionAdapter from './adapter/transcription.adapter';

@Module({
  providers: [
    {
      provide: TRANSCRIPTION_PORT,
      useClass: TranscriptionAdapter,
    },
  ],
  exports: [TRANSCRIPTION_PORT],
})
export default class TranscriptionModule {}
