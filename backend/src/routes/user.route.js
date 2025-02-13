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
  deleteSellerData,
  getSellerproperty,
  userPurchaseData,
  changeUserEmail,
  viewUserEnqueryData,
  deleteEnqueryForm,
  userCart,
  getCartProduct,
  deleteCartData,
  googleAuthCallback,
  generateAccessTokens,
} from "../controller/user.services.controller.js";

//posts controller imports
import { viewFeaturedPostData,fetchAllPosts,viewPropertyDetails } from "../controller/property.post.controller.js";

import passport from "passport";

import { middlewares } from "../middlewares/index.js";
const { verifyJWT } = middlewares;

import { User } from "../models/user.model.js";

const router = Router();

//generate new access-token route 
router.route("/refresh").post(generateAccessTokens)
//register user
router.route("/register").post(registerUser);

//verify email and resend otp
router.route("/verifyemail").post(verifyEmails);
router.route("/verifymail").post(verifyJWT(User),verifyEmails);
router.route("/resendotp").post(resendOtp);

//change user email
router.route("/changeemail").patch(verifyJWT(User),changeUserEmail)

//login / logout
router.route("/login").post(login);
router.route("/logout").post(verifyJWT(User),logout);

// forgot password
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").patch(resetPassword);
router.route("/changepassword/:role/:userId").patch(verifyJWT(User),changePassword);

//edit user details 
router.route("/userdetails").get(verifyJWT(User),sendDetials)
router.route("/edit/:role/:userId").patch(verifyJWT(User),editDetails)

//enquery property
router.route("/enqueryproperty").post(verifyJWT(User),userForm);
router.route("/viewenquerydata").get(verifyJWT(User),viewUserEnqueryData)
router.route("/deleteenquery/:enqueryId").delete(verifyJWT(User),deleteEnqueryForm)

//cart items
router.route("/cartproperty").get(verifyJWT(User),getCartProduct)
router.route("/cart/:postId").post(verifyJWT(User),userCart);
router.route("/deleteproperty/:postId").delete(verifyJWT(User),deleteCartData)


//seller
router.route("/sellproperty").post(verifyJWT(User),userSellerForm);
router.route("/sellerdata").get(verifyJWT(User),getSellerproperty);
router.route("/delete/:sellerId").delete(verifyJWT(User),deleteSellerData)


//posts
router.route("/property").get(fetchAllPosts);
router.route("/property-details/:postId").get(viewPropertyDetails)
router.route("/getcall/:postId").post(verifyJWT(User),userPurchaseData);

//featured posts
router.route("/featured-posts").get(viewFeaturedPostData)



// Google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get(
  "/auth/google/callback",  
  passport.authenticate("google", { session: false }), 
  (req, res, next) => {
    console.log("Reached callback handler");
    googleAuthCallback(req, res, next);
  }
);



export default router;
