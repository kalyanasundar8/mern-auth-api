import User from "../models/user.model.js";
import {
  UserAlreadyExistsError,
  ValidationError,
} from "../utils/custom.errors.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generate.token.js";
import { comparePassword, hashPassword } from "../utils/password.hash.js";
import { userSchema } from "../utils/schemas/user.schema.js";

export class UserService {
  // User registration service
  static async registerUser(userData) {
    const { first_name, last_name, email, password } = userData;

    const validation = userSchema.safeParse({
      first_name,
      email,
      password,
    });

    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((err) => err.message)
        .join(", ");

      throw new ValidationError(errorMessage);
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      throw new UserAlreadyExistsError("User already exists!");
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

  // User Login service
  static async loginUser(userData) {
    const { email, password } = userData;

    // Sanitize email
    email = email?.trim().toLowerCase();

    const userExists = await User.findOne({ email: email });

    if (!userExists) {
      throw new Error("No records found!");
    }

    // Compare password
    const matchedPassword = await comparePassword(
      password,
      userExists.password
    );

    if (matchedPassword) {
      return "You logged In!";
    }

    throw new Error("Invalid credentials!");
  }
}
