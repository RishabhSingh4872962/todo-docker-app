import express, { NextFunction, Request, Response } from "express";
import {
  editPassword,
  editUser,
  resetPassword,
  resetTokenGen,
  userLogin,
  userLogout,
  userRegister,
} from "../../controllers/user/userControllers";
import { asyncErrorHandler } from "../../Errors/aysncErrorHandler";
import { isUserAuthenticated } from "../../middlewares/isUserAuthenticated";

const userRouter = express.Router();

userRouter.post("/register", asyncErrorHandler(userRegister));
userRouter.post("/login", asyncErrorHandler(userLogin));
userRouter.put(
  "/edit",
  asyncErrorHandler(isUserAuthenticated),
  asyncErrorHandler(editUser)
);
userRouter.put(
  "/pass",
  asyncErrorHandler(isUserAuthenticated),
  asyncErrorHandler(editPassword)
);
userRouter.post("/resetToken", asyncErrorHandler(resetTokenGen));
userRouter.post("/resetPassword/:resetToken", asyncErrorHandler(resetPassword));
userRouter.get("/logout", asyncErrorHandler(userLogout));
export default userRouter;
