import express from "express";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import authorize from "../middlewares/authorize.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.get('/check', authorize, checkAuth)

export default authRouter;