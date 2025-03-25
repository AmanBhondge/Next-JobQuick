import express from "express";
import { signup, login, checkAuth, deleteSeekerUser } from "../controllers/auth.controller.js";
import authorize from "../middlewares/authorize.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.delete("/delete/seeker/:seekerId", authorize, deleteSeekerUser);

authRouter.get('/check', authorize, checkAuth)

export default authRouter;