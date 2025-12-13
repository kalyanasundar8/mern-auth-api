import express from "express";
import { UserController } from "../controller/user.controller.js";
const userRouter = express.Router();

userRouter.post("/register", UserController.registerUser);

export default userRouter;
