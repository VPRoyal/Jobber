import JobExecutor from './jobExecuter.interface';
import { EmailExecutor } from './emailExecuter';
// import { SyncExecutor } from './sync.executor';

import { JobType } from '../types/jobType.enum';

// Executor registry to map job types to their executors
// This allows for easy extension in the future by adding new executors without changing the registry logic

const executorMap: Record<string, JobExecutor> = {
 [JobType.EMAIL]: new EmailExecutor(),
//   'data-sync': new SyncExecutor(),
};

export class ExecutorRegistry {
  static getExecutor(type: JobType): JobExecutor | undefined {
    return executorMap[type];
  }
  static getAvailableTypes(): string[] {
    return Object.keys(executorMap);
  }

  static isValidType(type: string): boolean {
    return type in executorMap;
  }
}
