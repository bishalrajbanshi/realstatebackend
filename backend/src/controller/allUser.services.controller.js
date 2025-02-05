
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
  getSellerData,
  deleteSellerfrom,
  viewPosts,
  viewProperty,
  userPurchase,
  viewEnqueryProperty,
  deleteEnqueyProperty,
  addToCart,
  viewCartproperty,
  deleteCartProperty
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

//verify email
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
        message: error.message ||"error sending otp",
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
      .cookie("refreshToken", refreshToken, { ...options, path: "/api/auth/refresh" })
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
        message: error.message || "error login user",
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
        message: `LOGED OUT SUCCESS`,
      });
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error logout user",
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
        message: `RESET OTP IS SEND TO ${email}`,
        data: email,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
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
        statusCode: 500,
        message:  error.message||"error resetseting password"
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
        message:error.message || "error changing email"
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
        message: error.message ||"Error changing password"
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
      message:error.message || "error updating data"
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
    message: error.message || "error sending enquery data"
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
      message:error.message || "error sending seller data"

    }))
   }

});

//get seller from
const getSellerproperty = asyncHandler(async(req,res,next)=> {
  try {
    const userId = req.user?._id;
    const data = await getSellerData(userId);

    res.status(200)
    .json(new apiResponse({
      success: true,
      message:"No data found"
    }))
  } catch (error) {
    return next ( new apiError({
      statusCode: 500,
      message:error.message || "error sending seller data"
    }))
  }
})

//delete seller from
const deleteSellerData = asyncHandler(async(req,res,next) => {
  try {
    const userId = req.user?._id;
    const {sellerId}= req.params
  
    await deleteSellerfrom(userId,sellerId);
    res.status(200)
    .json(new apiResponse({
      success: true,
      message:"Deleted Form"
    }))
    
  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message:error.message || "error deleting data"

    }))
  }
})

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
      message:error.message || "error fetching post data"


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
      message:error.message || "error getting property"


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
            message:error.message || "error sending buy data"
          }))
    }
});

//generate access token
const generateAccessToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

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




//view enquery properties
const viewUserEnqueryData = asyncHandler(async(req,res,next)=> {
  try {
    const userId = req.user?._id;
    const allData = await viewEnqueryProperty(userId);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data: allData
    }))

  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message:error.message || "error retrivering data"

    }))
  }
});

//delete enquery from
const deleteEnqueryForm = asyncHandler(async(req,res,next)=> {
  try {
    const userId = req.user?._id;
    const {enqueryId}=req.params;

    const cart = await deleteEnqueyProperty(userId,enqueryId);

    res.status(200)
    .json(new apiResponse({
      success: true,
      message:"enquery property deleted"
    }))
 

  } catch (error) {
    return next (new apiError({
      statusCode: 500,
      message:error.message || "error deleting enquery data"

    }))
  }
})


//add to cart by user
const userCart = asyncHandler(async(req,res,next)=> {
  try {
    const userId = req.user?._id;
    const {postId}=req.params;

    const cart = await addToCart(userId,postId);

  res.status(200)
  .json(new apiResponse({
    success:true,
    data:cart,
    message:"added to cart"
  }))

  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message:error.message || "error adding data to cart"

    }))
  }
});

//view cart product
const getCartProduct = asyncHandler(async(req,res,next)=> {
  try {
    const userId = req.user?._id;

    const getproperty = await viewCartproperty(userId);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data: getproperty
    }))

  } catch (error) {
    return next(new apiError({
      statusCode: 500,
      message:error.message || "error getting cart data"

    }))
  }
});

//delete cart peroduct
const deleteCartData = asyncHandler(async(req,res,next)=> {
  try {
    const userId = req.user?._id;
    const {postId}=req.params;

    const cart = await deleteCartProperty(userId,postId);

    res.status(200)
    .json(new apiResponse({
      success: true,
      message:"cart property deleted"
    }))
 

  } catch (error) {
    return next (new apiError({
      statusCode: 500,
      message:error.message || "error deleting cart data"

    }))
  }
})


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
  deleteSellerData,
  getSellerproperty,
  fetchAllPosts,
  userPurchaseData,
  viewPropertyData,
  viewUserEnqueryData,
  deleteEnqueryForm,
  userCart,
  getCartProduct,
  deleteCartData
};
