import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // (H2): Limiter la taille du corps HTTP à 1mb ---
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  // 1. En-têtes de sécurité HTTP avec Helmet 
  app.use(helmet());

  // 2. Configuration CORS explicite (H4 & H5)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // 3. Validation globale 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuration Swagger OpenAPI 
  const config = new DocumentBuilder()
    .setTitle('CampusRate API')
    .setDescription("API REST pour l'évaluation des lieux sur le campus (Cours 420-514)")
    .setVersion('1.0')
    .addTag('places', 'Gestion des endroits du campus')
    .addTag('reviews', 'Gestion des avis et évaluations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
void bootstrap();