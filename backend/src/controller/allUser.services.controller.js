import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler } = utils;
import { services } from "../services/index.js";
const {
  userRegister,
  userLogin,
  userLogout,
  userverify,
  userResend,
  userForgotPassword,
  userResetPassword,
  userDetails,
  userEnqueryForm,
  sellerFormByUser
} = services;

// Register User Controller
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await userRegister(req.body);

    return res.status(201).json(
      new apiResponse({
        success: true,
        message: "User registered successfully otp send to email",
      })
    );
  } catch (error) {
    console.error("Caught error in registerUser:", error);
    return next(
      new apiError({
        statusCode: 500,
        message: error.message,
      })
    );
  }
});

//verify email controller
const verifyEmail = asyncHandler(async (req, res, next) => {
  try {
    const verifiedUser = await userverify(req.body);
    return res.status(201).json(
      new apiResponse({
        success: true,
        message: "User verified successfully",
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message,
      })
    );
  }
});

//user resend otp
const resendOtp = asyncHandler(async (req, res, next) => {
  try {
    const email = await userResend(req.body);
    return res.status(201).json(
      new apiResponse({
        success: true,
        message: "Resent the verification code",
        data: email,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message,
      })
    );
  }
});

//user login
const login = asyncHandler(async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await userLogin(req.body);

    // Ensure cookie options are set properly for secure cookies
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    // Set the cookies with the tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse({
          success: true,
          message: "Logged in successfully",
        })
      );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message,
      })
    );
  }
});

//user logggout
const logout = asyncHandler(async (req, res, next) => {
  try {
    // Call the userLogout service
    const updatedUser = await userLogout(req.user?._id);

    // Clear cookies
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
    };

    // Send response after clearing the cookies
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: "Error logging out user",
      })
    );
  }
});

//send userdetials
const sendDetials = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    console.log("my user id",userId);
    
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
        message: "user not found",
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
        message: "Password reset otp is send to email",
        data: email,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: "Error sending email. Please try again later.",
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
        message: "Password has been successfully reset.",
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message,
      })
    );
  }
});

//user enquery from
const userForm = asyncHandler(async(req,res,next) => {
 try {
   const userId = req.user?._id;
   
   if (!userId) {
    throw new apiError({
      statusCode: 401,
      message: "User not authenticated",
    });
  }
   const userData = await userEnqueryForm(req.body,userId);
   return res.status(200)
   .json( new apiResponse({
     success: true,
   }))
 } catch (error) {
  return next ( new apiError({
    statusCode: 500,
    message: error.message || "error sending user from"
  }))
 }
})

//user seller from
const userSellerForm = asyncHandler( async (req,res,next) => {
   try {
       const userId = req.user?._id;
 
       if (!userId) {
         throw new apiError({
           statusCode: 400,
           message: "Invallid user Id"
         })
       };
 
       const userData = await sellerFormByUser(req.body,userId);
 
      res.status(200)
       .json( new apiResponse({
         success: true,
         message: "seller form send successful",
       }))
   } catch (error) {
    return next( new apiError({
      statusCode: 500,
      message: error.message || "error sending seller from"
    }))
   }

})

export {
  registerUser,
  verifyEmail,
  resendOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  sendDetials,
  userForm,
  userSellerForm 
};
