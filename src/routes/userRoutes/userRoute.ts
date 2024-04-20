import express, { NextFunction, Request, Response } from "express";
import { userLogin, userRegister } from "../../controllers/user/userControllers";
import { asyncErrorHandler } from "../../Errors/aysncErrorHandler";

const userRouter=express.Router();


userRouter.post("/register",asyncErrorHandler(userRegister))
userRouter.post("/login",asyncErrorHandler(userLogin))

export default userRouter;