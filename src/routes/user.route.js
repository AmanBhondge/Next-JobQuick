import express from "express";
import { signup, login, logout, checkAuth } from "../controllers/user.controller.js";
import authorize from "../middlewares/authorize.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.get('/check', authorize, checkAuth)

export default userRouter;