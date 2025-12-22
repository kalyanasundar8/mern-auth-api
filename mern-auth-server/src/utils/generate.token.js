import jwt from "jsonwebtoken";

export const generateAccessToken = async (user_id) => {
  const token = await jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};

export const generateRefreshToken = async (user_id) => {
  const token = await jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};

export const generateVerificationToken = async (email) => {
  const token = await jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  return token;
};