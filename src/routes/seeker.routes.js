import express from 'express';
import {getSeekerDetails, postSeekerDetails, updateSeekerDetails} from '../controllers/seeker.controller.js'
import authorize from '../middlewares/authorize.middleware.js';

const seekerRouter = express.Router();

seekerRouter.get('/get/:id', authorize, getSeekerDetails);

seekerRouter.post('/post', authorize, postSeekerDetails);

seekerRouter.patch('/update/:id', authorize, updateSeekerDetails);

export default seekerRouter;