import { CrawlDto } from '../dto/crawl.dto';
import { CrawlerOutput } from './crawler-output.interface';
import { IProxy } from './proxy.interface';

export interface ICrawler {
  crawl(data: CrawlDto, proxyConfig: IProxy): Promise<CrawlerOutput>;
}
