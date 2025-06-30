import { IsNotEmpty, IsString, Matches, IsEnum, IsOptional } from 'class-validator';
import { JobType } from './jobType.enum';
export class CreateJobDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([\d\*\/\-,]+\s+){4}[\d\*\/\-,]+$/)
  cronExpression!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsEnum(JobType, { message: 'Invalid job type' })
  type!: JobType;

  // Uncomment if you want to allow additional payloads in the future
  // @IsOptional()
  // payload?: Record<string, any>;
}