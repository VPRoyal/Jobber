import { Job } from '../models/job.entity';

export default interface JobExecutor {
  execute(job: Job): Promise<void>;
}
