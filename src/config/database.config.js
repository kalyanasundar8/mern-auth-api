import mongoose from "mongoose";

export const databaseConnection = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Server connected to database");
  } catch (error) {
    console.log("Database connection error: ", error);
  }
};
