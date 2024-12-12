import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";


const adminManagerlogin = asyncHandler(async (req, res, next) => {
    try {
        const { role, email, password } = req.body;

        if (role === "Admin") {
            await loginUser(Admin, email, password, res, next);
        } else if (role === "Manager") {
            await loginUser(Manager, email, password, res, next);
        } else {
            throw new apiError({
                statusCode: 400,
                message: "Invalid role"
            });
        }
    } catch (error) {
        console.log("error", error);
        next(error);
    }
});

export { adminManagerlogin };

// Common function for both Admin and Manager login
async function loginUser(UserModel, email, password, res, next) {
    try {
        const user = await UserModel.findOne({ email });

        // Check if the user exists
        if (!user) {
            throw new apiError({
                statusCode: 400,
                message: `${UserModel.modelName} not found`
            });
        }

        // Check if the password is valid
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new apiError({
                statusCode: 400,
                message: "Invalid password"
            });
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        await user.save(); 
        // Exclude sensitive data from the response
        const loggedIn = await UserModel.findById(user._id).select("-password -accessToken -refreshToken");

        // Cookie options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                statusCode: 200,
                data: {
                    user: loggedIn, 
                    accessToken,
                    refreshToken,
                },
                message: `${UserModel.modelName} logged in successfully`,
                success: true,
            });

    } catch (error) {
        console.error("Failed to log in:", error);
        next(error); 
    }
}
