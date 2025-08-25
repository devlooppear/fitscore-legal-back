import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/database.config';
import * as dotenv from 'dotenv';
import { Environment } from './common/enum/environments.enum';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const dataSource = new DataSource(typeOrmConfig);
  await dataSource.initialize();

  if (process.env.ENVIRONMENT === Environment.LOCAL) {
    console.log('Database connected');
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port);

  if (process.env.ENVIRONMENT === Environment.LOCAL) {
    console.log(`Server running on port ${port}`);
  }
}

bootstrap();
