import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: [true, "Please enter adminName"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    adminEmail: {
      type: String,
      required: [true, "Please enter adminEmail"],
      unique: [true, "Email already Exist"],
      lowercase: true,
      trim: true,
    },

    adminPassword: {
      type: String,
      required: [true, "Please enter Password"],
      trime: true,
    },

    phone: {
      type: String,
      unique: [true, "Phone already Exist"],
      trim: true,
      default: "NA",
    },
  },
  { timestamps: true } // gets createdAt and updateAt
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("adminPassword")) return next();

  this.adminPassword = await bcrypt.hash(this.adminPassword, 10);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (adminPassword) {
  return await bcrypt.compare(adminPassword, this.adminPassword);
};

adminSchema.methods.generateAdminAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      adminName: this.adminName,
      adminEmail: this.adminEmail,
    },
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
