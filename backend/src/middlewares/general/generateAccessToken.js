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

    // Verify the refresh token
    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Retrieve the user based on role
    let user;
    if (decodedToken.role === "Admin") {
      user = await Admin.findById(decodedToken._id);
    } else if (decodedToken.role === "Manager") {
      user = await Manager.findById(decodedToken._id);
    } else {
      user = await User.findById(decodedToken._id);
    }

    // Validate user existence
    if (!user) {
      throw new apiError({
        statusCode: 403,
        message: "User not found",
      });
    }

    // Check if the refresh token exists in the user's stored refresh tokens
    if (!user.refreshToken.includes(refreshToken)) {
      throw new apiError({
        statusCode: 403,
        message: "Invalid refresh token",
      });
    }

    if (!user || !Array.isArray(user.refreshToken)) {
      throw new apiError({
        statusCode: 403,
        message: "User not found or invalid refresh token storage",
      });
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Remove the used refresh token and store the new one
    user.refreshToken = user.refreshToken.filter((rt) => rt !== refreshToken);
    user.refreshToken.push(newRefreshToken);
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error("JWT Verification error:", error);

    if (error.name === "TokenExpiredError") {
      throw new apiError({
        statusCode: 401,
        message: "Token expired",
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
      message: "Invalid token",
    });
  }
};

export { generateNewToken };
