import { Job } from '../models/job.entity';
import JobExecutor from './jobExecuter.interface';
import { Logger } from '../utils/logger';

export class EmailExecutor implements JobExecutor {
  async execute(job: Job): Promise<void> {
    // const { to, subject, body } = job.payload || {};
    // Logger.info(`Sending email to ${to} with subject "${subject}"`);

    Logger.info(`Hi, this is Email send service executing now! ${new Date().toISOString()}`);
    // TODO: call email service here
  }
}
