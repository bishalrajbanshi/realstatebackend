import { Router } from "express";
import {
  generateAccessToken,
  fetchForm,
  viewEnqueryData,
  totalEnqueryData,
  totalSellerData,
  fetchSellerForm,
  loginManager,
  logoutmanager,
  forgotPassword,
  resetPassword,
  editDetails,
  changePassword,
  changeManagerEmail,
  verifyEmails,
  managerdetailsSend,
  managerPosts,
  deletePosts,
  editPostbyManager,
  viewSeller,
  fetchAllForms,
  fetchBuyerData,
  stateCheckingSeller,
  stateCheckingEnquery,
  stateCheckingBuyer
} from "../controller/allManager.services.controller.js";
import { verifyJWT } from "../middlewares/general/auth.middleware.js";
import { Manager } from "../models/manager.model.js";
import { middlewares } from "../middlewares/index.js";
const{upload} = middlewares;

const router = Router();
router.route("/refresh").post(generateAccessToken)
router.route("/login").post(loginManager);
router.route("/logout").post(verifyJWT(Manager), logoutmanager);
router.route("/forgotpwd").post(forgotPassword)
router.route("/resetpwd").patch(resetPassword)

//edit manager
router.route("/managerdetails").get(verifyJWT(Manager), managerdetailsSend);
router.route("/edit/:role/:userId").patch(verifyJWT(Manager),editDetails)
router.route("/changeemail").patch(verifyJWT(Manager),changeManagerEmail)
router.route("/verifymail").post(verifyJWT(Manager),verifyEmails);
router.route("/changepassword/:role/:userId").patch(verifyJWT(Manager),changePassword);3

// enquery from
router.route("/enqueryfrom").get(verifyJWT(Manager), fetchForm);
router.route("/enquery/:formId/data").get(verifyJWT(Manager),viewEnqueryData)
router.route("/enquerystate/:enqueryId").patch(verifyJWT(Manager),stateCheckingEnquery)
router.route("/totalenquery").get(verifyJWT(Manager),totalEnqueryData)

//seller datate change
router.route("/fetchallseller").get(verifyJWT(Manager), fetchSellerForm);
router.route("/seller/:sellerId/data").get(verifyJWT(Manager), viewSeller);
router.route("/sellerstate/:sellerId").patch(verifyJWT(Manager),stateCheckingSeller)
router.route("/totalseller").get(verifyJWT(Manager),totalSellerData);

//manager  post
router.route("/post/:userId").post(
  verifyJWT(Manager),
  upload.fields([
     {
      name: "avatar",
      maxCount: 1,
    },
    {
        name: "images",
        maxCount:8
    }
  ]),
  managerPosts);
router.route("/editpost/:postId").patch(verifyJWT(Manager),editPostbyManager);
router.route("/deletepost/:postId").delete(verifyJWT(Manager),deletePosts)

//buy property
router.route("/fetchallforms").get(verifyJWT(Manager), fetchAllForms);
router.route("/fetchdata/:postId").get(verifyJWT(Manager),fetchBuyerData);
router.route("/buyserstate/:buyerId").patch(verifyJWT(Manager),stateCheckingBuyer);


export default router;
