import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler,countForms } = utils;

import { services } from "../services/index.js";
const {
  generateNewToken,
  managerRegister,
  loginServices,
  logoutServices,
  userForgotPassword,
  userResetPassword,
changeUserPassword,
  adminDetails,
  allManagers,
  totalPosts,
  postByManager
} = services;

//controllers

//generate access token
const generateAccessToken = async (req, res, next) => {
  //extract cookie token
  const { refreshToken } = req.cookies;
  console.log("refresh token from cookies", refreshToken);

  try {
    // Check if refresh token exists in cookies
    if (!refreshToken) {
      return next(new apiError({
        statusCode: 403,
        message: "Refresh token is missing in cookies",
      }));
    }

    // Call the function to generate new tokens
    const { accessToken, newRefreshToken } = await generateNewToken(refreshToken);

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
     // Set cookies and send response
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
       new apiResponse({
         success: true,
         message: `LOGIN SUCCESS`,
         data : {accessToken,refreshToken:newRefreshToken}
       })
     );

  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: error.message || "error generating token"
    }));
  }
};

//admin register manager
const registermanager = asyncHandler(async (req, res, next) => {
  try {
    const adminId = req.admin?._id;
    if (!adminId) {
      return next(
        new apiError({
          statusCode: 401,
          message: "Unauthorized admin access",
        })
      );
    }

    const newManager = await managerRegister(req.body, adminId, req);
    console.log("New Manager Registered:", newManager);
    return res.status(201).json({
      success: true,
      message: "Manager registered successfully",
      data: {
        fullName: newManager.fullName,
        email: newManager.email,
        mobileNumber: newManager.mobileNumber,
        avatar: newManager.avatar,
        address: newManager.address,
      },
    });
  } catch (error) {
    console.error("Error in registermanager controller:", error);
    return next(
      new apiError({
        statusCode: 500,
        message: error.message,
      })
    );
  }
});

//login admin
const loginadmin = asyncHandler(async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await loginServices(
      req.body
    );

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    // Set cookies and send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse({
          success: true,
          data:{accessToken,refreshToken,user},
          message: "Admin Logged In",
        })
      );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error login manager",
      })
    );
  }
});

//logout admin
const logoutadmin = asyncHandler(async (req, res, next) => {
  try {
    const  userId= req.admin;
    console.log("userId",userId);
    
    const updatedUser = await logoutServices(userId);

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
        message: "Admin logged out successfully",
      });
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "Error logging out manager",
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
        message: `RESET OTP IS SEND TO ${email}`,
        data: email,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: `error sending email ${error.message}`,
      })
    );
  }
});
// resetPassword
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
        statusCode: 500,
        message: `error resetseting password ${error.message}`
      })
    );
  }
});


//change password
const changePassword = asyncHandler(async (req, res, next) => {
  try {
    const { role, userId } = req.params; 
    const { newPassword, oldPassword } = req.body; 
    const data = await changeUserPassword({ role, userId }, { newPassword, oldPassword });
    
    // Validate the result
    if (!data) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid data"
      });
    }

    // Respond with success
    res.status(200).json(
      new apiResponse({
        success: true,
        message: `PASSWORD CHANGED`
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error changinf password"
      })
    );
  }
});

//admin details
const sendadmindetails = asyncHandler(async (req, res, next) => {
  try {
    const adminId = req.admin?._id;
    const adminData = await adminDetails(adminId);

    res.status(200).json(
      new apiResponse({
        data: adminData,
        success: true,
      })
    );
  } catch (error) {
    console.log("admin error", error.message);

    return next(
      new apiError({
        statusCode: 500,
        message: "Admin not found",
      })
    );
  }
});

//get all managers
const fetchAllManagers = asyncHandler(async (req, res, next) => {
  try {
    const filters = { role: "Manager" };
    const projection = { fullName: 1, email: 1, mobileNumber: 1, avatar: 1, address: 1 };
    const options = { sort: { createdAt: -1 }, limit: 10, skip: 0 };
    const managers = await allManagers(filters, projection, options);
    res.status(200).json(
      new apiResponse({
        success: true,
        data: { managers },
      })
    );
  } catch (error) {
    return next(
      apiError({
        statusCode: 500,
        message: error.message || "error fetching all manager",
      })
    );
  }
});

//delete managers
const deleteMannagers = asyncHandler(async (req, res, next) => {
  try {
    const { managerId } = req.params;

    // Call the service to delete the manager
    const result = await deleteManager(managerId);

    // Return success response
    res.status(200).json(
      new apiResponse({
        success: result.success,
        message: result.message,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "Error deleting manager",
      })
    );
  }
});

//total froms 
const totalPostsData = asyncHandler(async(req,res,next) =>{
  try {
    const adminId = req.admin?._id;

    const  filters= {};
    const projection = {
      postBy:1,
      managerFullName: 1,
      managerAddress: 1,
      avatar: 1,
      homeName: 1,
      fullName: 1,
      sellerNumber: 1,
      landLocation:1
    };
 const options = {
      sort: { createdAt: -1 }, 
      limit: 10, 
    };

    const data = await totalPosts(adminId,filters,projection,options)

    res.status(200)
    .json(new apiResponse({
      success: true,
      data: data
    }))
  } catch (error) {
    return next (new apiResponse({
      statusCode:500,
      message: error.message || "error getting total psot"
    }))
  }
});


//post by manager
const postBymanagerData = asyncHandler(async(req,res,next) => {
  try {
    const adminId = req.admin?._id;
    const {managerId} = req.params;

    const data = await postByManager(adminId,managerId)

    res.status(200)
    .json(new apiResponse({
      success: true,
      data: data
    }))

  } catch (error) {
    return next(new apiError({
      statusCode:500,
      message: error.message || "error getting data"
    }))
  }
})


export {
  loginadmin,
  logoutadmin,
  generateAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
  registermanager,
  sendadmindetails,
  fetchAllManagers,
  deleteMannagers,
  totalPostsData,
  postBymanagerData
};
