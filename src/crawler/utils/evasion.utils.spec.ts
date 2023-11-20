import { Test, TestingModule } from '@nestjs/testing';
import { EvasionUtils } from './evasion.utils';
import { ConfigService } from '@nestjs/config';

jest.mock('src/static/user-agents.json', () => ['UA1', 'UA2', 'UA3'], {
  virtual: true,
});

describe('EvasionUtils', () => {
  let service: EvasionUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvasionUtils, ConfigService],
    }).compile();

    service = module.get<EvasionUtils>(EvasionUtils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should rotate user agents', () => {
    const userAgent1 = service.getNextUserAgent();
    const userAgent2 = service.getNextUserAgent();
    const userAgent3 = service.getNextUserAgent();
    const userAgent4 = service.getNextUserAgent();

    expect(userAgent1).toEqual('UA1');
    expect(userAgent2).toEqual('UA2');
    expect(userAgent3).toEqual('UA3');
    expect(userAgent4).toEqual('UA1'); // rotation should happen here
  });
});
