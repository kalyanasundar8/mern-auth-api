import jwt from "jsonwebtoken";

export const verifyEmailToken = async (token) => {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
