import mongoose from "mongoose";
import { Schema } from "mongoose";
import { string } from "zod";

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    verification_email_sent_at: {
      type: Date,
      required: false,
    },
    last_logged_in: {
      type: Date,
      required: false,
    },
    verification_token_expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
