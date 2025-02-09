import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler } = utils;

import { services } from "../services/index.js";
const { 
 loginServices,
 logoutServices,
 generateNewToken, 
  managerDetails,
  editProfile,
  userForgotPassword,
  userResetPassword,
  changeEmail,
  verifyEmail,
  changeUserPassword,
  enqueryFormByUser,
  viewEnqueryForm,
  totalEnqueryForm,
  totalSellerForm,
  sellerUser,
  viewSellerData,
  managerpost,
  editPost,
  postDelete,
  allform,
  viewbuyerData,
  sellerState,
  enquertState,
  buyerState,
viewManagerStats,
myPost,
myPostDetails,
} =services;

//login manager
const loginManager = asyncHandler(async (req, res, next) => {
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
      .cookie("refreshToken", refreshToken, { ...options, path: "/api/auth/refresh" })
      .json(
        new apiResponse({
          success: true,
          data:{accessToken,refreshToken,user},
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
    const  userId= req.manager;
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
      .clearCookie("refreshToken", { ...cookieOptions, path: "/api/auth/refresh" })
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
        message:error.message || "error reseting passowrd"
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
      data: managerData,
      success: true
    }))
  } catch (error) {
    return next (new apiError({
      statusCode: 500,
      message: error.message || "error sending manager details"
    }))
  }
});

const changeManagerEmail = asyncHandler(async(req,res,next)=>{
  try {
    const data = await changeEmail(req.body,req.manager?._id);
    res.status(200)
    .json(new apiResponse({
        success: true,
        data: data,
        message:"otp sent to emiail"
    }))
} catch (error) {
    return next(new apiError({
        statusCode: 500,
           message: error.message || "error changing email"
    }))
}
});


//verify email
const verifyEmails = asyncHandler(async (req, res, next) => {
  try {
    const userData=req.body;
    const userId = req.manager?._id;
    const data = await verifyEmail(userData,userId);
  
    res.status(200)
    .json(new apiResponse({
      success: true,
      data: data
    }))
  
  } catch (error) {
    return next ( new apiError({
      statusCode: 500,
      message: error.message || "error verifying email"
    }))
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

//generate access token
const generateAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  console.log("Refresh token received:", refreshToken);


  try {
    // Validate refresh token
    if (!refreshToken) {
      return next(new apiError({
        statusCode: 403,
        message: "Refresh token is missing",
      }));
    }

    // Generate new access token
    const { accessToken, refreshToken: newRefreshToken } = await generateNewToken(refreshToken);

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
      .cookie("refreshToken", newRefreshToken, { ...options, path: "/api/auth/refresh" })
      .json(new apiResponse({
        success: true,
        message: "Token refreshed successfully",
        data: { accessToken, refreshToken: newRefreshToken },
      }));

  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: error.message || "Error generating token",
    }));
  }
};



//edit manager details
const editDetails = asyncHandler(async(req,res,next)=>{
  try {
    const uodatedData = await editProfile(req.params,req.body);
    res.status(200)
    .json(new apiResponse({
      success: true,
      message: `PROFILE UPDATED SUCCESS`
    }))
  } catch (error) {
    return next(new apiError({
      statusCode:500,
      message:error.message || "error editing details"
    }))
  }

})


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
    const { page = 1 }=req.query;
    const limit = 10;
    const skip = (page - 1) * limit; 
    const filters = {};
    const projection = { fullName: 1, mobileNumber: 1,currentAddress: 1,state: 1
    }; 
    const options = {
      sort: { createdAt: -1 }, 
      limit: limit,
      skip:skip 
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

//view enquery from
const viewEnqueryData = asyncHandler(async(req,res,next)=>{
  try {
    const {formId} = req.params;
    const alldata = await viewEnqueryForm(formId);
    res.status(200)
    .json(new apiResponse({
      success: true,
      data: alldata
    }))
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: error.message || "erron fetching enquery data"
    }))
  }
});

//view total enquery from
const totalEnqueryData = asyncHandler(async(req,res,next) => {
  try {
    const managerId = req.manager?._id;
    const data = await totalEnqueryForm(managerId)

    res.status(200)
    .json(new apiResponse({
      success: true,
      data: data
    }))
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: error.manager || "error getting total forms"
    }))
  }
})


//fetch seller from
const fetchSellerForm = asyncHandler(async(req,res,next) => {
  try {
    const managerId = req.manager?._id;
    const { page = 1 }=req.query;
    const limit = 10;
    const skip = (page - 1) * limit; 
    const  filters= {};
    const projection = {
      homeName: 1,
      fullName: 1,
      mobileNumber: 1,
      state: 1,
      discription: 1
    };
    const options = {
      sort: { createdAt: -1 }, 
      limit: limit,
      skip:skip 
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
});

//view seller data
const viewSeller = asyncHandler(async(req,res,next)=>{
  try {
    const{sellerId} = req.params;
    //send id 
    const viewData = await viewSellerData(sellerId);
    res.status(200)
    .json(new apiResponse({
      success: true,
      data: viewData
    }))
    
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: error.message || "error infetching seller data"
    }))
  }
})

//view total seller form
const totalSellerData =asyncHandler(async(req,res,next)=>{
  try {
    const managerId = req.manager?._id;
    const data =  await totalSellerForm(managerId);
    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message:error.manager || "error getting total seller from"
    }))
  }
});

