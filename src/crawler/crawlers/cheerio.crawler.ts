import { Injectable } from '@nestjs/common';
import { ICrawler } from '../types/crawler.interface';
import { CrawlerOutput } from '../types/crawler-output.interface';
import { IProxy } from '../types/proxy.interface';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawlDto } from '../dto/crawl.dto';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { ProxyAgent } from 'proxy-agent';

@Injectable()
export class CheerioCrawler implements ICrawler {
  async crawl(data: CrawlDto, proxyConfig?: IProxy): Promise<CrawlerOutput> {
    let agent: ProxyAgent | SocksProxyAgent;

    // Check if proxy is provided
    if (proxyConfig) {
      const { protocol, host, port, username, password } = proxyConfig;

      if (protocol.startsWith('socks')) {
        // Socks proxy
        agent =
          username && password
            ? new SocksProxyAgent(
                `${protocol}://${username}:${password}@${host}:${port}`,
              )
            : new SocksProxyAgent(`${protocol}://${host}:${port}`);
      } else {
        // Http proxy
        agent =
          username && password
            ? new ProxyAgent({
                protocol,
                host,
                port,
                user: username,
                password,
              })
            : new ProxyAgent({
                protocol,
                host,
                port,
              });
      }
    }

    const res = await axios.get(data.url, {
      ...(agent && { httpAgent: agent, httpsAgent: agent }), // use agent if defined
    });
    const $ = cheerio.load(res.data);

    // Get title
    const title = $('title').text();

    // Get description
    const description = $('meta[name="description"]').attr('content');

    // Get favicon
    const favicon = $('link[rel="icon"]').attr('href');

    // Script urls
    const scriptUrls = [];
    $('script').each((i, el) => {
      const url = $(el).attr('src');
      if (url) scriptUrls.push(url);
    });

    // Stylesheet urls
    const stylesheetUrls = [];
    $('link[rel="stylesheet"]').each((i, el) => {
      const url = $(el).attr('href');
      if (url) stylesheetUrls.push(url);
    });

    // Image urls
    const imageUrls = [];
    $('img').each((i, el) => {
      const url = $(el).attr('src');
      if (url) imageUrls.push(url);
    });

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
