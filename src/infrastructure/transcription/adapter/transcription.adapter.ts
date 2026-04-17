import { Inject, Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { TranscriptionPort } from '../../../domain/ports/transcription.port';
import { GROQ_CLIENT } from '../../groq/groq.constants';

@Injectable()
export default class TranscriptionAdapter implements TranscriptionPort {
  constructor(@Inject(GROQ_CLIENT) private readonly client: Groq) {}

  async transcribe(audioFile: File): Promise<string> {
    const transcript = await this.client.audio.transcriptions.create({
      model: 'whisper-large-v3-turbo',
      file: audioFile,
      response_format: 'text',
    });

    return transcript as unknown as string;
  }
}
