import { DataSource } from 'typeorm';

// Load vars in .env in PROCESS.ENV
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['./dist/**/*.entity{.ts,.js}'],
  migrations: ['./dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
});
