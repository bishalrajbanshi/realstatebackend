import { Router } from "express";
import { adminManagerlogin } from "../controllers/admin.manager/admin.login.controller.js";
import { adminManagerLogout } from "../controllers/admin.manager/admin.logout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
import { Manager } from "../models/manager.model.js";
import { registerManager } from "../controllers/admin.manager/manager.register.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//registermanager
router.route("/login").post(adminManagerlogin);
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
