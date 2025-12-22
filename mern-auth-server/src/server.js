import express from "express";
import dotenv from "dotenv";
import { databaseConnection } from "./config/database.config.js";
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./middleware/errorhandler.middleware.js";
dotenv.config();
import cors from "cors";

// Server
const server = express();

// DB Connection
databaseConnection();

// Setup a middleware
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cors());

// Routes
server.use("/api/user", userRouter);

server.use(errorHandler);

// Port
const port = process.env.PORT || 4545;

// Server listening to the port
server.listen(port, () => {
  console.log(`Server listening port: ${port}`);
});
