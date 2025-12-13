import express from "express";
import dotenv from "dotenv";
import { databaseConnection } from "./config/database.config.js";
import userRouter from "./routes/user.route.js";
dotenv.config();

// Server
const server = express();

// DB Connection
databaseConnection();

// Setup a middleware
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Routes
server.use("/api/user", userRouter);

// Port
const port = process.env.PORT || 4545;

// Server listening to the port
server.listen(port, () => {
  console.log(`Server listening port: ${port}`);
});
