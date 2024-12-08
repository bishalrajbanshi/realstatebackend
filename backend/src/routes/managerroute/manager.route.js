import Router from "express"
import { managerRegister } from "../../controllers/managercontroller/manager.register.controller.js";
import { loginManager } from "../../controllers/managercontroller/manager.login.controller.js";
// import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.route("/manager-register").post(
    
    managerRegister
)
router.route("/manager-login").post(loginManager)

export default router;