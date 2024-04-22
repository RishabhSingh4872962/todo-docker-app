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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: number
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 *       400:
 *         description: User already exists
 */

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password, phone }: I_Request_body =
    req.body;

  const existUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existUser) {
    return next(createHttpError(400, "User already exists"));
  }

  console.log(existUser);

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
    .status(201)
    .send({ success: true, msg: "User created successfully" });
};
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login the user
 *     description: It will login the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: number
 *     responses:
 *       200:
 *         description: User login successfully
 *       500:
 *         description: Internal server error
 *       403:
 *         description: Enter the valid Credensials
 */

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, phone }: I_Request_body = req.body;

  const user = await User.findOne<IUser>({
    $or: [{ email }, { phone }],
  }).select("+password");

  if (!user || !(await user?.comparePassword?.(password))) {
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

/**
 * @swagger
 * /edit:
 *   put:
 *     summary: Update the user
 *     description: It will update the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newFirstName:
 *                 type: string
 *               newLastName:
 *                 type: string
 *               newEmail:
 *                 type: string
 *               newPhone:
 *                 type: number
 *     responses:
 *       202:
 *         description: Successfully updated user
 *       401:
 *         description: This credensials already exist
 *       500:
 *         description: Internal server error
 *       405:
 *         description: Enter the valid credensials
 */

const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    newFirstName,
    newLastName,
    newEmail,
    newPhone,
  }: {
    newFirstName: string;
    newLastName: string;
    newEmail: string;
    newPhone: number;
  } = req.body;

  if (
    newEmail.trim().endsWith(".com") &&
    newEmail.includes("@") &&
    newPhone.toString().length == 10
  ) {
    return next(createHttpError(405, "Enter the valid credensials"));
  }

  if (newEmail || newPhone) {
    const alreayUser = await User.findOne<IUser>({
      $or: [{ email: newEmail }, { phone: newPhone }],
    });
    if (alreayUser) {
      return next(createHttpError(401, "This credensials already exist"));
    }
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

  console.log(req.body);

  if (!user) {
    return next(createHttpError(500, "Internal server error"));
  }

  res.status(202).send({
    success: true,
    msg: "user edit succesfully",
  });
};

/**
 * @swagger
 * /pass:
 *   put:
 *     summary: Edit the password
 *     description: It will edit the password of the user in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully edited user password
 *       403:
 *         description: Password does't match
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: Enter the valid credensials
 */

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

/**
 * @swagger
 * /resetToken:
 *   post:
 *     summary: Generate the reset token
 *     description: Generate the reset token by user email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully generated reset token
 *       400:
 *         description: Enter the valid Credensials
 *       500:
 *         description: Internal server error
 */

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

  if (!generateToken || !updateResetToken) {
    return next(createHttpError(500, "Internal server error"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(400, "Enter the valid Credensials"));
  }
  user.resetToken = updateResetToken;

  user.resetTokenExpired = Date.now() + 90000;

  await user.save();

  //  todo --> send gernated token to user email
  return res
    .status(201)
    .send({
      success: true,
      generateResetToken,
      msg: "Token gerneated succesfully",
    });
};

// 363a965d94ce330920eed635e3f53a95e494098f8d2a6ad54cbb2bad7c94d2fe
/**
 * @swagger
 * /resetPassword/{resetToken}:
 *   post:
 *     summary: Reset Password
 *     description: Reset the password using the reset token
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         description: Enter the reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset token generated successfully
 *       401:
 *         description: Enter the valid credensials
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: token expired ,generate new token"
 */

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { resetToken } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword != confirmPassword) {
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
      .status(400)
      .send({ success: false, msg: "token expired ,generate new token" });
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpired = undefined;

  await user.save();

  return res
    .status(200)
    .send({ success: true, msg: "password reset successfully" });
};

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: logout the user
 *     description: it will logout the user
 *     responses:
 *            200:
 *             description: user logout successfully
 *            500:
 *             description: Internal Server Error
 */

const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  return res
    .cookie("token", "")
    .status(200)
    .send({ success: true, msg: "user logout successfully" });
};

/**
 * @swagger
 * /deleteuser:
 *   delete:
 *     summary: delete the user
 *     description: it will delete the user prrmanently
 *     responses:
 *            200:
 *             description: user deleted successfully
 *            500:
 *             description: Internal Server Error
 */
const deleteUser=async (req: Request, res: Response, next: NextFunction) => {

  let user_id = (req as I_CustomRequest).user;

  const user=await User.findOne({_id:user_id.id});


  if (!user) {
    res.clearCookie("token")
    return next(createHttpError(500,"Internal server Error"))
  }

  await user.remove()
  return res
    .cookie("token", "")
    .status(200)
    .send({ success: true, msg: "user deleted successfully" });
};

export {
  userRegister,
  userLogin,
  editUser,
  editPassword,
  resetTokenGen,
  resetPassword,
  userLogout,
  deleteUser
};
