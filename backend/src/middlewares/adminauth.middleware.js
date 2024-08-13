import { Admin } from "../models/admin.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.adminAccessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized admin request");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ADMIN_ACCESS_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id).select("-adminPassword ");

    if (!admin) {
      throw new ApiError(401, "Invalid Admin Access Token");
    }

    req.admin = admin;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid Access Token for Admin "
    );
  }
});
