import { Module } from '@nestjs/common';
import { STRUCTURING_PORT } from '../../domain/ports/structuring.port';
import StructuringAdapter from './adapter/structuring.adapter';

@Module({
  providers: [
    {
      provide: STRUCTURING_PORT,
      useClass: StructuringAdapter,
    },
  ],
  exports: [STRUCTURING_PORT],
})
export default class StructuringModule {}
