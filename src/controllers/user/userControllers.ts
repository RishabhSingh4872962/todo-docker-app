import { generateToken } from "./../../helpers/generateToken";
import bcrypt from "bcrypt";

import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { User } from "../../models/userModels/user.model";
import { IUser } from "../../interfaces/userSchemaInterface";
import createHttpError from "http-errors";
import { I_CustomRequest } from "../../middlewares/isUserAuthenticated";

interface I_Request_body {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
}

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password, phone }: I_Request_body =
    req.body;

  const existUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existUser) {
    return next(createHttpError(409, "User already exists"));
  }

  const user = new User<IUser>({
    firstName,
    lastName,
    email,
    password,
    phone,
  });

  await user.save();

  const token = generateToken({ id: user._id });

  if (!token) {
    return next(createHttpError(500, "Internal server Error"));
  }

  return res
    .cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
    })
    .status(200)
    .send({ success: true, msg: "User created successfully" });
};

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, phone }: I_Request_body = req.body;

  const user = await User.findOne<IUser>({
    $or: [{ email }, { phone }],
  }).select("+password");

  if (!user || !(await user.comparePassword?.(password))) {
    return next(createHttpError(403, "Enter the valid Credensials"));
  }

  // const payLoad = { id: user._id };
  const token = generateToken({ id: user._id });

  if (!token) {
    return next(createHttpError(500, "Internal server Error"));
  }

  return res
    .cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
    })
    .status(200)
    .send({ success: true, msg: "User login successfully" });
};

const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const { newFirstName, newLastName, newEmail, newPhone } = req.body;

  const alreayUser = await User.findOne<IUser>({
    $or: [{ email: newEmail }, { phone: newPhone }],
  });
  if (alreayUser) {
    return next(createHttpError(401, "This credensials already exist"));
  }

  let existUser = (req as I_CustomRequest).user;

  const user = await User.findOneAndUpdate(
    { _id: existUser.id },
    {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      phone: newPhone,
    },
    { runValidators: true, timestamps: true }
  );
  if (!user) {
    return next(createHttpError(500, "Internal server error"));
  }

  res.status(202).send({
    success: true,
    msg: "user edit succesfully",
  });
};

const editPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    oldPassword,
    newPassword,
    confirmPassword,
  }: { oldPassword: string; newPassword: string; confirmPassword: string } =
    req.body;

  if (newPassword != confirmPassword) {
    return next(createHttpError(403, "Password does't match"));
  }
  let user_id = (req as I_CustomRequest).user;
  const user = await User.findById({ _id: user_id.id }).select("+password");

  let result: Boolean | undefined = await user?.comparePassword?.(oldPassword);

  if (!user) {
    return next(createHttpError(500, "Internal server Error"));
  }

  if (!result) {
    return next(createHttpError(400, "Enter the valid credensials"));
  }

  user.password = newPassword;

  await user.save();

  res.status(200).send({ success: true, msg: "password change successfully" });
};

const resetTokenGen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email }: { email: string } = req.body;
  const generateResetToken = crypto.randomBytes(32).toString("hex");

  const updateResetToken = crypto
    .createHash("sha256")
    .update(generateResetToken)
    .digest("hex");

  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(400, "Enter the valid Credensials"));
  }
  user.resetToken = updateResetToken;

  user.resetTokenExpired = Date.now() + 90000;

  await user.save();

  //  todo --> send gernated token to user email
  return res.status(201).send({ success: true, generateResetToken });
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { resetToken } = req.params;
  const { newPassowrd, confirmPassword } = req.body;

  if (newPassowrd != confirmPassword) {
    return res
      .status(401)
      .send({ success: false, msg: "Enter the valid credensials" });
  }

  const updateResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetToken: updateResetToken,
    resetTokenExpired: { $gt: Date.now() },
  });
  console.log(user);

  if (!user) {
    return res
      .status(200)
      .send({ success: true, msg: "token expired ,generate new token" });
  }

  user.password = newPassowrd;
  user.resetToken = undefined;
  user.resetTokenExpired = undefined;

  await user.save();

  return res
    .status(201)
    .send({ success: true, msg: "password reset successfully" });
};

const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.cookie("token","").status(200).send({success:true,msg:"user logout successfully"})
};
export {
  userRegister,
  userLogin,
  editUser,
  editPassword,
  resetTokenGen,
  resetPassword,
  userLogout
};
