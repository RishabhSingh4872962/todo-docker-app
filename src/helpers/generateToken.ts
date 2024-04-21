import jwt, { JwtPayload, Secret } from "jsonwebtoken"

import { config } from "../config/config"

type generateJWT=(userData:JwtPayload)=>string|null

export const generateToken:generateJWT=(userData)=>{

    if (config?.jwtSecret) {
      return  jwt.sign(userData,config.jwtSecret)
    }

    return  null
}