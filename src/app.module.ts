import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import VoiceNoteController from './exposition/controller/voiceNote.controller';
import ApplicationModule from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ApplicationModule,
    
  ],
  controllers: [VoiceNoteController],
  providers: [],
})
export class AppModule {}
