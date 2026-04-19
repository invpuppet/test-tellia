import { Module } from '@nestjs/common';
import { VOICE_NOTE_REPOSITORY_PORT } from '../../domain/ports/voiceNote.repository.port';
import VoiceNoteJsonRepository from './adapters/voiceNote.repository';

@Module({
  providers: [
    {
      provide: VOICE_NOTE_REPOSITORY_PORT,
      useClass: VoiceNoteJsonRepository,
    },
  ],
  exports: [VOICE_NOTE_REPOSITORY_PORT],
})
export default class RepositoryModule {}
