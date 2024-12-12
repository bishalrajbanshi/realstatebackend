import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const verifyemail = asyncHandler(async (req, res, next) => {
    try {
        const { code } = req.body;

        // Check if the verification code is provided
        if (!code) {
            throw new apiError({
                statusCode: 400,
                message: "Verification code is required",
            });
        }

        // Find the user by verification code (note: code is now hashed)
        const user = await User.findOne({});

        // Check if the user exists and has the verification code
        if (!user) {
            throw new apiError({
                statusCode: 400,
                message: "User not found",
            });
        }

        // Compare the hashed verification code
        const isValidCode = bcryptjs.compare(code, user.verificationCode);

        if (!isValidCode) {
            throw new apiError({
                statusCode: 400,
                message: "Invalid verification code",
            });
        }

        // Mark the user as verified and remove the verification code
        user.isverified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Email successfully verified",
        });
    } catch (error) {
        console.error("Error during email verification:", error);
        next(error);
        // Send error response
        // throw new apiError({
        //     statusCode: 500,
        //     success: false,
        //     message: "Internal server error",
        // });
    }
});

export { verifyemail };
