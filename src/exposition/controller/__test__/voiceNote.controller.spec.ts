import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import VoiceNoteController from '../voiceNote.controller';
import VoiceNoteService from '../../../application/services/voiceNote.service';
import { AUDIO_DOWNLOAD_PORT } from '../../../domain/ports/audioDownload.port';
import { TRANSCRIPTION_PORT } from '../../../domain/ports/transcription.port';
import { STRUCTURING_PORT } from '../../../domain/ports/structuring.port';
import {
  RAW_AUDIO_CONTENT,
  VoiceNoteCommandFixture,
} from '../../../domain/models/fixture/voiceNoteCommand.fixture';
import { VoiceNoteResultFixture } from '../../../domain/models/fixture/voiceNoteResult.fixture';
import { VoiceNoteCommand } from '../../../domain/models/voiceNote.model';

describe('VoiceNoteController (integration)', () => {
  let app: INestApplication;

  const downloadMock = jest.fn<Promise<File>, [string]>();
  const transcribeMock = jest.fn<Promise<string>, [File]>();
  const structureMock = jest.fn<Promise<Record<string, unknown>>, [string]>();

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [VoiceNoteController],
      providers: [
        VoiceNoteService,
        { provide: AUDIO_DOWNLOAD_PORT, useValue: { download: downloadMock } },
        {
          provide: TRANSCRIPTION_PORT,
          useValue: { transcribe: transcribeMock },
        },
        { provide: STRUCTURING_PORT, useValue: { structure: structureMock } },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /voice-note should return transcript and structured data', async () => {
    const fakeFile = VoiceNoteCommandFixture.audioFile({
      content: RAW_AUDIO_CONTENT,
    });
    const transcript = VoiceNoteResultFixture.transcript();
    const structuredData = VoiceNoteResultFixture.structuredData();

    downloadMock.mockResolvedValue(fakeFile);
    transcribeMock.mockResolvedValue(transcript);
    structureMock.mockResolvedValue(structuredData);

    const payload: VoiceNoteCommand =
      VoiceNoteCommandFixture.validVoiceNotePayload();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const response = await request(httpServer)
      .post('/voice-note')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      transcript,
      structuredData,
    });

    expect(downloadMock.mock.calls[0]?.[0]).toBe(payload.audioUrl);
  });

  it('POST /voice-note should fail with invalid payload', async () => {
    const payload = {
      deviceId: 123,
      timestamp: 'not-a-date',
      audioUrl: 'invalid-url',
    };
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer)
      .post('/voice-note')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(400);
  });
});
