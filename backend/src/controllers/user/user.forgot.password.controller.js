
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { User } from "../../models/user.model.js";
import { sendEmail } from "../../middlewares/emailmiddleware/sendemail.js";
import { emailHtmlContent } from "../../utils/emailTemplate.js";

const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        throw new apiError({
            statusCode: 400,
            message: "Email is required",
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError({
            statusCode: 404,
            message: "Couldn't find a user with that email",
        });
    }

    const resetToken = await user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const emailHtml = emailHtmlContent({
        fullName: user.fullName || "User",
        verificationCode: resetToken,
    });

    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            html: emailHtml,
        });

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to email",
        });
    } catch (error) {
        // Rollback token creation on failure
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        throw new apiError({
            statusCode: 500,
            message: "Error sending email. Please try again later.",
        });
    }
});

export { forgotPassword };
