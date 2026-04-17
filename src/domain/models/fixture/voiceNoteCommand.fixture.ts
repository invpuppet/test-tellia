import { VoiceNoteCommand } from '../voiceNote.model';

// Donnees brutes pour VoiceNoteCommand.
export const RAW_DEVICE_ID = 'device-001';
export const RAW_TIMESTAMP = '2026-03-10T10:30:00Z';
export const RAW_AUDIO_URL = 'https://example.com/audio.wav';
export const RAW_MISSING_AUDIO_URL = 'https://example.com/missing.wav';
export const RAW_AUDIO_FILE_NAME = 'audio.wav';
export const RAW_AUDIO_FILE_TYPE = 'audio/wav';
export const RAW_AUDIO_CONTENT = 'audio-bytes';

export const RAW_INVALID_VOICE_NOTE_PAYLOAD = {
  deviceId: 123,
  timestamp: 'not-a-date',
  audioUrl: 'invalid-url',
};

export class VoiceNoteCommandFixture {
  static voiceNoteCommand(
    overrides: Partial<VoiceNoteCommand> = {},
  ): VoiceNoteCommand {
    return {
      deviceId: RAW_DEVICE_ID,
      timestamp: RAW_TIMESTAMP,
      audioUrl: RAW_AUDIO_URL,
      ...overrides,
    };
  }

  static validVoiceNotePayload(
    overrides: Partial<VoiceNoteCommand> = {},
  ): VoiceNoteCommand {
    return this.voiceNoteCommand(overrides);
  }

  static invalidVoiceNotePayload(): Record<string, unknown> {
    return { ...RAW_INVALID_VOICE_NOTE_PAYLOAD };
  }

  static audioFile(
    overrides: { content?: string; name?: string; type?: string } = {},
  ): File {
    const content = overrides.content ?? RAW_AUDIO_CONTENT;
    const name = overrides.name ?? RAW_AUDIO_FILE_NAME;
    const type = overrides.type ?? RAW_AUDIO_FILE_TYPE;

    return new File([content], name, { type });
  }
}
