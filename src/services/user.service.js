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
import { loginSchema, userSchema } from "../utils/schemas/user.schema.js";
import { sendEmail } from "../utils/send.email.js";

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

    let user;
    try {
      user = await User.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        is_active: false,
        verification_email_sent_at: new Date(),
      });

      try {
        const isEmailSent = await sendEmail(user.email);
      } catch (error) {
        throw new Error("Failed to send verification email to ", user.email);
      }

      const accessToken = await generateAccessToken(user._id);
      const refreshToken = await generateRefreshToken(user._id);

      return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
        message:
          "User registration successful!, Please check your email to verify your account",
      };
    } catch (error) {
      if (user?.id) {
        await User.deleteOne({ _id: user._id });
      }
      throw error;
    }
  }

  // User Login service
  static async loginUser(userData) {
    let { email, password } = userData;

    const validation = loginSchema.safeParse({
      email,
      password,
    });

    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((err) => err.message)
        .join(", ");
      throw new ValidationError(errorMessage);
    }

    // Sanitize email
    email = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: email });

    if (!userExists) {
      throw new ValidationError("No records found!");
    }

    // Compare password
    const isPasswordMatch = await comparePassword(
      password,
      userExists.password
    );

    if (!isPasswordMatch) {
      throw new ValidationError("Invalid email or password!");
    }

    if (!userExists.is_active) {
      const lastEmailSent = userExists.verification_email_sent_at;
      const canSendEmail =
        !lastEmailSent || Date.now() - lastEmailSent.getTime > 5 * 60 * 1000;

      if (canSendEmail) {
        try {
          await sendEmail(userExists.email);
          await User.updateOne(
            { _id: userExists.id },
            { verification_email_sent_at: new Date() }
          );
        } catch (error) {
          console.log(
            "Failed to send verification email to ",
            userExists.email
          );
        }
      }
    }

    const accessToken = await generateAccessToken(userExists._id);
    const refreshToken = await generateRefreshToken(userExists._id);

    await User.updateOne(
      { _id: userExists.id },
      { last_logged_in: new Date() }
    );

    return {
      id: userExists._id,
      first_name: userExists.first_name,
      last_name: userExists.last_name,
      email: userExists.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: "User loggedin successfuly!",
    };
  }
}
