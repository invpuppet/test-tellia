import { Injectable } from '@nestjs/common';
import { AudioDowloadPort } from '../../../domain/ports/audioDownload.port';
import * as fs from 'fs';

@Injectable()
export default class DownloaderAdapter implements AudioDowloadPort {
  async download(audioUrl: string): Promise<File> {
    const response = await fetch(audioUrl);

    if (!response.ok) throw new Error(`Failed to download audio: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    fs.writeFileSync('audio.wav', Buffer.from(buffer));
    const contentType = response.headers.get('content-type') ?? 'audio/wav';
    return new File([buffer], 'audio.wav', { type: contentType });
  }
}
