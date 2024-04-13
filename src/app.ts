import express, { Express, NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Express = express();

app.get("/test",  (req, res, next) => {
  const error = createHttpError(500, "Something went wrong");
  throw error;
});

app.use(globalErrorHandler);

export default app;
