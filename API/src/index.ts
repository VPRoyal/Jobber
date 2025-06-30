import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { jobRouter } from './routes/job.routes';
import { errorMiddleware } from './middlewares/error.mid';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

async function bootstrap() {
  await AppDataSource.initialize();
  const app = express();
  app.use(cors());

  app.use(express.json());

  app.use('/jobs', jobRouter);
  app.use(errorMiddleware);

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`ChronoScheduler running on port ${port}`);
  });
}

bootstrap().catch(err => console.error('Bootstrap error', err));