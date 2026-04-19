export interface VoiceNoteCommand {
  deviceId: string;
  timestamp: string;
  audioUrl: string;
}

export interface VoiceNoteResult {
  transcript: string;
  structuredData: Record<string, unknown>;
}

export interface VoiceNoteEntry {
  id: string;
  deviceId: string;
  timestamp: string;
  transcript: string;
  structured: Record<string, unknown>;
  createdAt: string;
}
