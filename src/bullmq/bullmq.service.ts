import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobsOptions, Queue, Worker } from 'bullmq';
import { QueueEnum } from 'src/bullmq/enums/queue.enum';
import { IWorker } from './types/worker.interface';
import { JobEnum } from './enums/job.enum';

@Injectable()
export class BullmqService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private readonly queues: Map<QueueEnum, Queue> = new Map();
  private readonly workers: Map<QueueEnum, Worker> = new Map();

  onModuleInit() {
    // Register all the queues
    this.registerQueue(QueueEnum.CRAWLER);
  }

  registerQueue(name: QueueEnum): void {
    // Register a signle queue
    const queue = new Queue(name, {
      connection: {
        host: this.configService.get('REDIS_HOST'),
        port: this.configService.get('REDIS_PORT'),
        password: this.configService.get('REDIS_PASS'),
      },
    });
    this.queues.set(name, queue);
  }

  getQueue(name: QueueEnum): Queue {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue ${name} not found`);
    }
    return queue;
  }

  async addJobToQueue<T>(
    queueName: QueueEnum,
    jobName: JobEnum,
    job: T,
    opts: JobsOptions = {
      attempts: +this.configService.get('MAX_RETRY_COUNT', 1),
      backoff: +this.configService.get('BACKOFF_DURATION', 5000),
    },
  ) {
    return await this.getQueue(queueName).add(jobName, job, opts);
  }

  registerWorker(worker: IWorker) {
    // Check if queue exists
    const queue = this.queues.get(worker.queueName);
    if (!queue) {
      throw new Error(`Queue ${worker.queueName} not found`);
    }

    // Check if worker is already registered
    if (this.workers.get(worker.queueName)) {
      throw new Error(`Worker ${worker.queueName} already registered`);
    }

    // Register the worker
    const workerInstance = new Worker(
      worker.queueName,
      async (job) => {
        await worker.consume(job);
      },
      {
        connection: {
          host: this.configService.get('REDIS_HOST'),
          port: this.configService.get('REDIS_PORT'),
          password: this.configService.get('REDIS_PASS'),
        },
        limiter: {
          max: +this.configService.get('MAX_CONCURRENT_JOBS'),
          duration: +this.configService.get('MAX_CONCURRENT_JOBS_DURATION'),
        },
      },
    );
    this.workers.set(worker.queueName, workerInstance);
  }
}
