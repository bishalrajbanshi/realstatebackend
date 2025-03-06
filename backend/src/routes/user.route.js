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
} from "../controller/user.services.controller.js";

//posts controller imports
import { viewFeaturedPostData,fetchAllPosts,viewPropertyDetails,viewPropertyCategory,viewPropertyType,propertyView, propertyViewCount,viewCategoryStats,propertySearch,searchFilters } from "../controller/property.post.controller.js";

import passport from "passport";

import { middlewares } from "../middlewares/index.js";
const { verifyJWT } = middlewares;

import { User } from "../models/user.model.js";

const router = Router();

//generate new access-token route 
router.route("/refresh").post()
//register user
router.route("/register").post(registerUser);

//verify email and resend otp
router.route("/register/verifyemail").post(verifyEmails);
router.route("/verify-email").post(verifyJWT(User),verifyEmails);
router.route("/resendotp").post(resendOtp);
router.route("/resend-otp").post(verifyJWT(User),resendOtp);


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
//property details global
router.route("/property-details/:postId").get(viewPropertyDetails);


//buy property
router.route("/buy/:postId").post(verifyJWT(User),userPurchaseData);

//featured posts
router.route("/featured-posts").get(viewFeaturedPostData);

//view property by category(land,house .....) 
router.route("/category/:category/data").get(viewPropertyCategory)
//view property by type ( residential , commercial)
router.route("/type/:type").get(viewPropertyType);

router.route("/stats-data").get(viewCategoryStats)

//property view  
router.route("/property-view/:postId").post(verifyJWT(User),propertyView);
//property view count 
router.route("/property-count/:postId").get(propertyViewCount);

//search property by id 101 ....
router.route("/search").get(propertySearch)

// filters?category=house&type=residential
router.route("/filters").get(searchFilters);



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
