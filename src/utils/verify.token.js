import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedToken);
};
