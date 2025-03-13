import express from 'express';
import authorize from '../middlewares/authorize.middleware.js';
import { getHosterDetails ,postHosterDetails ,updateHosterDetails } from '../controllers/hoster.controller.js';

const hosterRouter = express.Router();

hosterRouter.get('/get/:id', authorize, getHosterDetails);

hosterRouter.post('/post', authorize, postHosterDetails);

hosterRouter.patch('/update/:id', authorize, updateHosterDetails);

export default hosterRouter;