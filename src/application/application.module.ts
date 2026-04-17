import { Module } from '@nestjs/common';
import VoiceNoteService from './services/voiceNote.service';
import InfranstructureModule from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfranstructureModule],
  providers: [VoiceNoteService],
  exports: [VoiceNoteService],
})
export default class ApplicationModule {}
