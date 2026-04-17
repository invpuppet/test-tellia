import { Injectable } from '@nestjs/common';
import { AudioDowloadPort } from '../../../domain/ports/audioDownload.port';

@Injectable()
export default class DownloaderAdapter implements AudioDowloadPort {
  async download(audioUrl: string): Promise<File> {
    const response = await fetch(audioUrl);

    if (!response.ok)
      throw new Error(`Failed to download audio: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') ?? 'audio/wav';
    const filename = this.extractFileName(response, audioUrl);

    return new File([buffer], filename, { type: contentType });
  }

  private extractFileName(response: Response, audioUrl: string): string {
    const disposition = response.headers.get('content-disposition');
    if (disposition) {
      const match = disposition.match(
        /filename[^;=\n]*=(?:(\\?['"])(.*?)\1|([^;\n]*))/i,
      );
      if (match) return match[2] ?? match[3];
    }

    const urlFilename = new URL(audioUrl).pathname.split('/').pop();
    if (urlFilename) return urlFilename;

    return 'audio.wav';
  }
}
