export const STRUCTURING_PORT = 'STRUCTURING_PORT';

export abstract class StructuringPort {
  abstract structure(transcript: string): Promise<Record<string, unknown>>;
}
