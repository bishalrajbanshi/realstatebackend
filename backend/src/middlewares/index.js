import { verifyJWT } from "./general/auth.middleware.js";
import { transporter } from "./general/emailTransporter.js";
import { uploadOnCloudinary } from "./general/cloudinary.js";
import { upload } from "./general/multer.js";
import { sendEmail } from "./general/sendemail.js";
import { stateUpdate } from "./general/stateUpdate.js";

export const middlewares = {
    verifyJWT,
    transporter,
    upload,
    uploadOnCloudinary,
    sendEmail,
    stateUpdate
}