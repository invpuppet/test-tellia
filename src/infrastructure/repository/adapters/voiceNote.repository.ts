import { Injectable } from '@nestjs/common';
import { VoiceNoteEntry } from '../../../domain/models/voiceNote.model';
import * as fs from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'voice-notes.json');

@Injectable()
export default class VoiceNoteJsonRepository {
  private read(): VoiceNoteEntry[] {
    if (!fs.existsSync(DB_PATH)) return [];

    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  }

  private write(entries: VoiceNoteEntry[]): void {
    fs.mkdirSync(join(process.cwd(), 'data'), { recursive: true });

    fs.writeFileSync(DB_PATH, JSON.stringify(entries, null, 2), 'utf-8');
  }

  public save(entry: VoiceNoteEntry): void {
    const entries = this.read();
    entries.push(entry);
    this.write(entries);
  }

  public findAll(): VoiceNoteEntry[] {
    return this.read();
  }
}
