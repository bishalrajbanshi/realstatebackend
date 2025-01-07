import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler } = utils;

import { services } from "../services/index.js";


const { 
  adminManagerLogin,
  adminManagerLogout, 
  managerDetails,
  enqueryFormByUser,
  sellerUser,
userSellerData
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
    const projection = { fullName: 1, email: 1, mobileNumber: 1, address: 1,currentAddress: 1,propertyType: 1,state: 1,
      purpose:1,message: 1
    }; 
    const options = {
      sort: { createdAt: -1 }, 
      limit: 10, 
    };

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


//fetch seller from
const fetchSellerForm = asyncHandler(async(req,res,next) => {
  try {
    const managerId = req.manager?._id;

    const  filters= {};
    const projection = {
      fullName: 1,
      mobileNumber: 1,
      "landLocation.address": 1,
      "landLocation.city": 1,
      "landLocation.area": 1,
      landType: 1,
      landCategory: 1,
      facilities: 1,
      state: 1,
      discription: 1
    };
 const options = {
      sort: { createdAt: -1 }, // Sort by most recent
      limit: 10, 
    };


    const sellerData = await sellerUser(filters, projection,options, managerId)

    if (!sellerData || sellerData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No seller data found.",
      });
    }
    res.status(200)
    .json( new apiResponse({
      success : true,
      data : sellerData
    }))
    

  } catch (error) {
    return  next( new apiError({
      statusCode: 500,
      message: error.message || "error sending seller from"
    }))
  }
})

//manager post 
const managerPosts = asyncHandler(async(req,res,next) => {
try {
  const {postId} = req.params;
  console.log("PostID: ",postId);
  
  const postData = await userSellerData(postId);
  res.status(200)
  .json(new apiResponse({
    success: true,
    data: postData
  }))
   
    
} catch (error) {
  return next (new apiError({
    statusCode: 500,
    message: error.message || "error on manager posting data"
  }))
}


})

export { loginManager, logoutmanager, managerdetailsSend, fetchForm, fetchSellerForm, managerPosts };