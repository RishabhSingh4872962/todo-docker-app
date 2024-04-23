import { Request ,Response,NextFunction} from 'express';
import { HttpError } from 'http-errors';
import { config } from '../config/config';


export const globalErrorHandler=function(err: HttpError, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500;
    const errorStack = config.env === "Development" ? (err?.errors) ? err?.errors: err.stack  : "Internal server Error";
  
    
    return res.status(statusCode).send({ message: err.message, errorStack });
  }