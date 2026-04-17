import { Test, TestingModule } from '@nestjs/testing';
import VoiceNoteService from '../voiceNote.service';
import { AUDIO_DOWNLOAD_PORT } from '../../../domain/ports/audioDownload.port';
import { TRANSCRIPTION_PORT } from '../../../domain/ports/transcription.port';
import { STRUCTURING_PORT } from '../../../domain/ports/structuring.port';
import {
  RAW_AUDIO_CONTENT,
  VoiceNoteCommandFixture,
} from '../../../domain/models/fixture/voiceNoteCommand.fixture';
import { VoiceNoteResultFixture } from '../../../domain/models/fixture/voiceNoteResult.fixture';

describe('VoiceNoteService', () => {
  let service: VoiceNoteService;

  const downloadMock = jest.fn<Promise<File>, [string]>();
  const transcribeMock = jest.fn<Promise<string>, [File]>();
  const structureMock = jest.fn<Promise<Record<string, unknown>>, [string]>();

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
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

    service = moduleRef.get(VoiceNoteService);
  });

  it('should transcribe and structure an audio note', async () => {
    const command = VoiceNoteCommandFixture.voiceNoteCommand();
    const fakeFile = VoiceNoteCommandFixture.audioFile({
      content: RAW_AUDIO_CONTENT,
    });
    const transcript = VoiceNoteResultFixture.transcript('Transcript text');
    const structuredData = VoiceNoteResultFixture.structuredData({
      type: 'task',
    });

    downloadMock.mockResolvedValue(fakeFile);
    transcribeMock.mockResolvedValue(transcript);
    structureMock.mockResolvedValue(structuredData);

    const result = await service.transcribeAudio(command);

    expect(downloadMock).toHaveBeenCalledWith(command.audioUrl);
    expect(transcribeMock).toHaveBeenCalledWith(fakeFile);
    expect(structureMock).toHaveBeenCalledWith(transcript);
    expect(result).toEqual({
      transcript,
      structuredData,
    });
  });
});
