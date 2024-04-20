import bcrypt from "bcrypt";
import e, { NextFunction, Request, Response } from "express";
import { User } from "../../models/userModels/user.model";
import { IUser } from "../../interfaces/userSchemaInterface";
import createHttpError from "http-errors";

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

  return res
    .status(200)
    .send({ success: true, msg: "User created successfully" });
};

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, phone }: I_Request_body = req.body;

  const user = await User.findOne<IUser>({
    $or: [{ email }, { phone }],
  }).select("+password");

  if (!user) {
    return next(createHttpError(403, "User not found "));
  }

  if (!(await user.comparePassword?.(password))) {
    return next(createHttpError(401, "Enter the valid Credensials"));
  }

  return res
    .status(200)
    .send({ success: true, msg: "User login successfully" });
};

export { userRegister, userLogin };
