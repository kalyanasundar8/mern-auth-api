import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.env.MAILTRAP_TOKEN;

const transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: process.env.MAILTRAP_TOKEN_TWO,
  },
});

const sender = {
  address: "hello@demomailtrap.co",
  name: "Email setup",
};

export const sendEmail = async (user_email, verification_link) => {
  try {
    await transport.sendMail({
      from: sender,
      to: user_email,
      subject: "Email from mern auth",
      text: "Verfication email from mern auth",
      html: verification_link,
      category: "Mail test",
    });
    console.log("Email sent successfuly");
  } catch (error) {
    console.log(TOKEN);
    console.log("Email error: ", error);
    throw new Error("Failed to send email ", error);
  }
};
