import { apiError } from "./common/apiError.js";
import { apiResponse } from "./common/apiResponse.js";
import { asyncHandler } from "./common/asyncHandler.js";
import { emailHtmlContent } from "./general/emailTemplate.js";
import { uploadOnCloudinary } from "./helper/cloudinary.js";
import { upload } from "./helper/multer.js";
import { generateAccessToken, generateRefreshToken } from "./helper/generateTokens.js";
import { generateCode, hashOtp } from "./helper/otpgenarator.js";
import { addPasswordhashingHook, addPasswordVerificationMethod } from "./helper/passwordHashCompare.js";
import { generateResetToken } from "./helper/passwordResetToken.js";
import { countForms } from "./helper/counter.js";

export const utils = { 
    apiError,
    apiResponse,
    asyncHandler,
    emailHtmlContent,
    uploadOnCloudinary,
    upload,
    generateAccessToken,
    generateRefreshToken,
    generateCode,
    hashOtp,
    addPasswordhashingHook,
    addPasswordVerificationMethod,
    generateResetToken,
    countForms
}