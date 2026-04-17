export const AUDIO_DOWNLOAD_PORT = Symbol('AudioDowloadPort');

export abstract class AudioDowloadPort {
  abstract download(audioUrl: string): Promise<File>;
}
