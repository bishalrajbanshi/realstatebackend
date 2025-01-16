import { User } from "../../../models/user.model.js";
import { apiError } from "../../../utils/common/apiError.js";
import { emailHtmlContent } from "../../../utils/common/emailTemplate.js"; 
import bcryptjs from "bcryptjs";
import { salt } from "../../../constant.js"; 
import { middlewares } from "../../../middlewares/index.js";
const{sendEmail}=middlewares;

const userForgotPassword = async (userData) => {
    const { email } = userData;

    // Validate email
    if (!email) {
        throw new apiError({
            statusCode: 400,
            message: "Email is required",
        });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });

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

export { userForgotPassword };
