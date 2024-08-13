import { Router } from "express";
import { verifyAdminJWT } from "../middlewares/adminauth.middleware.js";
import {
  adminDataAboutUs,
  deleteStudentById,
  feeRemainder,
  getAllowStudentUpdateFeatureStatus,
  getCurrentAdmin,
  listallstudentdata,
  loginAdmin,
  logoutAdmin,
  nextDueDateSet,
  registerAdmin,
  toggleStudentUpdate,
  updateStudentCardDetailsById,
  verifyAdminJwtToken,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/adminregister").post(registerAdmin);
// http://localhost:3000/api/v1/admin/adminregister

router.route("/adminlogin").post(loginAdmin);
// http://localhost:3000/api/v1/admin/adminlogin

router.route("/adminaboutusdisaplay").get(adminDataAboutUs);
// http://localhost:3000/api/v1/admin/adminaboutusdisaplay


// Secured routes
router.route("/verifyadmintoken").post(verifyAdminJWT, verifyAdminJwtToken);
// http://localhost:3000/api/v1/admin/verifyadmintoken

router.route("/loggedadmin").get(verifyAdminJWT, getCurrentAdmin);
// http://localhost:3000/api/v1/admin/loggedadmin

router.route("/logoutadmin").post(verifyAdminJWT, logoutAdmin);
// http://localhost:3000/api/v1/admin/logoutadmin

router.route("/listallstudentdata").get(verifyAdminJWT, listallstudentdata);
// http://localhost:3000/api/v1/admin/listallstudentdata

router.route("/nextduedateset").patch(verifyAdminJWT, nextDueDateSet);
// http://localhost:3000/api/v1/admin/nextduedateset

router.route("/deletestudent/:id").delete(verifyAdminJWT, deleteStudentById);
// http://localhost:3000/api/v1/admin/deletestudent/id

router
  .route("/updatesinglestudentbuscarddata/:id")
  .patch(verifyAdminJWT, updateStudentCardDetailsById);
// http://localhost:3000/api/v1/admin/updatesinglestudentbuscarddata/id

router
  .route("/allowstudentupdatedetails")
  .patch(verifyAdminJWT, toggleStudentUpdate);
// http://localhost:3000/api/v1/admin/allowstudentupdatedetails


router.route("/getallowstudentupdatefeaturestatus").get(verifyAdminJWT, getAllowStudentUpdateFeatureStatus);
// http://localhost:3000/api/v1/admin/getallowstudentupdatefeaturestatus


router.route("/feeremainder").post(verifyAdminJWT, feeRemainder);
// http://localhost:3000/api/v1/admin/feeremainder

export default router;
