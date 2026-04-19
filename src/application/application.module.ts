import { Logger, Module } from '@nestjs/common';
import VoiceNoteService from './services/voiceNote.service';
import InfrastructureModule from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [VoiceNoteService, Logger],
  exports: [VoiceNoteService],
})
export default class ApplicationModule {}
