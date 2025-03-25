import express from "express";
import { signup, login, checkAuth, deleteSeekerUser, deleteHosterUser } from "../controllers/auth.controller.js";
import authorize from "../middlewares/authorize.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.delete("/delete/seeker/:seekerId", authorize, deleteSeekerUser);
authRouter.delete("/delete/hoster/:hosterId", authorize, deleteHosterUser);

authRouter.get('/check', authorize, checkAuth)

export default authRouter;