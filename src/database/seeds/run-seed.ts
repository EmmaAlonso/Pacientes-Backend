import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedDatabase } from './init.seed';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',
});

async function runSeed() {
  try {
    await dataSource.initialize();
    await seedDatabase(dataSource);
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  }
}

runSeed();
