import express from "express";
import authorize from "../middlewares/authorize.middleware.js";
const applicantRouter = express.Router();

import { getApplicants, getdetails, getGraphData, checkApplied, applyJob, updateApplication, getAppliedJobs } from "../controllers/applicant.controller.js";

applicantRouter.get('/get', authorize, getApplicants);
applicantRouter.get('/details/:id', authorize, getdetails);
applicantRouter.get('/graph/:jobId', authorize, getGraphData);
applicantRouter.get('/check', authorize, checkApplied);
applicantRouter.get('/get/jobs/:applicantId', authorize, getAppliedJobs);
applicantRouter.post('/post', authorize, applyJob);
applicantRouter.patch('/shortlisted/:id', authorize, updateApplication);

export default applicantRouter;