
import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";

const adminManagerLogout = asyncHandler(async (req, res, next) => {
    try {
        const { role } = req.body;

        // Validate role logout function
        if (role === "Admin") {
            await logoutUser(Admin, req, res, next);
        } else if (role === "Manager") {
            await logoutUser(Manager, req, res, next);
        } else {
            throw new apiError({
                statusCode: 400,
                message: "Invalid role"
            });
        }
    } catch (error) {
        console.error("Logout error:", error);
        next(error);
    }
});

export { adminManagerLogout };

// Common function for both Admin and Manager logout
async function logoutUser(UserModel, req, res, next) {
    try {
       
        const userId = req.user?._id;

        if (!userId) {
            throw new apiError({
                statusCode: 401,
                message: `${UserModel.modelName} not authenticated`
            });
        }

        // Clear tokens from the database
        await UserModel.findByIdAndUpdate(
            userId,
            {
                $unset: {
                    accessToken: 1,
                    refreshToken: 1,
                },
            },
            { new: true }
        );

        // Clear cookies
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
            .json({
                statusCode: 200,
                data: null,
                message: `${UserModel.modelName} logged out successfully`,
                success: true,
            });
    } catch (error) {
        console.error("Failed to log out:", error);
        next(
            new apiError({
                statusCode: 500,
                message: `Unable to logout ${UserModel.modelName}`,
            })
        );
    }
}

