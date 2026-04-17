import DownloaderAdapter from '../audioDownload.adapter';
import {
  RAW_AUDIO_URL,
  RAW_MISSING_AUDIO_URL,
} from '../../../../domain/models/fixture/voiceNoteCommand.fixture';

describe('DownloaderAdapter', () => {
  let adapter: DownloaderAdapter;

  beforeEach(() => {
    adapter = new DownloaderAdapter();
    jest.restoreAllMocks();
  });

  it('should download and return an audio File', async () => {
    const arrayBuffer = new TextEncoder().encode('audio-content').buffer;
    const arrayBufferMock = jest.fn(() => Promise.resolve(arrayBuffer));

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      statusText: 'OK',
      arrayBuffer: arrayBufferMock,
      headers: {
        get: jest.fn().mockReturnValue('audio/wav'),
      },
    } as unknown as Response);

    const result = await adapter.download(RAW_AUDIO_URL);

    expect(result).toBeInstanceOf(File);
    expect(result.type).toBe('audio/wav');
    expect(result.name).toBe('audio.wav');
  });

  it('should use filename from content-disposition header when present', async () => {
    const arrayBuffer = new TextEncoder().encode('audio-content').buffer;
    const arrayBufferMock = jest.fn(() => Promise.resolve(arrayBuffer));

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      statusText: 'OK',
      arrayBuffer: arrayBufferMock,
      headers: {
        get: jest.fn((name: string) => {
          if (name === 'content-type') return 'audio/mpeg';
          if (name === 'content-disposition') {
            return 'attachment; filename="voice-note.mp3"';
          }
          return null;
        }),
      },
    } as unknown as Response);

    const result = await adapter.download(
      'https://example.com/recordings/random',
    );

    expect(result.type).toBe('audio/mpeg');
    expect(result.name).toBe('voice-note.mp3');
  });

  it('should fallback to filename from URL pathname when content-disposition is missing', async () => {
    const arrayBuffer = new TextEncoder().encode('audio-content').buffer;
    const arrayBufferMock = jest.fn(() => Promise.resolve(arrayBuffer));

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      statusText: 'OK',
      arrayBuffer: arrayBufferMock,
      headers: {
        get: jest.fn((name: string) => {
          if (name === 'content-type') return 'audio/ogg';
          return null;
        }),
      },
    } as unknown as Response);

    const result = await adapter.download(
      'https://example.com/files/captured-note.ogg',
    );

    expect(result.type).toBe('audio/ogg');
    expect(result.name).toBe('captured-note.ogg');
  });

  it('should fallback to audio.wav when URL has no filename', async () => {
    const arrayBuffer = new TextEncoder().encode('audio-content').buffer;
    const arrayBufferMock = jest.fn(() => Promise.resolve(arrayBuffer));

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      statusText: 'OK',
      arrayBuffer: arrayBufferMock,
      headers: {
        get: jest.fn().mockReturnValue(null),
      },
    } as unknown as Response);

    const result = await adapter.download('https://example.com/audio/');

    expect(result.type).toBe('audio/wav');
    expect(result.name).toBe('audio.wav');
  });

  it('should throw when fetch is not ok', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    } as Response);

    await expect(adapter.download(RAW_MISSING_AUDIO_URL)).rejects.toThrow(
      'Failed to download audio: Not Found',
    );
  });
});
