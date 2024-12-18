import { Router } from "express";
import { registerManager } from "../controllers/adminAndManager/admin/manager.register.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
import { Manager } from "../models/manager.model.js";
import { adminManagerLogout } from "../controllers/adminAndManager/admin.manager.logout.controller.js";
import { adminManagerlogin } from "../controllers/adminAndManager/admin.manager.login.controller.js";
import { managerDetails } from "../controllers/adminAndManager/manager/manager.details.sender.js";
const router = Router();


router.route("/login").post(adminManagerlogin)
router.route("/managerDetails").get(verifyJWT(Manager),managerDetails)
router.route("/logout").post(verifyJWT(Manager), adminManagerLogout);


export default router;