import { Inject, Injectable, Logger } from '@nestjs/common';
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
    private readonly logger: Logger,
  ) {}

  async transcribeAudio(command: VoiceNoteCommand): Promise<VoiceNoteResult> {
    const id = randomUUID();
    this.logger.log(
      `Proccessing voice note | id=${id} deviceId=${command.deviceId}`,
    );

    this.logger.debug(`Downloading audio | url=${command.audioUrl}`);
    let audioFile: File;
    try {
      audioFile = await this.audioDownloader.download(command.audioUrl);
      this.logger.log(`Audio downloaded`);
    } catch (error) {
      this.logger.error(
        `Failed to download audio | url=${command.audioUrl}`,
        String(error),
      );
      throw error;
    }

    this.logger.debug(`Starting transcription | filename=${audioFile.name}`);
    let transcript: string;
    try {
      transcript = await this.transcription.transcribe(audioFile);
      this.logger.log(`Transcription completed | filename=${audioFile.name}`);
    } catch (error) {
      this.logger.error(
        `Transcription failed | filename=${audioFile.name}`,
        String(error),
      );
      throw error;
    }

    let structuredData: Record<string, unknown>;

    this.logger.debug(`Structuring transcript`);
    try {
      structuredData = await this.structuring.structure(transcript);
      this.logger.log(`Structuring complete | type=${structuredData['type']}`);
    } catch (error) {
      this.logger.error('Structuring failed', String(error));
      throw error;
    }

    this.logger.debug(`Saving voice note | id=${id}`);
    try {
      this.repository.save({
        id,
        deviceId: command.deviceId,
        timestamp: command.timestamp,
        transcript,
        structured: structuredData,
        createdAt: new Date().toISOString(),
      });
      this.logger.log(`Voice note saved | id=${id}`);
    } catch (error) {
      this.logger.error(`Failed to save voice note | id=${id}`, String(error));
      throw error;
    }

    this.logger.log(`Processing voice note complete | id=${id}`);
    return { transcript, structuredData };
  }

  async findAll(): Promise<VoiceNoteEntry[]> {
    return this.repository.findAll();
  }
}
