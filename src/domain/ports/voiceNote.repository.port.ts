import { VoiceNoteEntry } from '../models/voiceNote.model';

export const VOICE_NOTE_REPOSITORY_PORT = Symbol('VoiceNoteRepositoryPort');

export abstract class VoiceNoteRepositoryPort {
  abstract save(entry: VoiceNoteEntry): void;
  abstract findAll(): VoiceNoteEntry[];
}
