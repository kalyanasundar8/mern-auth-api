import { UserService } from "../services/user.service.js";

export class UserController {
  static async registerUser(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body;
      const user = await UserService.registerUser(
        first_name,
        last_name,
        email,
        password
      );
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
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}
