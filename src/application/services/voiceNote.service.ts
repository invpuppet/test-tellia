import { Inject, Injectable } from '@nestjs/common';
import {
  AUDIO_DOWNLOAD_PORT,
  AudioDowloadPort,
} from '../../domain/ports/audioDownload.port';
import {
  TRANSCRIPTION_PORT,
  TranscriptionPort,
} from '../../domain/ports/transcription.port';
import {
  VoiceNoteCommand,
  VoiceNoteResult,
} from '../../domain/models/voiceNote.model';

@Injectable()
export default class VoiceNoteService {
  constructor(
    @Inject(TRANSCRIPTION_PORT)
    private readonly transcription: TranscriptionPort,
    @Inject(AUDIO_DOWNLOAD_PORT)
    private readonly audioDownloader: AudioDowloadPort,
  ) {}

  async transcribeAudio(command: VoiceNoteCommand): Promise<VoiceNoteResult> {
    const audioFile = await this.audioDownloader.download(command.audioUrl);
    const transcript = await this.transcription.transcribe(audioFile);

    return { transcript };
  }
}
