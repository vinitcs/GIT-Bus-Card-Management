import { Admin } from "../models/admin.models.js";
import { Student } from "../models/student.models.js";
import { Feature } from "../models/features.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";

const formatDateString = (dateString) => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

const generateAccessToken = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const adminAccessToken = admin.generateAdminAccessToken();

    return { adminAccessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating  access token"
    );
  }
};

const adminDataAboutUs = asyncHandler(async (req, res) => {
  try {
    const adminData = await Feature.findOne({}, "adminData");

    if (!adminData || adminData.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No admin data found in feature db"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          adminData,
          "Admin data from feature db fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while fetching admin data from feature db"
    );
  }
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { adminName, adminEmail, adminPassword, phone } = req.body;

  if (
    [adminName, adminEmail, adminPassword, phone].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedAdmin = await Admin.findOne({
    adminEmail,
  });

  if (existedAdmin) {
    throw new ApiError(409, "Admin with admimEmail already exist");
  }

  const admin = await Admin.create({
    adminName,
    adminEmail,
    adminPassword,
    phone,
  });

  const createdAdmin = await Admin.findById(admin._id).select("-adminPassword");

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the admin");
  }

  await Feature.findOneAndUpdate(
    {},
    {
      $push: {
        adminData: {
          adminName: admin.adminName,
          adminEmail: admin.adminEmail,
          phone: admin.phone,
        },
      },
    },
    { new: true, upsert: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdAdmin, "Admin registered successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { adminName, adminPassword } = req.body;

  if (!adminName) {
    throw new ApiError(400, "Admin name is required");
  }

  const admin = await Admin.findOne({ adminName });

  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(adminPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { adminAccessToken } = await generateAccessToken(admin._id);

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-adminPassword"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("adminAccessToken", adminAccessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          admin: loggedInAdmin,
          adminAccessToken,
        },
        "Admin logged in successfully"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("adminAccessToken", options)
    .json(new ApiResponse(200, {}, "Admin logout"));
});

const verifyAdminJwtToken = asyncHandler(async (req, res) => {
  const token = req.cookies.adminAccessToken || req.body.adminAccessToken;

  try {
    if (!token) {
      throw new ApiError(401, "Unauthorized admin request");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ADMIN_ACCESS_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id).select(
      "-adminPassword"
    );

    if (!admin) {
      throw new ApiError(401, "Invalid admin access token");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { admin }, "Admin access token verified"));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid admin access token");
  }
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.admin, "Current admin fetched successfullly")
    );
});

const listallstudentdata = asyncHandler(async (req, res) => {
  try {
    const allStudentsData = await Student.find().select("-password");
    // console.log("All students data fetched:", allStudentsData);

    if (!allStudentsData || allStudentsData.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No student data found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allStudentsData,
          "All student data fetched successfully"
        )
      );
  } catch (error) {
    // console.log("Error in listAllStudentData:", error);
    throw new ApiError(500, "Something went wrong while fetching student data");
  }
});

const nextDueDateSet = asyncHandler(async (req, res) => {
  const { nextDueDate } = req.body;

  if (!nextDueDate) {
    throw new ApiError(400, "Next due date value required");
  }

  const setNextDueDateToAll = await Student.updateMany(
    {},
    { $set: { nextDueDate } }
  );

  if (setNextDueDateToAll.modifiedCount === 0) {
    throw new ApiError(404, "No student records updated");
  }

  const creadtedUpdatedNextDueDate = await Student.find().select("-password");

  if (!creadtedUpdatedNextDueDate) {
    throw new ApiError(
      500,
      "Something went wrong while updating next due date"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "All student next due date set successfully")
    );
});

const deleteStudentById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const deleteStudent = await Student.deleteOne({ _id: id });
    // console.log("Delete Result:", deleteStudent);

    if (deleteStudent.deletedCount === 0) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, {}, "No student found or record already deleted")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Student Deleted Successfully"));
  } catch (error) {
    // console.log("Error in deleting student:", error);
    throw new ApiError(500, "Something went wrong while deleting student");
  }
});

const updateStudentCardDetailsById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { busAllocated, fees, dateOfFeesPaid } = req.body;

  const validBusAllocatedValues = ["1", "2", "3", "NA"];
  const validFeesValues = ["1500", "1800", "NA"];

  if (busAllocated && !validBusAllocatedValues.includes(busAllocated)) {
    throw new ApiError(
      401,
      "Value of busAllocated is not under predefined value"
    );
  }

  if (fees && !validFeesValues.includes(fees)) {
    throw new ApiError(401, "Value of fees is not under predefined value");
  }

  // Find the student to get the current semester
  const student = await Student.findById(id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const updateData = {
    busAllocated,
    fees,
    dateOfFeesPaid,
  };

  // If dateOfFeesPaid is set, add to historyOfPaidFeesDate
  if (dateOfFeesPaid) {
    const newHistoryEntry = `Sem: ${student.currSemester} Date: ${formatDateString(dateOfFeesPaid)}`;

    await Student.findByIdAndUpdate(id, {
      ...updateData,
      $push: { historyOfPaidFeesDate: newHistoryEntry },
    });
  }

  const updateStudentBusCard = await Student.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  const createdUpdatedStudentBusCard = await Student.findById(
    updateStudentBusCard.id
  ).select("-password");

  if (!createdUpdatedStudentBusCard) {
    throw new ApiError(500, "Something went wrong while updating student data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Student card data updated successfully"));
});

const toggleStudentUpdate = asyncHandler(async (req, res) => {
  const { toggleStudentUpdateValue } = req.body;

  if (
    toggleStudentUpdateValue === undefined ||
    toggleStudentUpdateValue === null
  ) {
    throw new ApiError(400, "toggleStudentUpdate Field is required");
  }
  const toggleStudentUpdateValueBoolean = !!toggleStudentUpdateValue;

  const toggleStudentUpdateFeature = await Feature.findOneAndUpdate(
    {},
    {
      $set: {
        toggleStudentUpdateValue: toggleStudentUpdateValueBoolean,
      },
    },
    { new: true, upsert: true }
  );

  if (!toggleStudentUpdateFeature) {
    throw new ApiError(
      500,
      "Something went wrong while updating toggle student update feature"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Toggle student update feature value set to ${toggleStudentUpdateValueBoolean} successfully`
      )
    );
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

const feeRemainder = asyncHandler(async (req, res) => {
  try {
    const allStudents = await Student.find().select("collegeEmail nextDueDate");

    for (const student of allStudents) {
      const { collegeEmail, nextDueDate } = student;
      const message = `
      <h4>Welcome to Bus Card Management Portal</h4>
      <h2>You are receiving this email regarding fees to be paid at "${formatDateString(nextDueDate)}".</h2>
      <i>Thank You!</i>
      `;

      await sendEmail(collegeEmail, "Fee Reminder Notification", message);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Fee reminder email were successfully sent to all students"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while sending email to students"
    );
  }
});

export {
  adminDataAboutUs,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  verifyAdminJwtToken,
  getCurrentAdmin,
  listallstudentdata,
  nextDueDateSet,
  deleteStudentById,
  updateStudentCardDetailsById,
  toggleStudentUpdate,
  getAllowStudentUpdateFeatureStatus,
  feeRemainder,
};
