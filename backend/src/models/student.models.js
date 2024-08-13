import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Please enter Name"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    collegeEmail: {
      type: String,
      required: [true, "Please enter Email"],
      unique: [true, "Email already Exist"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: [true, "Phone already Exist"],
      trim: true,
    },

    department: {
      type: String,
      enum: [
        "Computer Engineering",
        "Chemical Engineering",
        "Entc Engineering",
        "Civil Engineering",
        "Mechnical Engineering",
        "AIML Engineering",
      ],
      required: true,
    },

    yearOfEngineering: {
      type: String,
      enum: ["1", "2", "3", "4"],
      required: true,
    },

    currSemester: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
      required: true,
    },

    location: {
      type: String,
      enum: ["Chiplun", "Khed"],
      required: true,
    },

    stop: {
      type: String,
      required: [true, "Please enter Stop"],
      lowercase: true,
      trim: true,
      required: true,
    },

    password: {
      type: String,
      required: [true, "Please enter Password"],
      trim: true,
    },

    // from down the fields will be handled by admin

    busAllocated: {
      type: String,
      enum: ["1", "2", "3", ""],
      default: "",
    },

    fees: {
      type: String,
      enum: ["1500", "1800", ""],
      default: "",
    },

    dateOfFeesPaid: {
      type: String,
      default: "",
    },

    nextDueDate: {
      type: String,
      default: "",
    },

    historyOfPaidFeesDate: {
      type: [String],
      default: [],
    },

    refreshToken: {
      type: String, // user session
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: String,
    },
  },
  { timestamps: true } // gets createdAt and updatedAt
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.methods.getResetToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //Expired after 15mins

  return resetToken;
};

studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      studentName: this.studentName,
      collegeEmail: this.collegeEmail,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Student = mongoose.model("Student", studentSchema);
