import jwt from "jsonwebtoken";

export const generateAccessToken = async (userId) => {
  const token = await jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};

export const generateRefreshToken = async (userId) => {
  const token = await jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};
