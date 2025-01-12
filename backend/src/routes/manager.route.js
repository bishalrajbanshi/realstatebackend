import { Router } from "express";
import {
  fetchForm,
  viewEnqueryData,
  fetchSellerForm,
  loginManager,
  logoutmanager,
  managerdetailsSend,
  managerPosts,
  viewSeller,
  fetchAllForms,
  stateCheckingSeller,
  stateCheckingEnquery,
} from "../controller/allManager.services.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware/auth.middleware.js";
import { Manager } from "../models/manager.model.js";
import { upload } from "../utils/helper/multer.js";

const router = Router();

router.route("/login").post(loginManager);
router.route("/logout").post(verifyJWT(Manager), logoutmanager);
router.route("/managerdetails").get(verifyJWT(Manager), managerdetailsSend);
router.route("/enqueryfrom").get(verifyJWT(Manager), fetchForm);
router.route("/viewdata/:formId").get(verifyJWT(Manager),viewEnqueryData)
router.route("/fetchallseller").get(verifyJWT(Manager), fetchSellerForm);
router.route("/updatestate/:sellerId").patch(verifyJWT(Manager),stateCheckingSeller)
router.route("/updatestates/:enqueryId").patch(verifyJWT(Manager),stateCheckingEnquery)
router.route("/view/:sellerId").get(verifyJWT(Manager), viewSeller);
router.route("/post/:sellerId").post(
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
  managerPosts
);
router.route("/fetchallforms").get(verifyJWT(Manager), fetchAllForms);


export default router;
