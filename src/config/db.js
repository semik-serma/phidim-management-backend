import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error("MONGO_DB_URI is missing in .env");
    }

    const connection = await mongoose.connect(
      process.env.MONGO_DB_URI
    );

    console.log(
      `Database connected successfully: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error(
      "Error while connecting database:",
      error.message
    );

    throw error;
  }
};

export default connectDB;