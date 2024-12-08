import { transporter } from "./emailconfig.middleware.js"; 
import { emailHtmlContent } from "../../utils/emailTemplate.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";  
import { apiError } from "../../utils/apiError.js";

const sendVerificationCode = asyncHandler(async (email, verificationCode, fullName) => {
    console.log("Received fullName:", fullName);  
    console.log("Received email:", email);  

    const userName = fullName || "User";  

    // Replace placeholders in the HTML content
    const htmlContent = emailHtmlContent
        .replace("[User]", userName)  
        .replace("[Verification Code]", verificationCode);

    try {
        // Send the email using the configured transporter
        const info = await transporter.sendMail({
            from: '"Sulav Ghar Gharadi" <bishalrajbanshi.mail@gmail.com>', 
            to: email,
            subject: "Verify Your Email",
            text: `${userName} Please verify your email`,  
            html: htmlContent, 
        });

        console.log("Email sent successfully:", info);
    } catch (error) {
        console.log("Email error:", error);
       throw new apiError({
        statusCode: 500,
        message:"Email sending failed"
       })
    }
});

export { sendVerificationCode };
