
import jwt from "jsonwebtoken";

import { config } from "../../constant.js";
const{ ALGORITHEM,ACCESS_TOKEN_SECRET,ACCESS_TOKEN_EXPIRY,REFRESH_TOKEN_SECRET,REFRESH_TOKEN_EXPIRY }=config;

console.log("algo",ALGORITHEM);


function generateAccessToken(user) {
    const accessTokenSecret = ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = ACCESS_TOKEN_EXPIRY || "15m";

    if (!accessTokenSecret) {
        console.error("ACCESS_TOKEN_SECRET is not defined");
        throw new Error("Internal server error: Configuration issue");
    }

    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
        },
        accessTokenSecret,
        {
            expiresIn: accessTokenExpiry,
            algorithm: ALGORITHEM,
        }
    );
}

function generateRefreshToken(user) {
    const refreshTokenSecret = REFRESH_TOKEN_SECRET;
    const refreshTokenExpiry = REFRESH_TOKEN_EXPIRY || "7d";
    

    if (!refreshTokenSecret) {
        console.error("REFRESH_TOKEN_SECRET is not defined");
        throw new Error("Internal server error: Configuration issue");
    }

    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
            tokenVersion: user.tokenVersion || 0, 
        },
        refreshTokenSecret,
        {
            expiresIn: refreshTokenExpiry,
            algorithm: ALGORITHEM,
        }
    );
}

export { generateAccessToken, generateRefreshToken };

