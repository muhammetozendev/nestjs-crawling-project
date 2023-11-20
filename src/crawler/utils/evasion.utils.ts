import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IProxy } from '../types/proxy.interface';
import userAgents from 'src/static/user-agents.json';

@Injectable()
export class EvasionUtils implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  private readonly userAgents: string[] = userAgents;
  private userAgentIndex = 0;

  private readonly proxies: IProxy[] = [];
  private proxyIndex = 0;
  private httpProxyIndex = 0;

  onModuleInit() {
    let i = 1;
  }

  // Rotate user agents
  getNextUserAgent() {
    const userAgent = this.userAgents[this.userAgentIndex];
    this.userAgentIndex = (this.userAgentIndex + 1) % this.userAgents.length;
    return userAgent;
  }

  // Rotate proxies
  getNextProxy() {
    const proxy = this.proxies[this.proxyIndex];
    this.proxyIndex = (this.proxyIndex + 1) % this.proxies.length;
    return proxy;
  }

  // Rotate http proxies
  getNextHttpProxy() {
    // Find the next http proxy
    for (let i = this.httpProxyIndex; i < this.proxies.length; i++) {
      const proxy = this.proxies[i];
      if (proxy.protocol.startsWith('http')) {
        this.httpProxyIndex = (i + 1) % this.proxies.length;
        return proxy;
      }
    }

    // If not found in the remaining part of the array, start from the beginning
    for (let i = 0; i < this.httpProxyIndex; i++) {
      const proxy = this.proxies[i];
      if (proxy.protocol.startsWith('http')) {
        this.httpProxyIndex = (i + 1) % this.proxies.length;
        return proxy;
      }
    }

    // If no http proxy is found, return null
    return null;
  }
}
