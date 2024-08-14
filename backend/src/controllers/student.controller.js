import { Student } from "../models/student.models.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { Feature } from "../models/features.model.js";

const generateAccessAndRefreshTokens = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerStudent = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if student already exist: email
  // create student object - create entry in db
  // remove password and refresh token field from response
  // check for student creation
  // return res else error

  const {
    studentName,
    collegeEmail,
    phone,
    department,
    yearOfEngineering,
    currSemester,
    location,
    stop,
    password,
  } = req.body;

  // console.log(req.body);

  if (
    [
      studentName,
      collegeEmail,
      phone,
      department,
      yearOfEngineering,
      currSemester,
      location,
      stop,
      password,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const validateCollegeEmail = (email) => {
    const regex = /^en\d{8}@git-india.edu.in$/;
    return regex.test(email);
  };

  if (!validateCollegeEmail(collegeEmail)) {
    throw new ApiError(
      409,
      "Please enter a valid college email (e.g., en12345678@git-india.edu.in)"
    );
  }

  const existedStudent = await Student.findOne({
    $or: [{ collegeEmail }],
  });

  if (existedStudent) {
    throw new ApiError(409, "Student with collegeEmail already exists");
  }

  const student = await Student.create({
    studentName,
    collegeEmail,
    phone,
    department,
    yearOfEngineering,
    currSemester,
    location,
    stop,
    password,
    busAllocated: "", // Default value
    fees: "", // Default value
    dateOfFeesPaid: "", // Default value
    nextDueDate: "", // Default value
  });

  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  // console.log(createdStudent);

  if (!createdStudent) {
    throw new ApiError(
      500,
      "Something went wrong while registering the student"
    );
  }

  const message = `
  <h2>Dear ${createdStudent.studentName},</h2>
  
  <h3>Congratulations! You have successfully registered for your GIT Bus Card. We're thrilled to have you onboard and appreciate you taking the time to create an account with us.
  <br/>
  Thank you for joining the GIT Bus Card portal. Your journey with us starts here, and we're excited to provide you with a seamless and efficient service.
  <br/>
  If you have any questions or need assistance, don't hesitate to reach out. We're here to help!
  </h3>

  <i>Warm regards,</i>
  <h4>The GIT Bus Card Admin</h4>
  `;

  await sendEmail(
    createdStudent.collegeEmail,
    "Welcome to GIT Bus Card - Registration Successful!",
    message
  );

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdStudent, "Student registered successfully")
    );
});

