import { IsEnum, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CrawlerEnum } from 'src/crawler/enums/crawler.enum';

export class CrawlDto {
  @IsUrl()
  @ApiProperty()
  url: string;

  @IsEnum(CrawlerEnum)
  @ApiProperty({ enum: CrawlerEnum })
  crawler: CrawlerEnum = CrawlerEnum.CHEERIO;
}
