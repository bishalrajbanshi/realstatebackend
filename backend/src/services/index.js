import { userRegister } from "./user/auth/user.Register.js";
import { userResend } from "./commonservices/user.ResendOtp.js";
import { userForgotPassword } from "./commonservices/forgotPassword.js";
import { userResetPassword } from "./commonservices/resetPassword.js";
import { managerRegister } from "./adminAndManager/admin/managerRegisterByAdmin.js";
import { loginServices } from "./commonservices/login.services.js";
import { logoutServices } from "./commonservices/logout.services.js";
import { adminDetails } from "./adminAndManager/admin/admin.Details.js";
import { managerDetails } from "./adminAndManager/manager/manager.details.js";
import {
  allManagers,
  deleteManager,
  postByManager,
} from "./adminAndManager/admin/adminServices.js";
import {
  deleteEnqueyProperty,
  userEnqueryForm,
  viewEnqueryProperty,
} from "./user/property/user.enquery.property.js";
import {
  enquertState,
  enqueryFormByUser,
  viewEnqueryForm,
} from "./adminAndManager/manager/viewenquerydata.js";
import {
  deleteSellerfrom,
  getSellerData,
  sellerFormByUser,
} from "./user/property/user.sell.property.js";

import {
  editPost,
  managerpost,
  postDelete,
} from "./adminAndManager/manager/manager.Post.Services.js";
import {
  sellerState,
  sellerUser,
  viewSellerData,
} from "./adminAndManager/manager/viewsellerdata.js";
import {
  viewFeaturedPosts,
  viewPosts,
  viewProperty,
} from "./user/property/view.property.js";
import { userPurchase } from "./user/property/user.buy.property.js";
import {
  allform,
  buyerState,
  viewbuyerData,
} from "./adminAndManager/manager/viewbuyerdata.js";
import { verifyEmail } from "./commonservices/verifyemail.js";
import { editProfile } from "./commonservices/editprofile.js";
import { changeEmail } from "./commonservices/changeemail.js";
import { changeUserPassword } from "./commonservices/changepassword.js";
import { userDetails } from "./user/auth/user.details.js";
import { generateNewToken } from "../middlewares/general/generateAccessToken.js";
import {
  addToCart,
  deleteCartProperty,
  viewCartproperty,
} from "./user/property/user.cartProperty.js";

import {
  adminStats,
  statsPieChart,
  totalUsers,
} from "./adminAndManager/admin/adminDashboardStats.js";
import { viewPostData } from "./adminAndManager/admin/view.posts.js";
import {
  viewManagerData,
  viewManagerPost,
} from "./adminAndManager/admin/view.manager.data.js";
import { viewManagerStats } from "./adminAndManager/manager/view.manager.stats.js";
import { myPost, myPostDetails } from "./adminAndManager/manager/my.posts.js";
import {
  categotyDataCount,
  getCategoryProperty,
  getPropertyType,
} from "./user/property/user.view.property.category.js";
import {
  propertyViewCountData,
  propertyViews,
} from "./user/property/property.view.count.js";
import { searchProperty } from "./commonservices/property.search.js";
import { searchByFilter } from "./user/property/property.filter.search.js";
export const services = {
  //admin
  managerRegister,
  postByManager,
  statsPieChart,
  viewManagerData,
  viewManagerPost,
  adminDetails,
  deleteManager,
  allManagers,

  
  //manager
  managerDetails,
  viewManagerStats,
  myPost,
  myPostDetails,


  //common services
  searchProperty,


  //users
  viewFeaturedPosts,
  categotyDataCount,
  getCategoryProperty,
  getPropertyType,
  propertyViews,
  propertyViewCountData,
  searchByFilter,


  //global uses
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

 
  userEnqueryForm,
  enqueryFormByUser,
  viewEnqueryForm,
  sellerFormByUser,
  getSellerData,
  deleteSellerfrom,
  sellerUser,
  viewSellerData,
  managerpost,
  editPost,
  postDelete,
  viewPosts,
  viewProperty,
  userPurchase,
  sellerState,
  enquertState,
  allform,
  viewbuyerData,
  buyerState,
  viewEnqueryProperty,
  deleteEnqueyProperty,
  addToCart,
  viewCartproperty,
  deleteCartProperty,
  totalUsers,
  adminStats,
  viewPostData,
};
