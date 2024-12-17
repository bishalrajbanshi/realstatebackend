import { Router } from "express";
import { registerManager } from "../controllers/admin.manager/manager.register.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
import { Manager } from "../models/manager.model.js";
import { adminManagerLogout } from "../controllers/admin.manager/admin.logout.controller.js";
import { adminManagerlogin } from "../controllers/admin.manager/admin.login.controller.js";
const router = Router();


router.route("/login").post(adminManagerlogin)
router.route("/logout").post(verifyJWT(Manager), adminManagerLogout);


export default router;