import { utils } from "../utils/index.js";
const {
  apiError,
  apiResponse,
  asyncHandler,
  getOptions,
  getProjection,
  generateAccessToken,
  generateRefreshToken,
} = utils;
import { services } from "../services/index.js";

const {
  userRegister,
  loginServices,
  logoutServices,
  verifyEmail,
  changeEmail,
  editProfile,
  changeUserPassword,
  userResend,
  userForgotPassword,
  userResetPassword,
  userDetails,
  userEnqueryForm,
  sellerFormByUser,
  getSellerData,
  deleteSellerfrom,
  userPurchase,
  viewEnqueryProperty,
  deleteEnqueyProperty,
  addToCart,
  viewCartproperty,
  deleteCartProperty,
} = services;

// Register User Controller
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await userRegister(req.body);

    return res.status(201).json(
      new apiResponse({
        success: true,
        message: `USER REGISERED OTP SEND TO ${user.email}`,
      })
    );
  } catch (error) {
    console.error("Caught error in registerUser:", error);
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error regirestering user",
      })
    );
  }
});

//verify email
const verifyEmails = asyncHandler(async (req, res, next) => {
  try {
    const userData = req.body;
    const userId = req.user?._id;
    await verifyEmail(userData, userId);

    res.status(200).json(
      new apiResponse({
        success: true,
        message:"email verified success"
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message,
      })
    );
  }
});

//user resend otp
const resendOtp = asyncHandler(async (req, res, next) => {
  try {
    const email = req.body
    const userId = req.user;
    await userResend(email,userId);
    return res.status(201).json(
      new apiResponse({
        success: true,
        message:"otp sent success"
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error sending otp",
      })
    );
  }
});


// user login
const login = asyncHandler(async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await loginServices(req.body);

    // Cookie options
    const options = {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
    };

    // Set cookies and send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        ...options,
        path: "/api/auth/refresh", 
      })
      .json(
        new apiResponse({
          success: true,
          message: `LOGIN SUCCESS`,
          data: { accessToken },
        })
      );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "Error logging in user",
      })
    );
  }
});

//logout user
const logout = asyncHandler(async (req, res, next) => {
  try {
    const updatedUser = await logoutServices(req.user);

    // Clear cookies
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      maxAge:0,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
    };

    // Send response after clearing the cookies
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", {
        ...cookieOptions,
        path: "/api/auth/refresh",
      })
      .json({
        success: true,
        message: `LOGED OUT SUCCESS`,
      });
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error logout user",
      })
    );
  }
});

//send userdetials
const sendDetials = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
  
    const userData = await userDetails(userId);

    res.status(200).json(
      new apiResponse({
        data: userData,
        success: true,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 400,
        message: error.message || "error sending data",
      })
    );
  }
});

//user forgot password
const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    const email = await userForgotPassword(req.body);
    res.status(200).json(
      new apiResponse({
        success: true,
        message: `RESET OTP IS SEND TO`,
        data: email,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error sending email",
      })
    );
  }
});

//user password reset
const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const data = await userResetPassword(req.body);
    res.status(200).json(
      new apiResponse({
        success: true,
        message: `PASSWORD RESET SUCCESS`,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error resetseting password",
      })
    );
  }
});

//changeemail
const changeUserEmail = asyncHandler(async (req, res, next) => {
  try {
    const data = await changeEmail(req.body, req.user?._id);
    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
        message: "otp sent to emiail",
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error changing email",
      })
    );
  }
});

//change password
const changePassword = asyncHandler(async (req, res, next) => {
  try {
    const { role, userId } = req.params;
    const { newPassword, oldPassword } = req.body;
    const data = await changeUserPassword(
      { role, userId },
      { newPassword, oldPassword }
    );

    // Validate the result
    if (!data) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid data",
      });
    }

    // Respond with success
    res.status(200).json(
      new apiResponse({
        success: true,
        message: `PASSWORD CHANGED`,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "Error changing password",
      })
    );
  }
});

