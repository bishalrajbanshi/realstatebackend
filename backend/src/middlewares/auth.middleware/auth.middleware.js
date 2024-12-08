import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

        if (!token) {
            throw new apiError({
                statusCode: 401,
                message: "Unauthorized access: Token is missing",
            });
        }

        // Verify the token with the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decodedToken);

        // Find the user associated with the token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -accessToken");

        if (!user) {
            throw new apiError({
                statusCode: 401,
                message: "Invalid access token: User not found",
            });
        }

        // Attach user information to the request object
        req.user = user;
        next();
    } catch (error) {
        // Handle token errors
        if (error.name === "TokenExpiredError") {
            throw new apiError({
                statusCode: 401,
                message: "Token expired. Please login again.",
            });
        } else if (error.name === "JsonWebTokenError") {
            throw new apiError({
                statusCode: 401,
                message: "Malformed token. Authentication failed.",
            });
        }

        // Handle other errors
        throw new apiError({
            statusCode: 401,
            message: "Invalid access token",
        });
    }
});

export { verifyJWT };
