import { DataSource } from 'typeorm';
import { Job } from '../models/job.entity';
import dotenv from 'dotenv';

dotenv.config();
console.log("Database config: ", process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_NAME);
export const AppDataSource = new DataSource({
  type: 'mysql',
  host:     process.env.DB_HOST     || 'localhost',    // e.g. 'localhost'
  port:     Number(process.env.DB_PORT) || 3306,        // default MySQL port
  username: process.env.DB_USER     || 'root',         // your MySQL user
  password: process.env.DB_PASS     || '',             // your MySQL password
  database: process.env.DB_NAME     || 'chronoscheduler',
  synchronize: true,      // turn to `true` only in dev if you want auto‑schema sync
  logging: false,
  entities: [Job],
  migrations: ['dist/migrations/*.js'],
});