import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

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

export const sendEmail = async (user_email) => {
  try {
    await transport.sendMail({
      from: sender,
      to: user_email,
      subject: "Email from mern auth",
      text: "Verfication email from mern auth",
      html: `
      <h2>Welcome to MERN AUTH</h2>
      <p>Please verify email to continue.</p>
      `,
      category: "Mail test",
    });
    console.log("Email sent successfuly");
  } catch (error) {
    console.log(TOKEN);
    console.log("Email error: ", error);
    throw new Error("Failed to send email ", error);
  }
};
