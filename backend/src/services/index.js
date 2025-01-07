import { userRegister } from "./user/auth/user.Register.js";
import { userLogin } from "./user/auth/user.login.js";
import { userLogout } from "./user/auth/user.logout.js";
import { userverify } from "./user/auth/user.VerifyEmail.js";
import { userResend } from "./user/auth/user.ResendOtp.js";
import { userForgotPassword } from "./user/auth/user.forgotPassword.js";
import { userResetPassword } from "./user/auth/user.resetPassword.js";
import { userDetails } from "./user/auth/user.details.js";
import { managerRegister } from "./adminAndManager/admin/managerRegisterByAdmin.js";
import { adminManagerLogin } from "./adminAndManager/admin.manager.login.js";
import { adminManagerLogout } from "./adminAndManager/admin.manager.logout.js";
import { adminDetails } from "./adminAndManager/admin/admin.Details.js";
import { managerDetails } from "./adminAndManager/manager/manager.details.js";
import { allManagers, deleteManager } from "./adminAndManager/admin/managerServices.js";
import { userEnqueryForm } from "./user/auth/user.enqueryfrom.js";
import { enqueryFormByUser } from "./adminAndManager/manager/allenqueryForm.js";
import { sellerFormByUser } from "./user/auth/user.seller.from.js";
import { sellerUser } from "./adminAndManager/manager/allsellerForm.js";
import { userSellerData } from "./adminAndManager/manager/sellerformdata.js";



export const services = {
    userRegister,
    userLogin,
    userLogout,
    userverify,
    userResend,
    userForgotPassword,
    userResetPassword,
    userDetails,
    managerRegister,
    adminManagerLogin, 
    adminManagerLogout,
    adminDetails,
    managerDetails,
    allManagers,
    deleteManager,
    userEnqueryForm,
    enqueryFormByUser,
    sellerFormByUser,
    sellerUser,
    userSellerData
}