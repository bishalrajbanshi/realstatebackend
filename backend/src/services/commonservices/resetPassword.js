import { User } from "../../models/user.model.js";
import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { apiError } from "../../utils/common/apiError.js";
import bcryptjs from "bcryptjs";

const userResetPassword = async (userData) => {
    try {
        const { code, newPassword, role } = userData;

        // Validate fields
        if (!code || !newPassword) {
            throw new apiError({
                statusCode: 400,
                message: "OTP and new password are required",
            });
        }

        // Find user with the reset token that has not expired
        let user;
        if (!role || role === "User") {
            user = await User.findOne({
                isLoggedIn: false,
                passwordResetToken: { $exists: true },
            });
        } else if (role === "Manager") {
            user = await Manager.findOne({
                isLoggedIn: false,
                passwordResetToken: { $exists: true },
            });
        } else if (role === "Admin") {
            user = await Admin.findOne({
                isLoggedIn: false,
                passwordResetToken: { $exists: true },
            });
        } else {
            throw new apiError({
                statusCode: 400,
                message: "Invalid role",
            });
        }

        // Ensure the user exists
        if (!user) {
            throw new apiError({
                statusCode: 400,
                message: "Invalid or Expired OTP",
            });
        }

        // Check if the OTP has expired
        if (user.passwordResetTokenExpiry < Date.now()) {
            throw new apiError({
                statusCode: 400,
                message: "OTP has expired",
            });
        }

           const isMatch = await bcryptjs.compare(code, user.passwordResetToken);

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
