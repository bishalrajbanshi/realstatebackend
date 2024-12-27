import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler } = utils;

import { services } from "../services/index.js";
import { Enqueryform } from "../models/user.enquery.form.js";


const { 
  adminManagerLogin,
  adminManagerLogout, 
  managerDetails,
  enqueryFormByUser
} =services;

//login manager
const loginManager = asyncHandler(async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await adminManagerLogin(
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
          message: "Manager Logged In",
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

//logout manager
const logoutmanager = asyncHandler(async (req, res, next) => {
  try {
    const updatedUser = await adminManagerLogout(req.user);

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
        message: "Manager logged out successfully",
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

//manager details
const managerdetailsSend =  asyncHandler( async ( req,res,next)  =>{
  try {
    const managerId = req.manager?._id;
    console.log("This is my manager id",managerId);
    
    const managerData = await managerDetails(managerId);
  
    res.status(200)
    .json( new apiResponse({
      data: {managerData},
      success: true
    }))
  } catch (error) {
    return next (new apiError({
      statusCode: 500,
      message: error.message || "error sending manager details"
    }))
  }
});


// fetch enquery froms by user
const fetchForm = asyncHandler(async (req, res, next) => {
  try {
    // Extract manager ID from request
    const managerId = req.manager?._id;

    if (!managerId) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid Manager ID ",
      });
    }
    const filters = {};
    const projection = { fullName: 1, email: 1, mobileNumber: 1, address: 1,currentAddress: 1,propertyType: 1,
      purpose:1,message: 1
    }; 
    const options = {}; 

    const userForms = await enqueryFormByUser(filters, projection, options, managerId);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: userForms,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "Error fetching user forms",
      })
    );
  }
});

export { loginManager, logoutmanager, managerdetailsSend, fetchForm };
