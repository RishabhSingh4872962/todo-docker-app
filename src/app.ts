import express, { Express, NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app: Express = express();

app.use(express.json());


// test route
app.get("/test",  (req:Request, res:Response, next:NextFunction) => {
  let num=Math.random()*10;
 if (num<2) {
  const error = createHttpError(500, "Something went wrong");
  throw error;
 }
  return res.status(200).send({success:true,msg:"server is working"})
});


// all users routes
app.use("/api/users",userRouter)


// global error middleware
app.use(globalErrorHandler);

export default app;
