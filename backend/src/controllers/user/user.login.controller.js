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


        //(excluding sensitive fields)
        const loggedInUser = await User.findById(user._id).select(
            "-password -accessToken -refreshToken"
        );


        // Set cookies for tokens
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
        };

        // Return response
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                statusCode: 200,
                message: "User logged in successfully",
                success: true,
            });
    } catch (error) {
        console.error("Failed to log in:", error);
        next(error);
    }
};

export { loginUser };