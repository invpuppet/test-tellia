export const TRANSCRIPTION_PORT = Symbol('TranscriptionPort');

export abstract class TranscriptionPort {
  abstract transcribe(audioFile: File): Promise<string>;
}
