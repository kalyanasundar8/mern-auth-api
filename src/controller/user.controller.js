import { UserService } from "../services/user.service.js";
import asyncHandler from "express-async-handler";

export class UserController {
  static registerUser = asyncHandler(async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const data = {
      first_name,
      last_name,
      email,
      password,
    };
    const user = await UserService.registerUser(data);
    res.cookie("refresh_token", user.refreshToken, {
      httpOnly: true,
      secure: (process.env.NODE_ENV = "production"),
      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered!",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        access_token: user.accessToken,
      },
    });
  });

  static loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const data = { email, password };

    const user = await UserService.loginUser(data);

    res.cookie("refresh_token", user.refreshToken, {
      httpOnly: true,
      secure: (process.env.NODE_ENV = "production"),
      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User loggedin!",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        access_token: user.accessToken,
      },
    });
  })
}
