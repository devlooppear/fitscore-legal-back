import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';
import { Environment } from '../common/enum/environments.enum';

dotenv.config();

let typeOrmConfig: DataSourceOptions;

try {
  const DATABASE_URL = process.env.DATABASE_URL;
  const ENVIRONMENT = (
    process.env.ENVIRONMENT || Environment.LOCAL
  ).toLowerCase();

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env');
  }

  typeOrmConfig = {
    type: 'postgres',
    url: DATABASE_URL,
    synchronize: true,
    logging: ENVIRONMENT == Environment.LOCAL,
    entities: [path.resolve(__dirname, '../resources/**/*.entity.{ts,js}')],
    migrations: [path.resolve(__dirname, '../migrations/*{.ts,.js}')],
    migrationsRun: false,
  };

  console.log('TypeORM config loaded');
} catch (error) {
  console.error('Error loading TypeORM config:', error);
  throw error;
}

export { typeOrmConfig };
