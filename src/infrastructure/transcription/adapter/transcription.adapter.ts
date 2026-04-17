import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { TranscriptionPort } from '../../../domain/ports/transcription.port';

@Injectable()
export default class TranscriptionAdapter implements TranscriptionPort {
  private readonly client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  async transcribe(audioFile: File): Promise<string> {
    const transcript = await this.client.audio.transcriptions.create({
      model: 'whisper-large-v3-turbo',
      file: audioFile,
      response_format: 'text',
    });

    return transcript as unknown as string;
  }
}
