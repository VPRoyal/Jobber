import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Job } from '../models/job.entity';

export const JobRepository: Repository<Job> = AppDataSource.getRepository(Job);