import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/database.config';
import * as dotenv from 'dotenv';
import { Environment } from './common/enum/environments.enum';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  app.setGlobalPrefix('api');

  const environment = process.env.ENVIRONMENT as Environment;

  const allowedOrigins =
    environment == Environment.PRODUCTION
      ? ['https://fitscore-legal-front.vercel.app']
      : ['*'];

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*')
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS não permitido'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    exposedHeaders: '*',
  });

  const dataSource = new DataSource(typeOrmConfig);
  await dataSource.initialize();

  if (environment !== Environment.PRODUCTION) {
    console.log('Database connected');

    const config = new DocumentBuilder()
      .setTitle('FitScore API')
      .setDescription(
        'API para gerenciamento de usuários, envio de FitScores e notificações. ' +
          'Permite candidatos registrarem respostas de avaliação e recrutadores acessarem dashboards de resultados.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    console.log(
      `Swagger docs available at http://localhost:${process.env.PORT || 3000}/api-docs`,
    );
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port);

  if (environment !== Environment.PRODUCTION) {
    console.log(`Server running on port ${port}`);
  }
}

bootstrap();
