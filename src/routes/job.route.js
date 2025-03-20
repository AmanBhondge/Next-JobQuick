import express from 'express';
import authorize from '../middlewares/authorize.middleware.js';
import { getFilteredJobs ,getDashboardJobs ,getTableJobs ,getJobDetails ,postJob ,updateJob  } from '../controllers/job.controller.js';

const jobRouter = express.Router();

jobRouter.get('/filter', authorize , getFilteredJobs );

jobRouter.get('/dashboard/:creatorId', authorize , getDashboardJobs );

jobRouter.get('/table/:hosterId', authorize , getTableJobs );

jobRouter.get('/:id', authorize , getJobDetails );

jobRouter.post('/post', authorize , postJob );

jobRouter.patch('/update/:id', authorize , updateJob );

export default jobRouter;
