import { Injectable, NotFoundException } from '@nestjs/common';
import { CrawlDto } from './dto/crawl.dto';
import { BullmqService } from 'src/bullmq/bullmq.service';
import { QueueEnum } from 'src/bullmq/enums/queue.enum';
import { JobEnum } from 'src/bullmq/enums/job.enum';
import { CrawlerEnum } from './enums/crawler.enum';
import { Result } from './entities/result.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlTypeEnum } from './enums/url-type.enum';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    private readonly bullmqService: BullmqService,
  ) {}

  async createCrawlingJob(data: CrawlDto) {
    // Get the job name from the crawler type
    const jobName =
      data.crawler === CrawlerEnum.PUPPETEER
        ? JobEnum.PUPPETEER
        : data.crawler === CrawlerEnum.CHEERIO
        ? JobEnum.CHEERIO
        : null;

    // Add the job to the queue
    const job = await this.bullmqService.addJobToQueue(
      QueueEnum.CRAWLER,
      jobName,
      data,
    );

    return job;
  }

  async getJobs(limit: number, page: number) {
    // Return a paginated list of jobs
    const queue = this.bullmqService.getQueue(QueueEnum.CRAWLER);
    const start = (page - 1) * limit;
    const end = page * limit;
    const jobs = await queue.getJobs(
      ['active', 'waiting', 'delayed', 'completed', 'failed'],
      start,
      end,
    );
    return jobs;
  }

  async getJobOutput(id: string) {
    // Results are fetched by joining with urls table
    const results = await this.resultRepository.findOne({
      where: {
        jobId: id,
      },
      relations: { urls: true },
    });
    if (!results) {
      throw new NotFoundException('Job not found');
    }

    // Format the output
    const imageUrls = results.urls
      .filter((url) => url.type === UrlTypeEnum.IMAGE)
      .map((url) => url.url);

    const scriptUrls = results.urls
      .filter((url) => url.type === UrlTypeEnum.SCRIPT)
      .map((url) => url.url);

    const stylesheetUrls = results.urls
      .filter((url) => url.type === UrlTypeEnum.STYLESHEET)
      .map((url) => url.url);

    return {
      id: results.jobId,
      title: results.title,
      description: results.description,
      favicon: results.favicon,
      scriptUrls: scriptUrls,
      stylesheetUrls: stylesheetUrls,
      imageUrls: imageUrls,
    };
  }

  async getJobStatus(id: string) {
    // Get the job and its state, throw if not found
    const job = await this.bullmqService.getQueue(QueueEnum.CRAWLER).getJob(id);
    const state = await this.bullmqService
      .getQueue(QueueEnum.CRAWLER)
      .getJobState(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return {
      id: job.id,
      name: job.name,
      progress: job.progress,
      status: state,
    };
  }

  async cancelJob(id: string) {
    const job = await this.bullmqService.getQueue(QueueEnum.CRAWLER).getJob(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    await this.bullmqService.getQueue(QueueEnum.CRAWLER).remove(id);
    return { message: 'Job cancelled' };
  }
}
