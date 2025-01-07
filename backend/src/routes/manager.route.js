import { Router } from "express";
import { fetchForm, fetchSellerForm, loginManager, logoutmanager, managerdetailsSend, managerPosts, } from "../controller/allManager.services.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware/auth.middleware.js";
import { Manager } from "../models/manager.model.js";

const router= Router();

router.route("/login").post(loginManager);
router.route("/logout").post(verifyJWT(Manager),logoutmanager);
router.route("/managerdetails").get(verifyJWT(Manager),managerdetailsSend);
router.route("/enqueryfrom").get(verifyJWT(Manager),fetchForm);
router.route("/fetchseller").get(verifyJWT(Manager),fetchSellerForm);
router.route("/post/:postId").get(verifyJWT(Manager),managerPosts);
export default router;