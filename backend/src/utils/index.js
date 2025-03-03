import { apiError } from "./common/apiError.js";
import { apiResponse } from "./common/apiResponse.js";
import { asyncHandler } from "./common/asyncHandler.js";
import { emailHtmlContent } from "./common/emailTemplate.js";
import { generateAccessToken, generateRefreshToken } from "./helper/generateTokens.js";
import { generateCode, hashOtp } from "./helper/otpGenarator.js";
import { addPasswordhashingHook, addPasswordVerificationMethod } from "./helper/passwordHashCompare.js";
import { generateResetToken } from "./helper/passwordResetToken.js";
import { buyerFromProjection, getOptions, getProjection, getProjectionData, sellerFormProjections } from "./helper/filter.post.js";
import { generatePropertyId } from "./helper/generatePropertyId.js";


export const utils = { 

    //property id
generatePropertyId,

    apiError,
    apiResponse,
    asyncHandler,
    emailHtmlContent,
    generateAccessToken,
    generateRefreshToken,
    generateCode,
    hashOtp,
    addPasswordhashingHook,
    addPasswordVerificationMethod,
    generateResetToken,

    //data projection and options
    getProjection,
    getProjectionData,
    getOptions,
    buyerFromProjection,
    sellerFormProjections,

    
}