import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import otpGenerator from 'otp-generator';
import { sendVerificationCode } from "../../middlewares/emailmiddleware/email.middleware.js";

const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, mobileNumber, password } = req.body;

        // Log the incoming request
        console.log('Received data:', { fullName, email, mobileNumber, password });

        // Validate input fields
        if (!fullName || !email || !mobileNumber || !password) {
            console.log("Validation error: All fields are required.");
            return next(new apiError({
                statusCode: 400,
                message: "All fields are required"
            }));
        }

        // Validate password format
        if (typeof password !== "string" || password.trim() === "") {
            console.log("Validation error: Invalid password format.");
            return next(new apiError({
                statusCode: 400,
                message: "Invalid password format",
            }));
        }

        // Check if user already exists
        const existUser = await User.findOne({ email });

        if (existUser) {
            console.log("User already exists:", existUser);
            if (!existUser.isverified) {
                const newVerificationCode = otpGenerator.generate(6, {
                    digits: true,
                    alphabets: false,
                    specialChars: false
                });

                existUser.verificationCode = newVerificationCode;
                await existUser.save();

                sendVerificationCode(existUser.email, newVerificationCode, existUser.fullName);

                return new apiResponse({
                    statusCode: 200,
                    success: true,
                    message: "Verification code resent to your email",
                }).send(res);
            }

            // If the user exists and is verified, throw an apiError
            return next(new apiError({
                statusCode: 400,
                success: false,
                message: "User already exists"
            }));
        }

        // Generate OTP for new user registration
        const verificationCode = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            specialChars: false
        });

        // Create new user
        const newUser = new User({
            fullName,
            email,
            mobileNumber,
            password,
            verificationCode
        });

        console.log("Saving new user:", newUser);

        await newUser.save();

        // Send verification code email
        sendVerificationCode(newUser.email, verificationCode, newUser.fullName);

        return new apiResponse({
            statusCode: 200,
            success: true,
            message: "Verification code sent to your email",
        }).send(res);
    } catch (error) {
        console.error("Error while registering user:", error.message, error.stack);
        
        return next(new apiError({
            statusCode: 500,
            message: "ERROR WHILE REGISTERING USER",
            success: false,
        }));
    }
};

export { registerUser };
