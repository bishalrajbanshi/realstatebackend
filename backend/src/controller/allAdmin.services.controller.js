import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler,countForms } = utils;

import { services } from "../services/index.js";
const {
  managerRegister,
  adminManagerLogin,
  adminManagerLogout,
  adminDetails,
  deleteManager,
  allManagers,
} = services;

//controllers
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

//admin login
const loginadmin = asyncHandler(async (req, res, next) => {
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
          message: "Admin Logged In",
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

//admin logout
const logoutadmin = asyncHandler(async (req, res, next) => {
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
        message: "Admin logged out successfully",
      });
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "Error logging out user",
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


//total count for froms
const totalForms = asyncHandler(async(req,res,next) => {
  try {
    const userfroms = await countForms(Enqueryform);
    return res.status(200).json({
      success: true,
      data: userfroms,
    });
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "Error fetching total forms count",
      })
    );
  }
})

export {
  loginadmin,
  logoutadmin,
  registermanager,
  sendadmindetails,
  fetchAllManagers,
  deleteMannagers,
  totalForms
};
