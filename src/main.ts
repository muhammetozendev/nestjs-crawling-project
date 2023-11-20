import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validate incoming data stripping out any extra properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Assessment')
    .setDescription('Sample crawling API')
    .setVersion('1.0')
    .setContact('Muhammet Özen', null, 'muhammed_ozenn@hotmail.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 }, // disable schemas
  });

  await app.listen(80);
}
bootstrap();
