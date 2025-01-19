import { Router } from "express";
import { Admin } from "../models/admin.model.js";

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
  totalPostsData,
postBymanagerData
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
registermanager
);
router.route("/admindetails").get(verifyJWT(Admin),sendadmindetails);
router.route("/allmanager").get(verifyJWT(Admin),fetchAllManagers);
router.route("/delete/:managerId").delete(verifyJWT(Admin),deleteMannagers);
router.route("/totaldata").get(verifyJWT(Admin),totalPostsData);
router.route("/posts/:managerId").get(verifyJWT(Admin),postBymanagerData)


export default router;
