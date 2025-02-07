import { Router } from "express";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/common/asyncHandler.js";
import {
  deleteMannagers,
  fetchAllManagers,
  generateAccessToken,
  loginadmin,
  logoutadmin,
  forgotPassword,
  resetPassword,
  changePassword,
  registermanager,
  sendadmindetails,
postBymanagerData,
totalUserData,
adminStatsData,
viewAllPosts,
pieChartStats,
viewManagerAllData,
viewAllManagerPost
} from "../controller/allAdmin.services.controller.js";
import { middlewares } from "../middlewares/index.js";

const { upload,verifyJWT } = middlewares;

const router = Router();
router.route("/refresh").post(generateAccessToken)
router.route("/login").post(loginadmin);
router.route("/logout").post(verifyJWT(Admin), logoutadmin);
router.route("/forgotpwd").post(forgotPassword);
router.route("/reset").patch(resetPassword);
router.route("/changepwd/:role/:userId").patch(verifyJWT(Admin),changePassword);
router.route("/register-manager").post(verifyJWT(Admin),
upload.fields([
  {
    name: "avatar",
    maxCount:1
  }
]),
asyncHandler(registermanager)
);
router.route("/admindetails").get(verifyJWT(Admin),sendadmindetails);
router.route("/allmanager").get(verifyJWT(Admin),fetchAllManagers);
router.route("/delete/:managerId").delete(verifyJWT(Admin),deleteMannagers);
router.route("/manager-data/:managerId").get(verifyJWT(Admin),postBymanagerData)


router.route("/totaluser").get(verifyJWT(Admin),totalUserData)

router.route("/view-post").get(verifyJWT(Admin),viewAllPosts)

router.route("/admin-stats").get(verifyJWT(Admin),adminStatsData)

router.route("/pie-chart").get(verifyJWT(Admin),pieChartStats)

router.route("/viwe/data/:managerId").get(verifyJWT(Admin),viewManagerAllData)

router.route("/view-manager/posts/:managerId").get(verifyJWT(Admin),viewAllManagerPost)



export default router;
