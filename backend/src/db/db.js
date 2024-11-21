import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // const connectionInstance =
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    // console.log(`\nMongoDB connected !! DB Host: ${connectionInstance.connection.host}`);  // To check the serverHost
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1); // <-- read about it
  }
};

export default connectDB;
