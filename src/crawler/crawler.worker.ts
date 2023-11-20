import { QueueEnum } from '../bullmq/enums/queue.enum';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Job } from 'bullmq';
import { CrawlerEnum } from './enums/crawler.enum';
import { PuppeteerCrawler } from './crawlers/puppeteer.crawler';
import { CheerioCrawler } from './crawlers/cheerio.crawler';
import { CrawlerOutput } from './types/crawler-output.interface';
import { BullmqService } from 'src/bullmq/bullmq.service';
import { IWorker } from 'src/bullmq/types/worker.interface';
import { CrawlDto } from './dto/crawl.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { EntityManager } from 'typeorm';
import { Url } from './entities/url.entity';
import { UrlTypeEnum } from './enums/url-type.enum';

@Injectable()
export class CrawlerWorker implements OnModuleInit, IWorker<CrawlDto> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly bullmqService: BullmqService,
    private readonly puppeteerCrawler: PuppeteerCrawler,
    private readonly cheerioCrawler: CheerioCrawler,
  ) {}

  queueName = QueueEnum.CRAWLER;

  onModuleInit() {
    this.bullmqService.registerWorker(this);
  }

  async consume(job: Job<CrawlDto>): Promise<any> {
    console.log('Processing job:', job.id);
    console.log('Job name:', job.name);

    let output: CrawlerOutput;

    if (job.data.crawler === CrawlerEnum.PUPPETEER) {
      output = await this.puppeteerCrawler.crawl(job.data);
    } else if (job.data.crawler === CrawlerEnum.CHEERIO) {
      output = await this.cheerioCrawler.crawl(job.data, {
        protocol: 'socks5',
        host: '3.70.224.16',
        port: 4000,
        username: 'soksproxy',
        password: 'password',
      });
    }
    await job.updateProgress(100);

    if (!output) {
      // Should never happen
      throw new InternalServerErrorException('No crawler was run');
    }

    // Save the results in a transaction
    await this.entityManager.transaction(async (manager) => {
      const result = await manager.save(
        Result,
        {
          title: output.title,
          description: output.description,
          favicon: output.favicon,
          jobId: job.id,
        },
        { transaction: false }, // Prevent nested transaction
      );

      const urls = [];

      // Script urls
      urls.push(
        ...output.scriptUrls.map((url) => ({
          url: url,
          type: UrlTypeEnum.SCRIPT,
          result: { id: result.id },
        })),
      );

      // Stylesheet urls
      urls.push(
        ...output.stylesheetUrls.map((url) => ({
          url: url,
          type: UrlTypeEnum.STYLESHEET,
          result: { id: result.id },
        })),
      );

      // Image urls
      urls.push(
        ...output.imageUrls.map((url) => ({
          url: url,
          type: UrlTypeEnum.IMAGE,
          result: { id: result.id },
        })),
      );

      await manager.save(Url, urls, { transaction: false });
    });

    return output;
  }
}
