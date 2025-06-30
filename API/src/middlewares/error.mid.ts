import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  Logger.error(err.stack || err.message);
  res.status(500).json({ message: 'Internal Server Error' });
}