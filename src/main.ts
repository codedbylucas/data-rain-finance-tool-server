import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useStaticAssets(join(__dirname, '..', 'client'));
  const config = new DocumentBuilder()
    .setTitle('Finance Tool Server')
    .setDescription('Aplicação de previsão orçamentária')
    .setVersion('1.0.0')
    .addTag('auth')
    .addTag('user')
    .addTag('role')
    .addTag('team')
    .addTag('question')
    .addTag('alternative')
    .addTag('client')
    .addTag('budget-request')
    .addTag('project')
    .addTag('normal-hour')
    .addTag('request-send-overtime')
    .addTag('overtime')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3333);
}
bootstrap();
