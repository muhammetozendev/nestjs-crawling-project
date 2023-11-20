import { Module } from '@nestjs/common';
import { CrawlerModule } from './crawler/crawler.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullmqModule } from './bullmq/bullmq.module';
import { Result } from './crawler/entities/result.entity';
import { Url } from './crawler/entities/url.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // Postgres Configuration
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASS: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        // Redis Configuration
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASS: Joi.string().optional(),

        // Rate Limit Configuration
        MAX_CONCURRENT_JOBS: Joi.number().required(),
        MAX_CONCURRENT_JOBS_DURATION: Joi.number().required(),

        // Retry Configuration
        MAX_RETRY_COUNT: Joi.number().required(),
        BACKOFF_DURATION: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB,
      entities: [Result, Url],
      migrations: ['dist/src/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrationsRun: true,
      logging: true,
    }),
    CrawlerModule,
    BullmqModule,
  ],
})
export class AppModule {}
