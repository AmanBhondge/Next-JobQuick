import express from "express";
import { signup, login, checkAuth, deleteUser } from "../controllers/auth.controller.js";
import authorize from "../middlewares/authorize.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.delete("/delete/:id", authorize, deleteUser);

authRouter.get('/check', authorize, checkAuth)

export default authRouter;