import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    // const salt = bcrypt.genSalt(10);
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Password hashing error: ", error);
  }
};

export const comparePassword = async (password, hashedPasword) => {
  try {
    return await bcrypt.compare(password, hashedPasword);
  } catch (error) {
    throw new Error("Password comparing error: ", error);
  }
};
