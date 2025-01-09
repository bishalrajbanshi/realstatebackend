import { Router } from "express";
import { fetchForm, fetchSellerForm, loginManager, logoutmanager, managerdetailsSend, managerPosts, viewSeller, } from "../controller/allManager.services.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware/auth.middleware.js";
import { Manager } from "../models/manager.model.js";
import { upload } from "../utils/helper/multer.js";

const router= Router();

router.route("/login").post(loginManager);
router.route("/logout").post(verifyJWT(Manager),logoutmanager);
router.route("/managerdetails").get(verifyJWT(Manager),managerdetailsSend);
router.route("/enqueryfrom").get(verifyJWT(Manager),fetchForm);
router.route("/fetchallseller").get(verifyJWT(Manager),fetchSellerForm);
router.route("/view/:sellerId").get(verifyJWT(Manager),viewSeller)
router.route("/post/:sellerId").post(verifyJWT(Manager),
upload.fields([
    {
        name: "avatar",
        maxCount:5
    }
])
,
managerPosts);
export default router;