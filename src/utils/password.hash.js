import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    // const salt = bcrypt.genSalt(10);
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Password hashing error: ", error);
  }
};
