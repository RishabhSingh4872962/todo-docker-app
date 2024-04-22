import express, { Express } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRoutes/userRoute";
import helmet from "helmet";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import todoRoute from "./routes/todoRoutes/todoRoutes";
import { asyncErrorHandler } from "./Errors/aysncErrorHandler";
import { isUserAuthenticated } from "./middlewares/isUserAuthenticated";
const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.use(helmet());
app.use(morgan("tiny"));

//users routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo/", asyncErrorHandler(isUserAuthenticated), todoRoute);

// global error middleware
app.use(globalErrorHandler);

export default app;