//user edit details
const editDetails = asyncHandler(async (req, res, next) => {
  try {
    const updateData = await editProfile(req.params, req.body);
    res.status(200).json(
      new apiResponse({
        success: true,
        message: `PROFILE UPDATED SUCCESS`,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error updating data",
      })
    );
  }
});

//user enquery from
const userForm = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new apiError({
        statusCode: 401,
        message: "User not authenticated",
      });
    }
    const userData = await userEnqueryForm(req.body, userId);
    return res.status(200).json(
      new apiResponse({
        success: true,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error sending enquery data",
      })
    );
  }
});

//user seller from
const userSellerForm = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const userData = await sellerFormByUser(req.body, userId);

    res.status(200).json(
      new apiResponse({
        success: true,
        message: `SUCCESSFULLY SENT DATA`,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error sending seller data",
      })
    );
  }
});

//get seller from
const getSellerproperty = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const data = await getSellerData(userId);

    res.status(200).json(
      new apiResponse({
        success: true,
        message: "No data found",
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error sending seller data",
      })
    );
  }
});

//delete seller from
const deleteSellerData = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { sellerId } = req.params;

    await deleteSellerfrom(userId, sellerId);
    res.status(200).json(
      new apiResponse({
        success: true,
        message: "Deleted Form",
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error deleting data",
      })
    );
  }
});



// purchasse data
const userPurchaseData = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const data = await userPurchase(userId, postId, req.body);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error sending buy data",
      })
    );
  }
});


//view enquery properties
const viewUserEnqueryData = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const allData = await viewEnqueryProperty(userId);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: allData,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error retrivering data",
      })
    );
  }
});

//delete enquery from
const deleteEnqueryForm = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { enqueryId } = req.params;

    const cart = await deleteEnqueyProperty(userId, enqueryId);

    res.status(200).json(
      new apiResponse({
        success: true,
        message: "enquery property deleted",
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error deleting enquery data",
      })
    );
  }
});

//add to cart by user
const userCart = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;

    const cart = await addToCart(userId, postId);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: cart,
        message: "added to cart",
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error adding data to cart",
      })
    );
  }
});

//view cart product
const getCartProduct = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const getproperty = await viewCartproperty(userId);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: getproperty,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error getting cart data",
      })
    );
  }
});

//delete cart peroduct
const deleteCartData = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;

    const cart = await deleteCartProperty(userId, postId);

    res.status(200).json(
      new apiResponse({
        success: true,
        message: "cart property deleted",
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error deleting cart data",
      })
    );
  }
});

//google auth callback
const googleAuthCallback = asyncHandler(async (req, res, next) => {
  try {
    // Check if the user is available in the request
    if (!req.user) {
      // If authInfo has an error message, throw that as a custom error
      if (req.authInfo && req.authInfo.message) {
        throw new apiError({
          statusCode: 400, 
          message: req.authInfo.message,  
        });
      }

      // If user is not found or not authenticated, throw unauthorized error
      throw new apiError({ statusCode: 401, message: "Unauthorized" });
    }

    // If user is found, extract the user and tokens from the request
    const { accessToken, refreshToken, user } = req.user;

    // Send the response with tokens and user data
    res.status(200).json(
      new apiResponse({
        success: true,
        message: "Google login successful",
        data: { user, accessToken, refreshToken },
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "Error logging in with Google account",
      })
    );
  }
});


export {
  changeUserEmail,
  registerUser,
  verifyEmails,
  resendOtp,
  login,
  logout,
  forgotPassword,
  changePassword,
  resetPassword,
  editDetails,
  sendDetials,
  userForm,
  userSellerForm,
  deleteSellerData,
  getSellerproperty,
  userPurchaseData,
  viewUserEnqueryData,
  deleteEnqueryForm,
  userCart,
  getCartProduct,
  deleteCartData,
  googleAuthCallback,
};
