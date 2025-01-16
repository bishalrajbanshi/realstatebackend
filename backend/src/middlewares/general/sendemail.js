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
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    // console.error(`Failed to send email to ${to}:`, error.message);
    // if (error.response) console.error("SMTP Error Response:", error.response);
    // if (error.code) console.error("Error Code:", error.code);

    throw new apiError({
      statusCode: 500,
      message: "Failed to send email.",
    });
  }
});

export { sendEmail };
