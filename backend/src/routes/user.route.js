import Router from "express";
import {
  forgotPassword,
  login,
  logout,
  registerUser,
  resendOtp,
  resetPassword,
  editDetails,
  changePassword,
  sendDetials,
  userForm,
  verifyEmails,
  userSellerForm,
  fetchAllPosts,
  viewPropertyData,
  userPurchaseData,generateAccessToken,
  changeUserEmail
} from "../controller/allUser.services.controller.js";

import { middlewares } from "../middlewares/index.js";
const { verifyJWT } = middlewares;

import { User } from "../models/user.model.js";

const router = Router();


router.route("/refresh").post(generateAccessToken)
router.route("/register").post(registerUser);
router.route("/verifyemail").post(verifyEmails);
router.route("/verifymail").post(verifyJWT(User),verifyEmails);
router.route("/resendotp").post(resendOtp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT(User),logout);
router.route("/changeemail").patch(verifyJWT(User),changeUserEmail)
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").patch(resetPassword);
router.route("/changepassword/:role/:userId").patch(verifyJWT(User),changePassword);
router.route("/edit/:role/:userId").patch(verifyJWT(User),editDetails)
router.route("/userdetails").get(verifyJWT(User),sendDetials)
router.route("/enqueryproperty").post(verifyJWT(User),userForm);
router.route("/sellproperty").post(verifyJWT(User),userSellerForm);
router.route("/posts").get(fetchAllPosts);
router.route("/viewproperty/:postId").get(viewPropertyData)
router.route("/getcall/:postId").post(verifyJWT(User),userPurchaseData);


export default router;
