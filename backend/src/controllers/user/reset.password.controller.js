import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { User } from "../../models/user.model.js";
import bcryptjs from "bcryptjs";

const resetPassword = asyncHandler(async (req, res, next) => {
    const { code, newPassword } = req.body;

    if (!code || !newPassword) {
        throw new apiError({
            statusCode: 400,
            message: "OTP and new password are required",
        });
    }

    const user = await User.findOne({
        passwordResetToken: { $exists: true },
        passwordResetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new apiError({
            statusCode: 400,
            message: "Invalid or expired OTP",
        });
    }

    // Check if the OTP matches (hashed OTP comparison)
    const isMatch =  bcryptjs.compare(code, user.passwordResetToken);
    if (!isMatch) {
        throw new apiError({
            statusCode: 400,
            message: "Invalid OTP",
        });
    }

   
    user.password = newPassword;
    user.passwordResetToken = undefined; 
    user.passwordResetTokenExpire = undefined; 
    user.passwordChangedAt = Date.now();

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password has been reset successfully.",
    });
});


export { resetPassword }