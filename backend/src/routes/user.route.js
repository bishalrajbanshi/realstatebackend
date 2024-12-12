import { Router } from "express";
import { registerUser } from "../controllers/user/user.register.controller.js";
import { verifyemail } from "../controllers/verifyemail.js";
import { loginUser } from "../controllers/user/user.login.controller.js";
import { logoutUser } from "../controllers/user/user.logout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware/auth.middleware.js";
import { forgotPassword } from "../controllers/user/user.forgot.password.controller.js";
import { resetPassword } from "../controllers/user/reset.password.controller.js";
import { User } from "../models/user.model.js";
import { userSellerForm } from "../controllers/user/user.seller.controller.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/verifyemail").post(verifyemail);
router.route("/login").post(loginUser);
//secured routes
router.route("/logout").post(verifyJWT(User),logoutUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").patch(resetPassword)

router.route("/senddata").post(verifyJWT(User),userSellerForm)


export default router;