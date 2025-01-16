import { configDotenv } from "dotenv"
configDotenv();
const config = {
    /*  DATABASE  */
    DB_USERNAME:process.env.DB_USERNAME,
    DB_PASSWORD:process.env.DB_PASSWORD,
    DB_CLUSTERURI:process.env.DB_CLUSTERURI,
    DB_NAME:process.env.DB_NAME,
    PORT:process.env.PORT,
     /*  CLOUDINARY  */
    CLOUD_NAME:process.env.CLOUD_NAME,
    CLOUD_API_SECRET:process.env.CLOUD_API_SECRET,
    CLOUD_API_KEY:process.env.CLOUD_API_KEY,
     /*  CORS  */
    CORS_ORIGIN:process.env.CORS_ORIGIN,
    SESSION_SECRET:process.env.SESSION_SECRET,
 /*  ACCESSTOKEN  */
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY:process.env.ACCESS_TOKEN_EXPIRY,
 /*  ALGORITHEM FOR HASH  */
    ALGORITHEM:process.env.ALGORITHEM,
 /*  REFRESHTOKEN  */
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY:process.env.REFRESH_TOKEN_EXPIRY,
 /*  PRODUCTION  */
    NODE_ENV:process.env.NODE_ENV,
 /*  EMAIL SENDER  */
    SENDER_EMAIL:process.env.SENDER_EMAIL,

}
export { config };

//FRO SIZE eg json etc
export const size = "50kb";


//FOR SALT
import bcryptjs from "bcryptjs";
export const salt = await bcryptjs.genSalt(10);



// export const data = process.env;
