import { User } from "../../../models/user.model.js";
import { apiError } from "../../../utils/common/apiError.js";
import bcryptjs from "bcryptjs";

const userResetPassword = async (userData) => {
    try {
        const {  code, newPassword } = userData;

        // Validate fields
        if (!code || !newPassword) {
            throw new apiError({
                statusCode: 400,
                message: "OTP and new password are required"
            });
        }

        // Find user with the reset token that has not expired
        const user = await User.findOne({
            isLoggedIn:false,
            passwordResetToken: { $exists: true }
        });
        console.log("I am user",user);
        

        if (!user) {
            throw new apiError({
                statusCode: 400,
                message: "Invalid or Expired OTP"
            });
        }

        // Log and compare the code with the stored hashed token
        console.log("Code Provided: ", code);
        console.log("Stored Token: ", user.passwordResetToken);

        const isMatch = await bcryptjs.compare(code, user.passwordResetToken);
        console.log("Is Match: ", isMatch);

        if (!isMatch) {
            throw new apiError({
                statusCode: 400,
                message: "Invalid OTP"
            });
        }

        // Update the password
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        user.passwordChangedAt = Date.now();
        await user.save();

    } catch (error) {
        throw error;
    }
};


export { userResetPassword };
