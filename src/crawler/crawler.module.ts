import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuppeteerCrawler } from './crawlers/puppeteer.crawler';
import { CheerioCrawler } from './crawlers/cheerio.crawler';
import { CrawlerWorker } from './crawler.worker';
import { BullmqModule } from 'src/bullmq/bullmq.module';
import { Url } from './entities/url.entity';
import { Result } from './entities/result.entity';
import { EvasionUtils } from './utils/evasion.utils';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url, Result]),
    BullmqModule,
    ConfigModule,
  ],
  providers: [
    CrawlerService,
    EvasionUtils,
    CrawlerWorker,
    PuppeteerCrawler,
    CheerioCrawler,
  ],
  controllers: [CrawlerController],
})
export class CrawlerModule {}
