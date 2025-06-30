import cron from 'node-cron';
import { Job } from '../models/job.entity';
import { JobRepository } from '../repositories/job.repository';
import parser from 'cron-parser';
import { Logger } from '../utils/logger';
import { ExecutorRegistry } from '../executers/executerRegistry';

export class SchedulerService {
  static schedule(job: Job) {
    if (!cron.validate(job.cronExpression)) {
      Logger.error(`Invalid cron for job ${job.id}: ${job.cronExpression}`);
      return;
    }

    cron.schedule(job.cronExpression, async () => {
      const now = new Date();
      Logger.info(`Running job ${job.id} - ${job.name}`);

      try {
        // Lookup executor
        const executor = ExecutorRegistry.getExecutor(job.type);
        if (!executor) throw new Error(`No executor for type ${job.type}`);

        // Run the job logic
        await executor.execute(job);

        // Update run times
        job.lastRunAt = now;
        const interval = parser.parse(job.cronExpression, { currentDate: now });
        job.nextRunAt = interval.next().toDate(); // Calculate next run time
        await JobRepository.save(job);
      } catch (err) {
        Logger.error(`Job ${job.id} failed: ${err}`);
      }
    });
  }
}
