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
  VoiceNoteEntry,
  VoiceNoteResult,
} from '../../domain/models/voiceNote.model';
import {
  STRUCTURING_PORT,
  StructuringPort,
} from '../../domain/ports/structuring.port';
import {
  VOICE_NOTE_REPOSITORY_PORT,
  VoiceNoteRepositoryPort,
} from '../../domain/ports/voiceNote.repository.port';
import { randomUUID } from 'crypto';

@Injectable()
export default class VoiceNoteService {
  constructor(
    @Inject(TRANSCRIPTION_PORT)
    private readonly transcription: TranscriptionPort,
    @Inject(AUDIO_DOWNLOAD_PORT)
    private readonly audioDownloader: AudioDowloadPort,
    @Inject(STRUCTURING_PORT)
    private readonly structuring: StructuringPort,
    @Inject(VOICE_NOTE_REPOSITORY_PORT)
    private readonly repository: VoiceNoteRepositoryPort,
  ) {}

  async transcribeAudio(command: VoiceNoteCommand): Promise<VoiceNoteResult> {
    const audioFile = await this.audioDownloader.download(command.audioUrl);
    const transcript = await this.transcription.transcribe(audioFile);
    const structuredData = await this.structuring.structure(transcript);

    this.repository.save({
      id: randomUUID(),
      deviceId: command.deviceId,
      timestamp: command.timestamp,
      transcript,
      structured: structuredData,
      createdAt: new Date().toISOString(),
    });

    return { transcript, structuredData };
  }

  async findAll(): Promise<VoiceNoteEntry[]> {
    return this.repository.findAll();
  }
}
