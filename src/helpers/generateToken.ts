import jwt, { JwtPayload } from "jsonwebtoken"

import { config } from "../config/config"
import { userPayload } from "../interfaces/userSchemaInterface"

type generateJWT=(userData:JwtPayload)=>string|null

export const generateToken:generateJWT=(userData)=>{

    if (config?.jwtSecret) {
      return  jwt.sign(userData,config.jwtSecret)
    }

    return  null
}