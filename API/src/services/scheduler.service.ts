import cron from 'node-cron';
import { Job } from '../models/job.entity';
import { JobRepository } from '../repositories/job.repository';
import { Logger } from '../utils/logger';

export class SchedulerService {
  static schedule(job: Job) {
    cron.schedule(job.cronExpression, async () => {
      const now = new Date();
      Logger.info(`Running job ${job.id} - ${job.name}`);
      // TODO: implement actual job execution logic

      job.lastRunAt = now;
      // Compute next run using cron-parser or wrapper
      const nextDates = cron.validate(job.cronExpression)
        ? cron.schedule(job.cronExpression, () => {}).nextDates()
        : null;
      job.nextRunAt = nextDates ? new Date(nextDates.toDate()) : null;
      await JobRepository.save(job);
    });
  }
}