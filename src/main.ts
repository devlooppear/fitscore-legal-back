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

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const dataSource = new DataSource(typeOrmConfig);
  await dataSource.initialize();

  if (environment === Environment.LOCAL) {
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

  if (environment === Environment.LOCAL) {
    console.log(`Server running on port ${port}`);
  }
}

bootstrap();
