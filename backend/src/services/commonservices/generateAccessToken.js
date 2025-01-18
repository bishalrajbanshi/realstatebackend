import { utils } from "../../utils/index.js";
const { apiError } = utils;
import { config } from "../../constant.js";
const { REFRESH_TOKEN_SECRET } = config;
import jwt from "jsonwebtoken";
import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { User } from "../../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/helper/generateTokens.js";

const generateNewToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new apiError({
        statusCode: 403,
        message: "Refresh token is missing",
      });
    }
    console.log("refresh token",refreshToken);

    //verify the refresh token with my refresh secret key
    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    console.log("decoded token",decodedToken.role);

    let user;
    if (decodedToken.role === "Admin") {
      user = await Admin.findById(decodedToken._id);
    }
   else if (decodedToken.role === "Manager") {
      user = await Manager.findById(decodedToken._id);
    }else{
      user = await User.findById(decodedToken._id)
    }

    const accessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user);
    console.log("new refresh token",newRefreshToken);
    
    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, newRefreshToken};


 
  
  } catch (error) {
    console.error("JWT Verification error:", error);

    if (error.name === "TokenExpiredError") {
      throw new apiError({
        statusCode: 401,
        message: "TokenExpired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      throw new apiError({
        statusCode: 401,
        message: "Malformed token. Authentication failed.",
      });
    }

    throw new apiError({
      statusCode: 401,
      message: "Invalid access token",
    })
  }
};


export { generateNewToken }






// / //validate user not found
    // if (!user || user.refreshToken !== refreshToken) {
    //   throw new apiError({
    //     statusCode: 403,
    //     message: "invalid refresh token",
    //   });
    // }

    // const accessToken = generateAccessToken(user);
    // const newRefreshToken = generateRefreshToken(user);
    // //set and save to db
    // user.refreshToken = newRefreshToken;
    // await user.save();

      // return { accessToken, newRefreshToken };