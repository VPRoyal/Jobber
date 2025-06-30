import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { validationMiddleware } from '../middlewares/validation.mid';
import { CreateJobDTO } from '../types/job.dto';

export const jobRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job scheduling & management APIs
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobResponse'
 */
jobRouter.get('/', JobController.list);

/**
 * @swagger
 * /jobs/types:
 *   get:
 *     summary: Get available job types
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of job types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
jobRouter.get('/types', JobController.getJobTypes);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *       404:
 *         description: Job not found
 */
jobRouter.get('/:id', JobController.get);

/**
 * @swagger
 * /jobs/create:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobDTO'
 *     responses:
 *       201:
 *         description: Job created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *       400:
 *         description: Invalid input
 */
jobRouter.post('/create', validationMiddleware(CreateJobDTO), JobController.create);
