import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/common/apiError.js";
import { emailHtmlContent } from "../../utils/common/emailTemplate.js"; 
import bcryptjs from "bcryptjs";
import { salt } from "../../constant.js"; 
import { middlewares } from "../../middlewares/index.js";
import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
const{sendEmail}=middlewares;

const userForgotPassword = async (userData) => {
    const { role,email } = userData;
    // Find the user by email
    const user = await getUserModel(role,email);
    if (!user) {
        throw new apiError({
            statusCode: 404,
            message: "Couldn't find the user with that email",
        });
    }

    // Generate the reset token
    const resetToken = user.createResetPasswordToken(); 

    // Hash the reset token before saving
    const hashedToken = await bcryptjs.hash(resetToken, salt);
    
    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpiry = Date.now() + 5 * 60 * 1000; 
    await user.save({ validateBeforeSave: false });

    // Generate email content
    const emailHtml = emailHtmlContent({
        fullName: user.fullName, 
        verificationCode: resetToken,  
    });

    try {
        // Send the reset token via email
         sendEmail({
            to: user.email,
            subject: "Password Reset Token",
            html: emailHtml,
        });
    } catch (error) {
        
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        throw error;  
    }
};

async function getUserModel(role, email) {
    if (!email) {
        throw new apiError({
            statusCode: 400,
            message: "Email is required",
        });
    }

    //  "User" if no role 
    if (!role || role === "User") {
        return await User.findOne({ email: email.toLowerCase() });
    }

    if (role === "Admin") {
        return await Admin.findOne({ email: email.toLowerCase() });
    } else if (role === "Manager") {
        return await Manager.findOne({ email: email.toLowerCase() });
    } else {
        throw new apiError({
            statusCode: 400,
            message: "Invalid role provided",
        });
    }
}

export { userForgotPassword };
