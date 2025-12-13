import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generate.token.js";
import { hashPassword } from "../utils/password.hash.js";
import { userSchema } from "../utils/schemas/user.schema.js";

export class UserService {
  static async registerUser(first_name, last_name, email, password) {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      throw new Error("User already exists!");
    }

    const validation = userSchema.safeParse({
      first_name,
      email,
      password,
    });

    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((err) => err.message)
        .join(", ");

      throw new Error(errorMessage);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
      is_active: true,
    });

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    return {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
