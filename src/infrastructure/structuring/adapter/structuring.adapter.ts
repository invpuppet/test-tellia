import { Inject, Injectable } from '@nestjs/common';
import { StructuringPort } from '../../../domain/ports/structuring.port';
import Groq from 'groq-sdk';
import { GROQ_CLIENT } from '../../groq/groq.constants';

const SYSTEM_PROMPT = `
You are an information extraction assistant.
Given a voice note transcript, extract and structure the information as JSON.

Rules:
- Always include a "type" field (task, observation, reminder, note, scheduling, or any relevant type you infer)
- Nest related fields under an "entities" object
- If a date or time is mentioned, normalize it to ISO 8601 in a "scheduledTime" field
- Return ONLY valid JSON, no explanation, no markdown
`;

@Injectable()
export default class StructuringAdapter implements StructuringPort {
  constructor(@Inject(GROQ_CLIENT) private readonly client: Groq) {}

  async structure(transcript: string): Promise<Record<string, unknown>> {
    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcript },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const content = response.choices[0].message.content ?? '{}';

    return JSON.parse(content) as Record<string, unknown>;
  }
}
