import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/common/asyncHandler.js";
import { apiError } from "../../utils/common/apiError.js";
import { config } from "../../constant.js";
const { ACCESS_TOKEN_SECRET } = config;

const verifyJWT = (model) =>
  asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      throw new apiError({
        statusCode: 401,
        message: "Unauthorized access Token is missing",
      });
    }

    try {
      const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

      if (!model) {
        throw new apiError({
          statusCode: 500,
          message: "Model not specified for token verification",
        });
      }

      const entity = await model
        .findById(decodedToken?._id)
        .select("-password");

      if (!entity) {
        throw new apiError({
          statusCode: 401,
          message: "Invalid access token: Entity not found",
        });
      }

      // Assign entity to the correct request fiel
      // Assign the entity based on the model name
      if (model.modelName === "Admin") {
        req.admin = entity;
      } else if (model.modelName === "Manager") {
        req.manager = entity;
      } else if (model.modelName === "User") {
        req.user = entity;
      } else {
        throw new apiError({
          statusCode: 500,
          message: `Unsupported model type: ${model.modelName}`,
        });
      }
      next();
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
      });
    }
  });

export { verifyJWT };
