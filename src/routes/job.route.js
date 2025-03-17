import express from 'express';
import authorize from '../middlewares/authorize.middleware.js';
import { getFilteredJobs ,getDashboardJobs ,getTableJobs ,getJobDetails ,postJob ,updateJob  } from '../controllers/job.controller.js';
import rateLimit from "express-rate-limit";

const jobRouter = express.Router();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30 // Limit each IP to 30 requests per minute
});

jobRouter.get('/filter', authorize , getFilteredJobs );

jobRouter.get('/dashboard/:creatorId', authorize , getDashboardJobs );

jobRouter.get('/table/:hosterId', authorize , getTableJobs );

jobRouter.get('/job/:id', authorize , getJobDetails );

jobRouter.post('/post', authorize , limiter, postJob );

jobRouter.patch('/update/:id', authorize , limiter, updateJob );

export default jobRouter;
