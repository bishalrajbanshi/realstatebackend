import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler,countForms } = utils;

import { services } from "../services/index.js";
const {
  managerRegister,
  deleteManager,
  loginServices,
  logoutServices,
  userForgotPassword,
  userResetPassword,
changeUserPassword,
  adminDetails,
  allManagers,
  // totalPosts,
  postByManager,
  totalUsers,
  adminStats,
  viewPostData,
  statsPieChart,
  viewManagerData,
  viewManagerPost
} = services;

//controllers


//admin register manager
const registermanager = asyncHandler(async (req, res, next) => {
  try {
    const adminId = req.admin?._id;
    const newManager = await managerRegister(req.body, adminId, req);

    return res.status(201).json({
      success: true,
      message: "Manager registered successfully",
      data: newManager
    });
  } catch (error) {
    return next(new apiError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error registering manager",
    }));
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
      .clearCookie("refreshToken", { ...cookieOptions, path: "/api/auth/refresh" })
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
        message: "reset otp send",
        data: email,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message:error.message || "error sending email"
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
        message:error.message || "error reseting password"
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
        message: error.message || "error changing password"
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
        message: error.message || "Admin not found",
      })
    );
  }
});

//get all managers
const fetchAllManagers = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1 }=req.query;
    const limit = 10;
    const skip = (page - 1) * limit; 
    const filters = { role: "Manager" };
    const projection = { fullName: 1, email: 1, mobileNumber: 1, avatar: 1, address: 1 };
    const options = {
      sort: { createdAt: -1 }, 
      limit: limit, 
      skip:skip
    }
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

// //total froms 
// const totalPostsData = asyncHandler(async(req,res,next) =>{
//   try {
//     const adminId = req.admin?._id;

//     const  filters= {};
//     const projection = {
//       postBy:1,
//       managerFullName: 1,
//       managerAddress: 1,
//       avatar: 1,
//       homeName: 1,
//       fullName: 1,
//       sellerNumber: 1,
//       landLocation:1
//     };
//  const options = {
//       sort: { createdAt: -1 }, 
//       limit: 10, 
//     };

//     const data = await totalPosts(adminId,filters,projection,options)

//     res.status(200)
//     .json(new apiResponse({
//       success: true,
//       data: data
//     }))
//   } catch (error) {
//     return next (new apiResponse({
//       statusCode:500,
//       message: error.message || "error getting total psot"
//     }))
//   }
// });


// total users
const totalUserData = asyncHandler(async(req,res,next)=> {
  try {
    const adminId = req.admin._id;
    const { page = 1 }=req.query;
    const limit = 10;
    const skip = (page - 1) * limit; 

    const filters = { isverified : true}
    const projection = { email:1,fullName: 1, mobileNumber: 1,currentAddress:1
    }; 
    const options = {
      sort: { createdAt: -1 }, 
      limit: limit, 
      skip:skip
    };

    const data = await totalUsers(adminId,filters,projection,options)

    res.status(200)
    .json(new apiResponse({
      success:true,
      data:data,
      message:"all users"
    }))
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message:error.message
    }))
  }
});


//view posts by admin
const viewAllPosts = asyncHandler(async (req,res,next) => {
  try {
    const adminId = req.admin._id;
    const { page = 1 }=req.query;
    const limit = 10;
    const skip = (page - 1) * limit; 
    const filters ={};
    const projection = 
    {
      managerFullName:1,
      managerAddress:1,
      avatar:1,
      homeName:1,
      fullName:1,
      price:1,
      state:1
    };
    const options = {
      sort: { createdAt: -1 }, 
      limit: limit, 
      skip: skip
    };

    const data = await viewPostData(adminId,filters,projection,options);

    res.status(200)
    .json(new apiResponse({
      success:true,
      message:"all posts",
      data:data,
    }))

  } catch (error) {
    return next(new apiError({
      statusCode:500,
      message:error.message
    }))
  }
});


//post by manager
const postBymanagerData = asyncHandler(async (req, res, next) => {  
  try {    
    const adminId = req.admin?._id;    
    const { managerId } = req.params;    

    const data = await postByManager(adminId, managerId,req);

    return res.status(200).json(new apiResponse({ 
      success: true,
      data: data  
    }));  
  } catch (error) {    
    return next(new apiError({      
      statusCode: 500,      
      message: error.message || "Error getting data"    
    }));  
  }  
});


//admin states
const adminStatsData = asyncHandler(async(req,res,next) => {
  try {
    const adminId = req.admin._id;
    const data = await adminStats(adminId);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))


  } catch (error) {
    return next(new apiError({
      statusCode:500,
      message:error.message|| "error getting admin stats"
    }))
  }
});


//stats pie chart
const pieChartStats = asyncHandler(async(req,res,next) => {
  try {
    const adminId = req.admin._id;
    const data =  await statsPieChart(adminId);
    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(new apiError({
      statusCode:500,
      message:error.message || "error getting stats data"
    }))
  }
});

//viwe manager all data
const viewManagerAllData = asyncHandler(async(req,res,next) => {
  try {
    const adminId = req.admin._id;
    const {managerId} = req.params;

    const data = await viewManagerData(adminId,managerId);
    res.status(200)
    .json(new apiResponse({
      success: true,
      data: data
    }))
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message:error.message || "error getting anager data"
    }))
  }
});

//view manager posts data
const viewAllManagerPost = asyncHandler(async(req,res,next) => {
  try {
    const adminId = req.admin._id;
    const {managerId} = req.params;
    const { page = 1 }=req.query;
    const limit = 10;
    const skip = (page - 1) * limit; 
    const filters ={postBy: managerId};
    const projection = 
    {
      avatar:1,
      state:1,
      price:1,
      propertyTitle:1,
      createdAt:1,
    };
    const options = {
      sort: { createdAt: -1 }, 
      limit: limit, 
      skip: skip
    };

    const data = await viewManagerPost(adminId,managerId,filters,projection,options);
    res.status(200)
    .json(new apiResponse({
      success: true,
      data: data
    }))
  } catch (error) {
    return next(new apiError({
      statusCode:500,
      message: error.message || "error getting posts"
    }))
  }
})





export {
  loginadmin,
  logoutadmin,
  forgotPassword,
  resetPassword,
  changePassword,
  registermanager,
  sendadmindetails,
  fetchAllManagers,
  deleteMannagers,
  postBymanagerData,
  totalUserData,
adminStatsData,
  viewAllPosts,
  pieChartStats,
  viewManagerAllData,
  viewAllManagerPost
};
