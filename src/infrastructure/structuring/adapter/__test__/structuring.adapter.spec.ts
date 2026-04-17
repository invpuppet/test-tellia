import StructuringAdapter from '../structuring.adapter';
import {
  RAW_STRUCTURED_DATA,
  RAW_TRANSCRIPT,
  VoiceNoteResultFixture,
} from '../../../../domain/models/fixture/voiceNoteResult.fixture';
import type Groq from 'groq-sdk';

const createCompletionMock = jest.fn<
  Promise<{ choices: Array<{ message: { content: string } }> }>,
  [unknown]
>();

describe('StructuringAdapter', () => {
  let adapter: StructuringAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    const groqClientMock = {
      chat: {
        completions: {
          create: createCompletionMock,
        },
      },
    } as unknown as Groq;

    adapter = new StructuringAdapter(groqClientMock);
  });

  it('should call Groq chat completion and parse JSON output', async () => {
    createCompletionMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify(RAW_STRUCTURED_DATA),
          },
        },
      ],
    });

    const result = await adapter.structure(RAW_TRANSCRIPT);

    expect(createCompletionMock).toHaveBeenCalled();
    expect(result).toEqual(VoiceNoteResultFixture.structuredData());
  });
});
