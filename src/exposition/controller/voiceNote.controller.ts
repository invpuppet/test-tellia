import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import CreateVoiceNoteDto from '../dto/createVoiceNote.dto';
import VoiceNoteService from '../../application/services/voiceNote.service';

@Controller()
@ApiTags('voice-note')
export default class VoiceNoteController {
  constructor(private readonly voiceNoteService: VoiceNoteService) {}

  @Post('voice-note')
  @ApiOperation({ summary: 'Transcribe a voice note' })
  @ApiOkResponse({
    schema: {
      example: {
        transcript:
          'Tomorrow at 9am call the irrigation technician about the pump failure in field 12',
        structuredData: {
          type: 'task',
          entities: {
            location: 'field 12',
          },
        },
      },
    },
  })
  async extractVoiceNote(@Body() dto: CreateVoiceNoteDto) {
    return this.voiceNoteService.transcribeAudio(dto);
  }

  @Get('voice-notes')
  @ApiOperation({ summary: 'Get all voice notes saved' })
  async findall() {
    return await this.voiceNoteService.findAll();
  }
}
