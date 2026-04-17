export interface VoiceNoteCommand {
  deviceId: string;
  timestamp: string;
  audioUrl: string;
}

export interface VoiceNoteResult {
  transcript: string;
  structuredData: Record<string, unknown>;
}
