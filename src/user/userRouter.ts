import express, { NextFunction, Request, Response } from "express";
import { userRegister } from "./userControllers";

const userRouter=express.Router();


userRouter.post("/register",userRegister)


export default userRouter;