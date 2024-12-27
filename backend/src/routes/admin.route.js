import { Router } from "express";
import { Admin } from "../models/admin.model.js";

import { utils } from "../utils/index.js";
const{ upload }=utils;

import {
  deleteMannagers,
  fetchAllManagers,
  loginadmin,
  logoutadmin,
  registermanager,
  sendadmindetails,
  totalForms,
} from "../controller/allAdmin.services.controller.js";

import { middlewares } from "../middlewares/index.js";
const { verifyJWT } = middlewares;

const router = Router();

router.route("/login").post(loginadmin);
router.route("/logout").post(verifyJWT(Admin), logoutadmin);
router.route("/register-manager").post(verifyJWT(Admin),
upload.fields([
  {
    name: "avatar",
    maxCount:1
  }
]),
registermanager
);
router.route("/admindetails").get(verifyJWT(Admin),sendadmindetails);
router.route("/allmanager").get(verifyJWT(Admin),fetchAllManagers);
router.route("/delete/:managerId").delete(verifyJWT(Admin),deleteMannagers);
router.route("/total-forms").get(verifyJWT(Admin),totalForms)
export default router;
