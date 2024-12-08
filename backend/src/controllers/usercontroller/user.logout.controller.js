import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const logoutUser = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            throw new apiError({
                statusCode: 401,
                message: "User not authorized",
            });
        }

        // Remove the refreshToken from the use document
        await User.findByIdAndUpdate(
            userId,
            { $unset: 
               { refreshToken: 1, accessToken: 1 },
            }, 
            { new: true }
        );

        // Clear cookies for both accessToken and refreshToken
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
        };

        res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(
                new apiResponse({
                    statusCode: 200,
                    data: null,
                    message: "User logged out successfully",
                })
            );
    } catch (error) {
        console.error("Logout error:", error);
        return next(
            new apiError({
                statusCode: 500,
                message: "Unable to logout user",
            })
        );
    }
});

export { logoutUser };
