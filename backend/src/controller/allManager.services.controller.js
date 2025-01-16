import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler } = utils;

import { services } from "../services/index.js";
const { 
 loginServices,
 logoutServices,
 generateNewToken, 
  managerDetails,
  editProfile,
  changeUserPassword,
  enqueryFormByUser,
  viewEnqueryForm,
  sellerUser,
  viewSellerData,
  managerpost,
  allform,
  viewbuyerData,
  sellerState,
  enquertState,
  deletePost,
  buyerState
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
      .cookie("refreshToken", refreshToken, options)
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
    const updatedUser = await logoutServices(req.user);

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

const changeManagerEmail = asyncHandler(async(req,res,next)=>{
  try {
    const data = await changeEmail(req.body,req.user?._id);
    res.status(200)
    .json(new apiResponse({
        success: true,
        data: data,
        message:"otp sent to emiail"
    }))
} catch (error) {
    return next(new apiError({
        statusCode: 500,
        message:`error sending otp${error.message}`
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
        message: `Error changing password: ${error.message}`
      })
    );
  }
});

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
      message: `Error generating token: ${error.message}`,
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
      message:`error updating manager ${error.message}`
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
    const filters = {};
    const projection = { fullName: 1, mobileNumber: 1,currentAddress: 1,state: 1
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
})


//fetch seller from
const fetchSellerForm = asyncHandler(async(req,res,next) => {
  try {
    const managerId = req.manager?._id;

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

//manager post 
const managerPosts = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const managerId = req.manager?._id;

    // Create the post data (but don't wait for image uploads yet)
    const postData = await managerpost(userId, managerId, req.body, req);

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

// fetch all buyer froms
const fetchAllForms = asyncHandler(async(req,res,next)=> {
  try {
    const managerId = req.manager?._id;
    const alldata = await allform(managerId);
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
    const { postId } = req.params;
    const updatedData = await deletePost(postId);
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




export { 
  loginManager, 
  logoutmanager,
  generateAccessToken,
  editDetails,
  changeManagerEmail,
  changePassword,
  managerdetailsSend, 
  fetchForm, 
  viewEnqueryData,
  fetchSellerForm, 
  viewSeller, 
  managerPosts ,
  fetchAllForms,
  fetchBuyerData,
  stateCheckingBuyer,
  stateCheckingSeller,
  stateCheckingEnquery,
  deletePost
};