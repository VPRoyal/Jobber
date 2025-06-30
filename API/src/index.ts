import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { jobRouter } from './routes/job.routes';
import { errorMiddleware } from './middlewares/error.mid';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupSwagger } from './swagger';

dotenv.config();

let app: express.Application;

async function createServer(): Promise<express.Application> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const server = express();
  setupSwagger(server);
  server.use(cors());
  server.use(express.json());

  server.use('/jobs', jobRouter);
  server.use(errorMiddleware);

  return server;
}

// If running locally (not in Vercel)
if (process.env.ENVIRONMENT === 'dev') {
  createServer().then(localApp => {
    const port = process.env.PORT || 4000;
    localApp.listen(port, () => {
      console.log(`Jobber is running locally on http://localhost:${port}`);
    });
  }).catch(err => {
    console.error('Error starting local server:', err);
  });
}

// Export for Vercel serverless
export default async function handler(req: any, res: any) {
  if (!app) {
    app = await createServer();
  }
  return app(req, res);
}
