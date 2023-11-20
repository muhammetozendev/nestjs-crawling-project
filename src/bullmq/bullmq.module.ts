import { Module } from '@nestjs/common';
import { BullmqService } from './bullmq.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BullmqService],
  exports: [BullmqService],
})
export class BullmqModule {}
