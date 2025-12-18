import express from "express";
import { UserController } from "../controller/user.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/register", UserController.registerUser);
userRouter.post("/login", UserController.loginUser);
userRouter.get("/verify-email", UserController.verifyUserEmail);

// Test
userRouter.get("/test", AuthMiddleware, (req, res) => {
  res.send(
    `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Welcome!</h1>
      </body>
    </html>
    `
  );
});

export default userRouter;
