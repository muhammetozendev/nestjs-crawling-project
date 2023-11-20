import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CrawlDto } from './dto/crawl.dto';
import { CrawlerService } from './crawler.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobResDto } from './dto/job-res.dto';
import { DeleteJobResDto } from './dto/delete-job-res.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JobOutputDto } from './dto/job-output.dto';
import { JobStatusResDto } from './dto/job-status.dto';

@Controller()
@ApiTags('Crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('/crawl')
  @ApiResponse({
    status: 201,
    type: JobResDto,
  })
  @ApiOperation({
    summary:
      'Create a crawling job, optionally specifying a crawler (cheerio or puppeteer)',
  })
  async crawl(@Body() body: CrawlDto) {
    return await this.crawlerService.createCrawlingJob(body);
  }

  @Get('/jobs')
  @ApiResponse({
    status: 200,
    type: JobResDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get a list of jobs' })
  async getJobs(@Query() { limit, page }: PaginationDto) {
    return await this.crawlerService.getJobs(limit, page);
  }

  @Get('/jobs/:id/output')
  @ApiResponse({
    status: 200,
    type: JobOutputDto,
  })
  @ApiOperation({ summary: 'Get the output of a job' })
  async getJobOutput(@Param('id') id: string) {
    return await this.crawlerService.getJobOutput(id);
  }

  // My preferred path: GET /jobs/:id/status
  //   @Get('/jobs/:id/status')
  @Get('/status/:id')
  @ApiResponse({
    status: 200,
    type: JobStatusResDto,
  })
  @ApiOperation({ summary: 'Get the status of a job' })
  async getJobStatus(@Param('id') id: string) {
    return await this.crawlerService.getJobStatus(id);
  }

  // My preferred path: DELETE /jobs/:id/cancel
  //   @Delete('/jobs/:id/cancel')
  @Delete('/cancel/:id')
  @ApiResponse({
    status: 200,
    type: DeleteJobResDto,
  })
  @ApiOperation({ summary: 'Cancel a job' })
  async cancelJob(@Param('id') id: string) {
    return await this.crawlerService.cancelJob(id);
  }
}
