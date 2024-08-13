import { Router } from "express";
import {
  changeCurrentPassword,
  deleteStudentAccount,
  forgetPassword,
  getAllowStudentUpdateFeatureStatus,
  getCurrentStudent,
  loginStudent,
  logoutStudent,
  // refreshAccessToken,
  registerStudent,
  resetPassword,
  updateStudentAccountDetails,
  verifyJwtToken,
} from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/studentauth.middleware.js";

const router = Router();

router.route("/register").post(registerStudent); // http://localhost:3000/api/v1/students/register

router.route("/login").post(loginStudent); // http://localhost:3000/api/v1/students/login

router.route("/forgetpassword").post(forgetPassword); // http://localhost:3000/api/v1/students/forgetpassword

router.route("/resetpassword/:token").put(resetPassword); // http://localhost:3000/api/v1/students/resetpassword/token



//secured routes

router.route("/verify-token").post(verifyJWT, verifyJwtToken); // http://localhost:3000/api/v1/students/verify-token

router.route("/logged").get(verifyJWT, getCurrentStudent); // http://localhost:3000/api/v1/students/logged

router.route("/updatedetails").post(verifyJWT, updateStudentAccountDetails); // http://localhost:3000/api/v1/students/updatedetails

router.route("/changecurrentpassword").post(verifyJWT, changeCurrentPassword); // http://localhost:3000/api/v1/students/change-current-password

router.route("/deletestudentaccount").post(verifyJWT, deleteStudentAccount); // http://localhost:3000/api/v1/students/delete-student-account

router.route("/logout").post(verifyJWT, logoutStudent); // http://localhost:3000/api/v1/students/logout

router.route("/getallowstudentupdatefeaturestatus").get(verifyJWT, getAllowStudentUpdateFeatureStatus);
// http://localhost:3000/api/v1/students/getallowstudentupdatefeaturestatus



// router.route("/refresh-token").post(refreshAccessToken); // http://localhost:3000/api/v1/students/refresh-token

export default router;
