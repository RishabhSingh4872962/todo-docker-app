import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
import { userPayload } from "../interfaces/userSchemaInterface";

type verifyJWT = (token: string) => userPayload | null;

export const verifyToken: verifyJWT = (token: string) => {
  if (config?.jwtSecret) {
    // console.log(jwt.verify(token, config?.jwtSecret, { complete: true }));

    return jwt.verify(token, config?.jwtSecret, { complete: true })
      .payload as userPayload;
  }
  return null;
};
