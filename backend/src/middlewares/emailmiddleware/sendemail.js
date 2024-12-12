import { transporter } from "./emailconfig.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";

const sendEmail = asyncHandler(async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Sulav Ghar Gharadi" <${process.env.SENDER_EMAIL}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new apiError({
            statusCode: 500,
            message: "Failed to send email.",
        });
    }
});

export { sendEmail };
