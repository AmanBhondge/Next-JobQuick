import express from "express";
import multer from "multer";
import { checkResume } from "../controllers/ats.controller.js";
import authorize from "../middlewares/authorize.middleware.js";

const atsRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

atsRouter.post("/check", upload.single("resume"), authorize, checkResume);

export default atsRouter;