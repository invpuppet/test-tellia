import { VoiceNoteResult } from '../voiceNote.model';
import { RAW_DEVICE_ID, RAW_TIMESTAMP } from './voiceNoteCommand.fixture';

// Donnees brutes pour VoiceNoteResult.
export const RAW_TRANSCRIPT = 'Buy seeds tomorrow morning';
export const RAW_STRUCTURED_DATA = {
  type: 'task',
  entities: {
    action: 'buy seeds',
    deviceId: RAW_DEVICE_ID,
    timestamp: RAW_TIMESTAMP,
  },
} as const;

export class VoiceNoteResultFixture {
  static transcript(value = RAW_TRANSCRIPT): string {
    return value;
  }

  static structuredData(
    overrides: Record<string, unknown> = {},
  ): VoiceNoteResult['structuredData'] {
    const base = {
      ...RAW_STRUCTURED_DATA,
      entities: { ...RAW_STRUCTURED_DATA.entities },
    };

    return {
      ...base,
      ...overrides,
    };
  }

  static voiceNoteResult(
    overrides: Partial<VoiceNoteResult> = {},
  ): VoiceNoteResult {
    return {
      transcript: this.transcript(),
      structuredData: this.structuredData(),
      ...overrides,
    };
  }
}
