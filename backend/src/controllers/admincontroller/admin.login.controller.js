import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { Admin } from "../../models/adminmodel/admin.model.js";
import bcryptjs from "bcryptjs";

const adminlogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check for empty fields
        if (!email || !password) {
            return next(new apiError({
                statusCode: 400,
                message: "All fields are required",
            }));
        }

        // Validate password format
        if (typeof password !== "string" || password.trim() === "") {
            return next(new apiError({
                statusCode: 400,
                message: "Invalid password format",
            }));
        }

        // Check if the admin exists with the provided email
        const existUser = await Admin.findOne({ email });

        if (!existUser) {
            return next(new apiError({
                statusCode: 400,
                message: "Incorrect credentials for admin login",
            }));
        }

        // Log the user and password for debugging
        console.log("Found user:", existUser);
        console.log("Received password:", password);  
        console.log("Stored hashed password:", existUser.password);  

        // Verify the password using bcryptjs
        const isPasswordValid = await bcryptjs.compare(password, existUser.password);

        console.log("Password comparison result:", isPasswordValid);

        if (!isPasswordValid) {
            return next(new apiError({
                statusCode: 400,
                message: "Incorrect credentials for admin login",
            }));
        }

        // Check if the user is an admin
        if (!existUser.isAdmin) {
            return next(new apiError({
                statusCode: 403,
                message: "You are not authorized to access this resource",
            }));
        }

        // Send success response
        return new apiResponse({
            success: true,
            message: "Admin logged in successfully",
            data: {
                email: existUser.email,
                fullName: existUser.fullName,
            },
        });
        
    } catch (error) {
        console.error(error);
        return next(new apiError({
            statusCode: 500,
            message: "Error while admin login",
        }));
    }
});

export { adminlogin };
