import express from 'express';
import authorize from "../middlewares/authorize.middleware.js";
import  { getCategories ,postCategories } from "../controllers/catogries.controller.js";

const categoriesRouter = express.Router();

categoriesRouter.get('/', authorize, getCategories );
categoriesRouter.post('/', postCategories );

export default categoriesRouter;