import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service';
import { plainToClass } from 'class-transformer';
import { CreateJobDTO } from '../types/job.dto';
import { Logger } from '../utils/logger';

export class JobController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobs = await JobService.listAll();
      res.json(jobs);
      Logger.info('Job list retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await JobService.getById(req.params.id);
      if (!job){ res.status(404).json({ message: 'Job not found' }); return;}
      res.json(job);
      Logger.info(`Job with ID ${req.params.id} retrieved successfully`);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToClass(CreateJobDTO, req.body);
      const newJob = await JobService.create(dto);
      res.status(201).json(newJob);
      Logger.info('New job created successfully');
    } catch (err) {
      next(err);
    }
  }
}