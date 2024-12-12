import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import bcryptjs from "bcryptjs";

const loginUser = async (req, res, next) => {
    try {
        const { email, mobileNumber, password } = req.body;

        // Check for empty fields
        if (!email && !mobileNumber) {
            throw new apiError({
                statusCode: 400,
                message: "Mobile number or email is required",
            });
        }

        // Find user by email or mobile number
        const user = await User.findOne({
            $or: [{ email }, { mobileNumber }],
        });

        // Check if user exists
        if (!user) {
            throw new apiError({
                statusCode: 404,
                message: "User not found",
            });
        }

        console.log("Entered password:", password);

        // Validate password
        const isPasswordValid = await user.isPasswordCorrect(password);
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            throw new apiError({
                statusCode: 401,
                message: "Invalid credentials",
            });
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save tokens to user
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        console.log("User saved with tokens.");

        //(excluding sensitive fields)
        const loggedInUser = await User.findById(user._id).select(
            "-password -accessToken -refreshToken"
        );

        console.log("Logged-in user details:", loggedInUser);

        // Set cookies for tokens
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
        };

        console.log("Setting cookies for tokens.");

        // Return response
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                statusCode: 200,
                data: {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                message: "User logged in successfully",
                success: true,
            });
    } catch (error) {
        console.error("Failed to log in:", error);
        next(error);
    }
};

export { loginUser };