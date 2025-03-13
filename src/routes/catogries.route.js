import express from 'express';
import authorize from "../middlewares/authorize.middleware.js";
import  { getCategories ,postCategories } from "../controllers/catogries.controller.js";

const categoriesRouter = express.Router();

categoriesRouter.get('/get', authorize, getCategories );
categoriesRouter.post('/post', postCategories );

export default categoriesRouter;