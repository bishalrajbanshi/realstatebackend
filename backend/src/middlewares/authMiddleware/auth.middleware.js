import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/common/asyncHandler.js";
import { apiError } from "../../utils/common/apiError.js";

const verifyJWT = (model) =>
  asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      throw new apiError({
        statusCode: 401,
        message: "Unauthorized access: Token is missing",
      });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!model) {
        throw new apiError({
          statusCode: 500,
          message: "Model not specified for token verification",
        });
      }

      const entity = await model.findById(decodedToken?._id).select("-password");

      if (!entity) {
        throw new apiError({
          statusCode: 401,
          message: "Invalid access token: Entity not found",
        });
      }

      // Assign entity to the correct request fiel
 
        req.admin = entity;

        req.manager = entity;

        req.user = entity;
    
    

      next();
    } catch (error) {
      console.error("JWT Verification error:", error);

      if (error.name === "TokenExpiredError") {
        throw new apiError({
          statusCode: 401,
          message: "Token expired. Please log in again.",
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
      });
    }
  });


  export { verifyJWT }
