import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verifyToken } from "../helpers/verifyToken";
import { JwtPayload } from "jsonwebtoken";
import { userPayload } from "../interfaces/userSchemaInterface";

export interface I_CustomRequest extends Request {
  user: userPayload;
}

export const isUserAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    
  const token: string = req.cookies?.token;
  if (!token) {
    return next(createHttpError(400, "Make a login ,session expired"));
  }
  const userPayload = await verifyToken(token);

  if (!userPayload) {
    return next(createHttpError(400, "Make a login"));
  }

  (req as I_CustomRequest).user=userPayload

  next();
};
