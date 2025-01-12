import { userRegister } from "./user/auth/user.Register.js";
import { userLogin,userDetails } from "./user/auth/user.login.js";
import { userLogout } from "./user/auth/user.logout.js";
import { userverify } from "./user/auth/user.VerifyEmail.js";
import { userResend } from "./user/auth/user.ResendOtp.js";
import { userForgotPassword } from "./user/auth/user.forgotPassword.js";
import { userResetPassword } from "./user/auth/user.resetPassword.js";
import { managerRegister } from "./adminAndManager/admin/managerRegisterByAdmin.js";
import { adminManagerLogin } from "./adminAndManager/admin.manager.login.js";
import { adminManagerLogout } from "./adminAndManager/admin.manager.logout.js";
import { adminDetails } from "./adminAndManager/admin/admin.Details.js";
import { managerDetails } from "./adminAndManager/manager/manager.details.js";
import { allManagers, deleteManager } from "./adminAndManager/admin/managerServices.js";
import { userEnqueryForm } from "./user/property/user.enquery.property.js";
import { enquertState, enqueryFormByUser,viewEnqueryForm } from "./adminAndManager/manager/viewenquerydata.js";
import { sellerFormByUser } from "./user/property/user.sell.property.js";

import { managerpost } from "./adminAndManager/manager/manager.Post.Services.js";
import { sellerState, sellerUser,viewSellerData } from "./adminAndManager/manager/viewsellerdata.js";
import { viewPosts,viewProperty } from "./user/property/view.property.js";
import { userPurchase } from "./user/property/user.buy.property.js";
import { allform } from "./adminAndManager/manager/property.Request.Services.js";





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
    viewEnqueryForm,
    sellerFormByUser,
    sellerUser,
    viewSellerData,
    managerpost,
    viewPosts,
    viewProperty,
    userPurchase,
    allform,
    sellerState,
    enquertState,
}