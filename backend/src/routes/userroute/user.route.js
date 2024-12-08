import { Router } from "express";
import { registerUser } from "../../controllers/usercontroller/user.register.controller.js";
import { verifyemail } from "../../controllers/usercontroller/verifyemail.js";
import { loginUser } from "../../controllers/usercontroller/user.login.controller.js";
import { logoutUser } from "../../controllers/usercontroller/user.logout.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware/auth.middleware.js";
import { forgotPassword } from "../../controllers/usercontroller/user.forgot.password.controller.js";
import { resetPassword } from "../../controllers/usercontroller/reset.password.controller.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/verifyemail").post(verifyemail);
router.route("/login").post(loginUser);
//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").patch(resetPassword)


export default router;