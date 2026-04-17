import { Module } from '@nestjs/common';
import { AUDIO_DOWNLOAD_PORT } from '../../domain/ports/audioDownload.port';
import DownloaderAdapter from './adapter/audioDownload.adapter';

@Module({
  providers: [
    {
      provide: AUDIO_DOWNLOAD_PORT,
      useClass: DownloaderAdapter,
    },
  ],
  exports: [AUDIO_DOWNLOAD_PORT],
})
export default class AudioDowloadModule {}
