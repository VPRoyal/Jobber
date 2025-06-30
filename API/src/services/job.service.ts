import { JobRepository } from '../repositories/job.repository';
import { CreateJobDTO } from '../types/job.dto';
import { Job } from '../models/job.entity';
import { SchedulerService } from './scheduler.service';

export class JobService {
  static async listAll(): Promise<Job[]> {
    return JobRepository.find();
  }

  static async getById(id: string): Promise<Job | null> {
    return JobRepository.findOneBy({ id });
  }

  static async create(data: CreateJobDTO): Promise<Job> {
    const job = JobRepository.create({
      name: data.name,
      cronExpression: data.cronExpression,
      lastRunAt: null,
      nextRunAt: null,
    });
    const saved = await JobRepository.save(job);
    SchedulerService.schedule(saved);
    return saved;
  }
}