import express, { NextFunction, Request, Response } from "express";
import { userRegister } from "../../controllers/user/userControllers";

const userRouter=express.Router();


userRouter.post("/register",userRegister)


export default userRouter;