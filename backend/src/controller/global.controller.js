import { middlewares } from "../middlewares/index.js";
const { generateNewToken } = middlewares;

import { utils } from "../utils/index.js";
const { apiError, apiResponse } = utils;

//generate access token
const generateAccessTokens = async (req, res, next) => {
    const { refreshToken } = req.cookies;
  
    try {
      // Validate refresh token
      if (!refreshToken) {
        return next(
          new apiError({
            statusCode: 403,
            message: "Refresh token is missing",
          })
        );
      }
  
      // Generate new access token
      const { accessToken,role } =
        await generateNewToken(refreshToken);
  
      // Cookie options
      const options = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
  
      // Set cookies and send response
      return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        ...options,
        path: "/api/auth/refresh", 
      })
        .json(
          new apiResponse({
            success: true,
            message: "Token refreshed successfully",
            data: { accessToken,role },
          })
        );
    } catch (error) {
      return next(
        new apiError({
          statusCode: error.statusCode || 500,
          message: error.message || "Error generating token",
        })
      );
    }
  };


  export { generateAccessTokens };