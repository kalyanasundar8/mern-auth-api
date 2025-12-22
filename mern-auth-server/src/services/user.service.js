import User from "../models/user.model.js";
import {
  UserAlreadyExistsError,
  ValidationError,
} from "../utils/custom.errors.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
} from "../utils/generate.token.js";
import { comparePassword, hashPassword } from "../utils/password.hash.js";
import { loginSchema, userSchema } from "../utils/schemas/user.schema.js";
import { sendEmail } from "../utils/send.email.js";
import { verifyEmailToken } from "../utils/verify.token.js";

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
      const verificationToken = await generateVerificationToken(email);
      const tokenExpires = new Date(Date.now() + 5 * 60 * 1000);

      user = await User.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        is_active: false,
        verification_token: verificationToken,
        verification_email_sent_at: new Date(),
        verification_token_expires: tokenExpires,
      });

      try {
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        const isEmailSent = await sendEmail(user.email, verificationLink);
      } catch (error) {
        console.log(error.message);
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

  // Verify email
  static async verifyUserEmail(token) {
    // Verify users token
    const decoded = await verifyEmailToken(token);

    if (!decoded) {
      throw new ValidationError("Invalid or Expired token!");
    }

    // const verificationToken = await User.findOne({ verification_token: token });

    // if (!verificationToken) {
    //   throw new ValidationError(
    //     "Your token is expired, click here to resend verification email"
    //   );
    //

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { is_active: true },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found!");
    }

    return {
      id: user._id,
      email: user.email,
      isActive: user.is_active,
      message: "Email verified successfully",
    };
  }
}
