import { apiError } from "./common/apiError.js";
import { apiResponse } from "./common/apiResponse.js";
import { asyncHandler } from "./common/asyncHandler.js";
import { emailHtmlContent } from "./common/emailTemplate.js";
import { generateAccessToken, generateRefreshToken } from "./helper/generateTokens.js";
import { generateCode, hashOtp } from "./helper/otpgenarator.js";
import { addPasswordhashingHook, addPasswordVerificationMethod } from "./helper/passwordHashCompare.js";
import { generateResetToken } from "./helper/passwordResetToken.js";
import { countForms } from "./helper/counter.js";
import { getOptions, getProjection, getProjectionData } from "./helper/filter.post.js";


export const utils = { 
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
    countForms,

    //data projection and options
    getProjection,
    getProjectionData,
    getOptions
}