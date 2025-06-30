import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobType } from '../types/jobType.enum';

export type JobStatus = 'active' | 'inactive' | 'paused';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  cronExpression!: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'paused'],
    default: 'inactive',
  })
  status!: JobStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastRunAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  nextRunAt!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @Column({
    type: 'enum',
    enum: JobType,
    nullable: false,
  })
  type!: JobType;

// @Column({ type: 'json', nullable: true })
// payload?: Record<string, any>; // custom config for the job

}
