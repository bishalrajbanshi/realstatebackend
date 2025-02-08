import { transporter } from "./emailTransporter.js";
import { asyncHandler } from "../../utils/common/asyncHandler.js";
import { apiError } from "../../utils/common/apiError.js";

const sendEmail = asyncHandler(async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sulav Ghar Gharadi" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });
    
    return info;

  } catch (error) {
    console.error("Error sending email:", error);

    // Extract useful error message
    const errorMessage =
      error.response || error.message || "Unknown email sending error";

    console.log("Email Error Response:", errorMessage);

    throw new apiError({
      statusCode: 500,
      message: `Failed to send email: ${errorMessage}`,
    });
  }
});

export { sendEmail };
