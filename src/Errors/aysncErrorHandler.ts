import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
import createHttpError, { HttpError } from "http-errors";
type func = (req: Request, res: Response, next: NextFunction) => void;

export const asyncErrorHandler = (func: func) => { 
  return async (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve(func(req,res,next)).catch(next)
    try {
     await   func(req,res,next)
    } catch (error) {
     return next(error)   
    }
  };
};