import { Router } from "express";
import { adminlogin } from "../controllers/admin.controller.js";

const router = Router();

router.route("/admin-login").post(adminlogin);