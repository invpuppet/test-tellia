import TranscriptionAdapter from '../transcription.adapter';
import { RAW_TRANSCRIPT } from '../../../../domain/models/fixture/voiceNoteResult.fixture';
import { VoiceNoteCommandFixture } from '../../../../domain/models/fixture/voiceNoteCommand.fixture';
import type Groq from 'groq-sdk';

const createTranscriptionMock = jest.fn<Promise<string>, [unknown]>();

describe('TranscriptionAdapter', () => {
  let adapter: TranscriptionAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    const groqClientMock = {
      audio: {
        transcriptions: {
          create: createTranscriptionMock,
        },
      },
    } as unknown as Groq;

    adapter = new TranscriptionAdapter(groqClientMock);
  });

  it('should call Groq transcription API and return text', async () => {
    const fakeFile = VoiceNoteCommandFixture.audioFile();
    createTranscriptionMock.mockResolvedValue(RAW_TRANSCRIPT);

    const result = await adapter.transcribe(fakeFile);

    expect(createTranscriptionMock).toHaveBeenCalledWith({
      model: 'whisper-large-v3-turbo',
      file: fakeFile,
      response_format: 'text',
    });
    expect(result).toBe(RAW_TRANSCRIPT);
  });
});
