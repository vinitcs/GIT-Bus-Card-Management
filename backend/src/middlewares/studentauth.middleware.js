import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Student } from "../models/student.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // res is not in used. Thus, change res to '_'
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const student = await Student.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!student) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.student = student; // add to req.student giving access of student that is Student document [req.anyName  any name can be given for readliablity]
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
