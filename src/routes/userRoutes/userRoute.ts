import express, { NextFunction, Request, Response } from "express";
import { editPassword, editUser, userLogin, userRegister } from "../../controllers/user/userControllers";
import { asyncErrorHandler } from "../../Errors/aysncErrorHandler";
import { isUserAuthenticated } from "../../middlewares/isUserAuthenticated";

const userRouter=express.Router();


userRouter.post("/register",asyncErrorHandler(userRegister))
userRouter.post("/login",asyncErrorHandler(userLogin))
userRouter.put("/edit",asyncErrorHandler(isUserAuthenticated),asyncErrorHandler(editUser))
userRouter.put("/pass",asyncErrorHandler(isUserAuthenticated),asyncErrorHandler(editPassword))
export default userRouter;