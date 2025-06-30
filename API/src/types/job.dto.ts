import { IsNotEmpty, IsString, Matches } from 'class-validator';

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
}