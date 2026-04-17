import { Global, Module } from '@nestjs/common';
import Groq from 'groq-sdk';
import { GROQ_CLIENT } from './groq.constants';

@Global()
@Module({
  providers: [
    {
      provide: GROQ_CLIENT,
      useFactory: () => new Groq({ apiKey: process.env.GROQ_API_KEY }),
    },
  ],
  exports: [GROQ_CLIENT],
})
export default class GroqModule {}
