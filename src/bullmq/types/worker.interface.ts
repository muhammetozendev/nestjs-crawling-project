import { Job } from 'bullmq';
import { QueueEnum } from '../enums/queue.enum';

export interface IWorker<T = any> {
  readonly queueName: QueueEnum;

  consume(job: Job<T>): Promise<any>;
}
