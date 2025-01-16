import { userRegister } from "./user/auth/user.Register.js";
import { userResend } from "./user/auth/user.ResendOtp.js";
import { userForgotPassword } from "./user/auth/user.forgotPassword.js";
import { userResetPassword } from "./user/auth/user.resetPassword.js";
import { managerRegister } from "./adminAndManager/admin/managerRegisterByAdmin.js";
import { loginServices } from "./commonservices/login.services.js";
import { logoutServices } from "./commonservices/logout.services.js";
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
import { allform, buyerState, viewbuyerData } from "./adminAndManager/manager/viewbuyerdata.js";
import { verifyEmail } from "./commonservices/verifyemail.js";
import { editProfile } from "./commonservices/editprofile.js";
import { changeEmail } from "./commonservices/changeemail.js";
import { changeUserPassword } from "./commonservices/changepassword.js";
import { userDetails } from "./user/auth/user.details.js";
import { generateNewToken } from "./commonservices/generateAccessToken.js";
export const services = {
    verifyEmail,
    editProfile,
    userRegister,
   loginServices,
   logoutServices,
   generateNewToken,
   userDetails,
    userResend,
    changeEmail,
    changeUserPassword,
    userForgotPassword,
    userResetPassword,
    managerRegister,
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
    sellerState,
    enquertState,
    allform,
    viewbuyerData,
    buyerState
}