import { verifyJWT } from "./authMiddleware/auth.middleware.js";
import { sendEmail } from "./emailMiddleware/sendEmail.js";
import { transporter } from "./emailMiddleware/emailTransporter.js";

export const middlewares = {
    verifyJWT,
    sendEmail,
    transporter,
}