import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // limit use to set how much request will come

app.use(express.urlencoded({ extended: true, limit: "16kb" })); // optional extended:true for now => deals nested objects

app.use(express.static("public")); // use to keep assests, favicon and so on

app.use(cookieParser());

// routes import

import studentRouter from "./routes/student.routes.js";
// student routes decalration
app.use("/api/v1/students", studentRouter);

import adminRouter from "./routes/admin.routes.js";
// admin route decalration
app.use("/api/v1/admin", adminRouter);

export { app };
