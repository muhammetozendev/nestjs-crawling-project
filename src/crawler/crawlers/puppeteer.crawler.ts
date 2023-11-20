import { Injectable } from '@nestjs/common';
import { ICrawler } from '../types/crawler.interface';
import { IProxy } from '../types/proxy.interface';
import { CrawlerOutput } from '../types/crawler-output.interface';
import { getAttributeFromElement } from '../utils/puppeteer.utils';
import { CrawlDto } from '../dto/crawl.dto';
import puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerCrawler implements ICrawler {
  async crawl(data: CrawlDto, proxyConfig?: IProxy): Promise<CrawlerOutput> {
    const browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.goto(data.url);

    // Get title
    const title = await page.title();

    // Get description
    const [metaElement] = await page.$x('//head//meta[@name="description"]');
    const description = await getAttributeFromElement(
      page,
      metaElement,
      'content',
    );

    // Get favicon
    const [faviconElement] = await page.$x('//head//link[@rel="icon"]');
    const favicon = await getAttributeFromElement(page, faviconElement, 'href');

    // Script urls
    const scriptElements = await page.$x('//script');
    const scriptUrls = [];
    for (let scriptElement of scriptElements) {
      const url = await getAttributeFromElement(page, scriptElement, 'src');
      if (url) scriptUrls.push(url);
    }

    // Stylesheet urls
    const stylesheetElements = await page.$x('//head//link[@rel="stylesheet"]');
    const stylesheetUrls = [];
    for (let stylesheetElement of stylesheetElements) {
      const url = await getAttributeFromElement(
        page,
        stylesheetElement,
        'href',
      );
      if (url) stylesheetUrls.push(url);
    }

    // Image urls
    const imageElements = await page.$x('//img');
    const imageUrls = [];
    for (let imageElement of imageElements) {
      const url = await getAttributeFromElement(page, imageElement, 'src');
      if (url) imageUrls.push(url);
    }

    await browser.close();

    return {
      title,
      description,
      favicon,
      scriptUrls,
      stylesheetUrls,
      imageUrls,
    };
  }
}
