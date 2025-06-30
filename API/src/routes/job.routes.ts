import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { validationMiddleware } from '../middlewares/validation.mid';
import { CreateJobDTO } from '../types/job.dto';

export const jobRouter = Router();

jobRouter.get('/', JobController.list);
jobRouter.get('/:id', JobController.get);
jobRouter.post('/create', validationMiddleware(CreateJobDTO), JobController.create);
jobRouter.get('/available', JobController.getJobTypes);