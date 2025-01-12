import Router from "express";
import {
  forgotPassword,
  login,
  logout,
  registerUser,
  resendOtp,
  resetPassword,
  sendDetials,
  userForm,
  verifyEmail,
  userSellerForm,
  fetchAllPosts,
  viewPropertyData,
  userPurchaseData
} from "../controller/allUser.services.controller.js";

import { middlewares } from "../middlewares/index.js";
const { verifyJWT } = middlewares;

import { User } from "../models/user.model.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verifyemail").post(verifyEmail);
router.route("/resendotp").post(resendOtp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT(User),logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").patch(resetPassword);
router.route("/userdetails").get(verifyJWT(User),sendDetials)
router.route("/enqueryfrom").post(verifyJWT(User),userForm);
router.route("/sellerfrom").post(verifyJWT(User),userSellerForm);
router.route("/posts").get(fetchAllPosts);
router.route("/viewproperty/:postId").get(viewPropertyData)
router.route("/getcall/:postId").post(verifyJWT(User),userPurchaseData);

export default router;