const loginStudent = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie (secure)

  const { collegeEmail, password } = req.body;
  if (!collegeEmail) {
    throw new ApiError(400, "College email is required");
  }

  const student = await Student.findOne({
    $or: [{ collegeEmail }],
  });

  if (!student) {
    throw new ApiError(404, "Student does not exist");
  }

  const isPasswordValid = await student.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    student._id
  );

  const loggedInStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  // console.log(loggedInStudent);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          student: loggedInStudent,
          accessToken,
          refreshToken,
        },
        "Student logged in successfully"
      )
    );
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { collegeEmail } = req.body;

  if (!collegeEmail) {
    throw new ApiError(400, "College email is required");
  }

  const student = await Student.findOne({
    $or: [{ collegeEmail }],
  });

  if (!student) {
    throw new ApiError(404, "Student does not exit");
  }

  const resetToken = await student.getResetToken();
  await student.save();

  // Send token via email
  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `Click on the link to reset your password. ${url}. If you have not request then ignore.`;

  await sendEmail(
    student.collegeEmail,
    "GIT Bus Management System Reset Password",
    message
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Reset token has been send to ${student.collegeEmail}`
      )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const student = await Student.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!student) {
    throw new ApiError(404, "Token is invalid or has been expired");
  }

  student.password = req.body.password;
  student.resetPasswordToken = undefined;
  student.resetPasswordExpire = undefined;

  await student.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Reset Successfully"));
});

const logoutStudent = asyncHandler(async (req, res) => {
  // Reset refreshToken
  // Clear Cookies

  await Student.findByIdAndUpdate(
    req.student._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Student logout"));
});

const verifyJwtToken = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken || req.body.accessToken;

  try {
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const student = await Student.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!student) {
      throw new ApiError(401, "Invalid access token");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { student }, "Access token verified"));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken =
//     req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "Unauthorized request");
//   }

//   try {
//     const decodedToken = jwt.verify(
//       incomingRefreshToken,
//       process.env.REFRESH_TOKEN_SECRET
//     );

//     const student = Student.findById(decodedToken?._id);

//     if (!student) {
//       throw new ApiError(401, "Invalid refresh token");
//     }

//     if (incomingRefreshToken !== student?.refreshToken) {
//       throw new ApiError(401, "Refresh token is expired or used");
//     }

//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     const { accessToken, newRefreshToken } =
//       await generateAccessAndRefreshTokens(student._id);

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", newRefreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             accessToken,
//             refreshToken: newRefreshToken,
//           },
//           "Access token refreshed"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid refresh token");
//   }
// });

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // can also add for confirmPassword
  // if (!(newPassword === confirmPassword)) {
  //   throw new ApiError(400, "Invalid new password and confirm password");
  // }

  const student = await Student.findById(req.student?._id);
  const isPasswordCorrect = await student.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  student.password = newPassword;
  await student.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully..."));
});

const getCurrentStudent = asyncHandler(async (req, res) => {
  // console.log("logged student: ",req.student);

  return res
    .status(200)
    .json(
      new ApiResponse(200, req.student, "Current student fetched successfully")
    );
});

const updateStudentAccountDetails = asyncHandler(async (req, res) => {
  const {
    studentName,
    collegeEmail,
    phone,
    department,
    yearOfEngineering,
    currSemester,
    location,
    stop,
  } = req.body;

  const validYearOfEnggOptionsValues = ["1", "2", "3", "4", "NA"];
  const valiCurrSemesterValues = ["1", "2", "3", "4", "5", "6", "7", "8", "NA"];

  if (
    yearOfEngineering &&
    !validYearOfEnggOptionsValues.includes(yearOfEngineering)
  ) {
    throw new ApiError(
      401,
      "Value of yearOfEngineering is not under predefined value"
    );
  }

  if (currSemester && !valiCurrSemesterValues.includes(currSemester)) {
    throw new ApiError(
      401,
      "Value of currSemester is not under predefined value"
    );
  }

  const student = await Student.findByIdAndUpdate(
    req.student?._id,
    {
      $set: {
        studentName,
        collegeEmail,
        phone,
        department,
        yearOfEngineering,
        currSemester,
        location,
        stop,
      },
    },
    { new: true }
  );

  const createUpdatedStudent = await Student.findById(student._id).select(
    "-password"
  );

  if (!createUpdatedStudent) {
    throw new ApiError(500, "Something went wrong while updating the student");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createUpdatedStudent,
        "Student details update successfully"
      )
    );
});

const deleteStudentAccount = asyncHandler(async (req, res) => {
  await Student.findByIdAndDelete(req.student._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Student Account deleted successfully..."));
});

const getAllowStudentUpdateFeatureStatus = asyncHandler(async (req, res) => {
  try {
    const featureStatus = await Feature.findOne({});
    res.status(200).json(
      new ApiResponse(200, {
        toggleStudentUpdateValue: featureStatus.toggleStudentUpdateValue,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch feature status");
  }
});

export {
  registerStudent,
  loginStudent,
  forgetPassword,
  resetPassword,
  logoutStudent,
  verifyJwtToken,
  // refreshAccessToken,
  changeCurrentPassword,
  getCurrentStudent,
  updateStudentAccountDetails,
  deleteStudentAccount,
  getAllowStudentUpdateFeatureStatus,
};
