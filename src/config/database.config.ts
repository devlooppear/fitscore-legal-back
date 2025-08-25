import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Environment } from 'src/common/enum/environments.enum';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.ENVIRONMENT || Environment.LOCAL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env');
}

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: NODE_ENV === Environment.LOCAL,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: false,
};
