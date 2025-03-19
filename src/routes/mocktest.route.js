import express from "express";
import authorize from "../middlewares/authorize.middleware.js";
const mockTestRouter = express.Router();
import { generate } from "../controllers/mocktest.controller.js";

mockTestRouter.post("/generate", authorize, generate);

export default mockTestRouter;