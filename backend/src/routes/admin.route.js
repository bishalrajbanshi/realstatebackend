import { Router } from "express";
import { adminManagerlogin } from "../controllers/adminAndManager/admin.manager.login.controller.js";
import { adminManagerLogout } from "../controllers/adminAndManager/admin.manager.logout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
import { Manager } from "../models/manager.model.js";
import { registerManager } from "../controllers/adminAndManager/admin/manager.register.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { adminDetails } from "../controllers/adminAndManager/admin/admin.detials.sender.js";

const router = Router();

router.route("/login").post(adminManagerlogin);
router.route("/adminDetails").get(verifyJWT(Admin),adminDetails);
router.post("/register-manager",verifyJWT(Admin),
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        }
    ]),
  registerManager
);
router.route("/logout").post(verifyJWT(Admin), adminManagerLogout);

export default router;