//manager post 
const managerPosts = asyncHandler(async (req, res, next) => {
  try {
    //if seller id exist use it else set null
    const { sellerId } = req.params || null;
    const managerId = req.manager?._id;

    // Create the post data (but don't wait for image uploads yet)
    const postData = await managerpost(sellerId, managerId, req.body, req);

    // Send immediate response to the client
    res.status(200).json(new apiResponse({
      success: true,
      data: postData,
    }));


  } catch (error) {
    return next(new apiError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error on manager posting data"
    }));
  }
});

//manager edit post
const editPostbyManager = asyncHandler(async(req,res,next) => {
  try {
    const managerId = req.manager?._id;
    const { postId } = req.params;
    await editPost(managerId,postId,req.body);

    res.status(200)
    .json(new apiResponse({
      success: true,
      message:"Post updated success"
    }))
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message:error.message || "error editing data"
    }))
  }
})

// fetch all buyer froms
const fetchAllForms = asyncHandler(async(req,res,next)=> {
  try {
    const managerId = req.manager?._id;
    const  filters= {managerId:managerId};
    const { page = 1 }=req.query;
    const limit = 10;
    const skip = (page - 1) * limit; 
    const projection = {
      fullName: 1,
      mobileNumber: 1,
      postId:1,
      state: 1,
    };
 const options = {
      sort: { createdAt: -1 }, 
      limit: limit,
      skip:skip 
    };

    const alldata = await allform(managerId,filters,projection,options);
    res.status(200)
    .json(new apiResponse({
      success: true,
      data: alldata
    }))

  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: error.message || "error while fetching form"
    }))
  }
});

//view buyerdata
const fetchBuyerData = asyncHandler(async(req,res,next)=> {
  try {
    const {postId} = req.params;
    const viewData = await viewbuyerData(postId);
  
    res.status(200)
    .json(new apiResponse({
      success: true,
      data: viewData,
    }))
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: error.message || "error fetching postdata"
    }))
  }
})

//state update for buyer
const stateCheckingBuyer = asyncHandler(async(req,res,next) => {
  try {
    const {buyerId} = req.params;
    const updateState = await buyerState(req.body,buyerId);
    res.status(200)
    .json (new apiResponse({
      success: true,
      message: "State updated successful"
    }))
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: error.message || "error updating the buyer state"
    }))
  }
})

// state checking for seller
const stateCheckingSeller = asyncHandler(async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const updatedPost = await sellerState(req.body, sellerId);

    // Send the response with the updated post
    res.status(200).json(new apiResponse({
      success: true,
      message: `successfully updated state`
    }));
  } catch (error) {

    return next(new apiError({
      statusCode: 500,
      message: error.message || "Error setting state"
    }));
  }
});

    //enqueery from state
const stateCheckingEnquery = asyncHandler(async (req, res, next) => {
  try {
    const { enqueryId } = req.params;
    const updatedPost = await enquertState(req.body, enqueryId);

    // Send the response with the updated post
    res.status(200).json(new apiResponse({
      success: true,
      message: `successfully updated state`
    }));
  } catch (error) {

    return next(new apiError({
      statusCode: 500,
      message: error.message || "Error setting state"
    }));
  }
});


//manager delete post
const deletePosts = asyncHandler(async(req,res,next) => {
  try {
    const managerId = req.manager?._id;
    const { postId } = req.params;
    await postDelete(managerId,postId);
    res.status(200)
    .json( new apiResponse({
      success: true,
      message: "success deleting post"
    }))
  } catch (error) {
    return next (new apiError({
      statusCode: 500,
      message: error.message || "error deleting post"
    }))
  }
});


//view manager data stats
const managerStats = asyncHandler(async(req,res,next) => {
  try {
    const managerId = req.manager?._id;
    const data = await viewManagerStats(managerId)

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))

  } catch (error) {
    return next( new apiError({
      statusCode:500,
      message: error.message || "error getting data"
    }))
  }
});



//my all post data
const myPostData = asyncHandler(async(req,res,next) => {
  try {
    const managerId = req.manager?._id;
    const { page = 1 }=req.query;
    const limit = 100;
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
    if (!managerId) {
      throw new apiError({
        statusCode:401,
        message:"manager undefined"
      })
    };

    const data =  await myPost(managerId,filters,projection,options);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))

  } catch (error) {
    return next(apiError({
      statusCode: 500,
      message:error.message || "error getting manager data"
    }))
  }
});

//post details
const myPostDetailsData = asyncHandler(async(req,res,next) => {
try {
  const managerId = req.manager?._id;
  const postId = req.params.postId
  if (!managerId) {
    throw new apiError({
      statusCode:403,
      message:"undefined manager"
    })
  }
const data = await myPostDetails(managerId,postId)
res.status(200)
.json(new apiResponse({
  success:true,
  data:data
}))
} catch (error) {
  return next(apiError({
    statusCode: 500,
    message:error.message || "error getting manager post details"
  }))
}
})





export { 
  loginManager, 
  logoutmanager,
  generateAccessToken,
  editDetails,
  forgotPassword,
  resetPassword,
  changeManagerEmail,
  verifyEmails,
  changePassword,
  managerdetailsSend, 
  fetchForm, 
  viewEnqueryData,
  totalEnqueryData,
  totalSellerData,
  fetchSellerForm, 
  viewSeller, 
  managerPosts,
  editPostbyManager,
  fetchAllForms,
  fetchBuyerData,
  stateCheckingBuyer,
  stateCheckingSeller,
  stateCheckingEnquery,
  deletePosts,
  managerStats,
  myPostData,
  myPostDetailsData
};