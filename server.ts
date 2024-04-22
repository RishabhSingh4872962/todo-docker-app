import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUI from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "test the route",
      description: "the is only test the app",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3001/api/v1/user",
      },{
        url: "http://localhost:3001/api/v1/todo",
      },
    ],
  },
  apis: ["./src/controllers/user/userControllers.ts","./src/controllers/todos/todosControllers.ts"],
};

const swaggerSpecs = swaggerJSDoc(options);

async function runServer() {
  const port = config.port;
  await connectDB().catch(() => {
    process.exit(1);
  });
  app.use("/docs", SwaggerUI.serve, SwaggerUI.setup(swaggerSpecs));
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
  });
}

runServer();
