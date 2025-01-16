
import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler } = utils;
import { services } from "../services/index.js";

const {
  userRegister,
 loginServices,
 logoutServices,
 generateNewToken,
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
  viewPosts,
  viewProperty,
  userPurchase,
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
        statusCode: 500,
        message: error.message || "error regirestering user"
      })
    );
  }
});

const verifyEmails = asyncHandler(async (req, res, next) => {
try {
  const userData=req.body;
  const userId = req.user?._id;

  const data = await verifyEmail(userData,userId);

  res.status(200)
  .json(new apiResponse({
    success: true,
    data: data
  }))

} catch (error) {
  return next ( new apiError({
    statusCode: 500,
    message: error.message
  }))
}
});


//user resend otp
const resendOtp = asyncHandler(async (req, res, next) => {
  try {
    const email = await userResend(req.body);
    return res.status(201).json(
      new apiResponse({
        success: true,
        message: `VERIFICATION CODE SEND TO ${email}`,
        data: email,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: `error sending otp ${error.message}`,
      })
    );
  }
});

//user login
const login = asyncHandler(async (req, res, next) => {
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
          message: `LOGIN SUCCESS`,
          data : {accessToken,refreshToken}
        })
      );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: `error login user ${error.message}`,
      })
    );
  }
});

//logout manager
const logout = asyncHandler(async (req, res, next) => {
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
        message: `LOGED OUT SUCCESS`,
      });
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: `error logout user ${error.message}`,
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
        message: `error sending data ${error.message}`,
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
        statusCode: 500,
        message: `error resetseting password ${error.message}`
      })
    );
  }
});

//changeemail
const changeUserEmail = asyncHandler(async(req,res,next)=>{
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
        message:`hello${error.message}`
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


//user edit details
const editDetails = asyncHandler(async(req,res,next)=> {
  try {
  
      const updateData = await editProfile(req.params,req.body);
      res.status(200)
      .json(new apiResponse({
        success: true,
        message: `PROFILE UPDATED SUCCESS`
      }))
  } catch (error) {
    return next(new apiError({
      statusCode:500,
      message:`error updating user ${error.message}`
    }))
  }
})

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
    message: `error sending data ${error.message}`
  }))
 }
})

//user seller from
const userSellerForm = asyncHandler( async (req,res,next) => {
   try {
       const userId = req.user?._id;
       const userData = await sellerFormByUser(req.body,userId);
 
      res.status(200)
       .json( new apiResponse({
         success: true,
         message: `SUCCESSFULLY SENT DATA`,
       }))
   } catch (error) {
    return next( new apiError({
      statusCode: 500,
      message: `error sending data ${error.message}`

    }))
   }

});

//fetch all post
const fetchAllPosts = asyncHandler(async(req,res,next)=>{
   try {
     const filters={};
     const projection= {
       homeName: 1,
       avatar: 1,
       landType:1,
       landCatagory:1,
       facilities:1,
       price:1,
       isNegotiable: 1
     }
     const options = {
       sort: { createdAt: -1 }, 
       limit: 10, 
     };
     const data = await viewPosts(filters,projection,options);
     res.status(200)
     .json(new apiResponse({
       success: true,
       data: data
     }))
   } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: `error fetching data ${error.message}`

    }))
   }
});

//view post
const viewPropertyData = asyncHandler(async(req,res,next)=> {
  try {
    const {postId} = req.params;
    
    const filters={};
    const projection= {
      homeName: 1,
      avatar: 1,
      images:1,
      landLocation: 1,
      landType:1,
      landCatagory:1,
      facilities:1,
      price:1,
      isNegotiable: 1,
      type: 1,
      description: 1,
      state: 1
    }
    const options = {
      sort: { createdAt: -1 }, 
      limit: 10, 
    };

    const propertyData = await viewProperty(postId,filters,projection,options);
    if (!propertyData || propertyData.length === 0) {
      return res.status(404).json({
        success: false,
        message: `NO PROPERTY FOUND`,
      });
    }
    
    res.status(200)
    .json(new apiResponse({
      success: true,
      data: propertyData
    }))

  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message: `error getting property ${error.message}`

    }))
  }
})

// purchasse data
const userPurchaseData = asyncHandler(async(req,res,next) =>{
    try {
        const userId = req.user?._id;
        const {postId} = req.params;
        const {mobileNumber} = req.body;
        console.log("userId",userId);
        console.log("postId",postId);
        
        const pudata = await userPurchase(userId,postId,mobileNumber);

        res.status(200)
        .json(new apiResponse({
          success: true,
          data:pudata 
        }))
    } catch (error) {
          return next(new apiError({
            statusCode: 500,
            message: `error sending data ${error.message}`
          }))
    }
});

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



export {
  generateAccessToken,
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
  fetchAllPosts,
  userPurchaseData,
  viewPropertyData
};
