import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Logger } from '../utils/logger';

export function validationMiddleware<T extends Object>(type: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    Logger.info('Validating request body:', req.body);
    const dto = plainToClass(type, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      Logger.error('Validation errors:', errors);
     res.status(400).json({ errors });
      return ;
    }
    next();
  };
}