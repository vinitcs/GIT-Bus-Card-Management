import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import { ApiError } from "./utils/ApiError.js";

const port = process.env.PORT || 4000;

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });

    // handling api error send by server.
    app.use((err, req, res, next) => {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
          success: err.success,
          message: err.message,
          errors: err.errors,
        });
      }

      // Fallback for any other errors
      res.status(500).json({
        success: false,
        // message: "Internal Server Error",
        message: err.message
      });
    });

    app.listen(port, () => {
      console.log(`Server is running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!", err);
  });

/*  
// Using IIFE's approach

import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR: ", error);
    throw error;
  }
})();

*/
