import { Router } from "express";
import { adminManagerlogin } from "../controllers/admin.manager/admin.login.controller.js";
import { adminManagerLogout } from "../controllers/admin.manager/admin.logout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
import { Manager } from "../models/manager.model.js";
import { registerManager } from "../controllers/admin.manager/manager.register.controller.js";


const router = Router();

//registermanager 
router.post("/register-manager", verifyJWT(Admin), registerManager);
router.route("/login").post(adminManagerlogin)
router.route("/logout").post(verifyJWT(Admin), adminManagerLogout);
// router.route("/manager/logout").post(verifyJWT(Manager), adminManagerLogout);



export default router