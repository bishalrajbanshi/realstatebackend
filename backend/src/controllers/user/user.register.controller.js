
// import { User } from "../../models/user.model.js";
// import { apiError } from "../../utils/apiError.js";
// import { apiResponse } from "../../utils/apiResponse.js";
// import otpGenerator from "otp-generator";
// import { sendEmail } from "../../middlewares/emailmiddleware/sendemail.js";
// import { emailHtmlContent } from "../../utils/emailTemplate.js"
// const registerUser = async (req, res, next) => {
//     try {
//         const { fullName, email, mobileNumber, password } = req.body;

//         console.log("Received data:", { fullName, email, mobileNumber, password });

//         // Validate input fields
//         if (!fullName || !email || !mobileNumber || !password) {
//             console.log("Validation error: All fields are required.");
//             return next(
//                 new apiError({
//                     statusCode: 400,
//                     message: "All fields are required",
//                 })
//             );
//         }

//         // Check if the user already exists
//         const existUser = await User.findOne({
//             $or: [ {email}, {mobileNumber}]
//         });
//         if (existUser) {
//             console.log("User already exists:", existUser);

//             // If user is not verified, resend verification code
//             if (!existUser.isverified) {
//                 const newVerificationCode = otpGenerator.generate(6, {
//                     digits: true,
//                     alphabets: false,
//                     specialChars: false,
//                 });

//                 existUser.verificationCode = newVerificationCode;
//                 await existUser.save();

//                 console.log(`Resending verification code to: ${existUser.email}`);
//                 await sendEmail({
//                     to: existUser.email,
//                     subject: "Verification Code Resent",
//                     text: `Your new verification code is ${newVerificationCode}`,
//                     // html: emailHtmlContent,
//                 });

//                 return new apiResponse({
//                     statusCode: 200,
//                     success: true,
//                     message: "Verification code resent to your email",
//                 }).send(res);
//             }

//             // If the user exists and is verified, return an error
//             console.log("User already verified. No action needed.");
//             return next(
//                 new apiError({
//                     statusCode: 400,
//                     success: false,
//                     message: "User already exists and is verified",
//                 })
//             );
//         }

//         // Generate OTP for new user registration
//         const verificationCode = otpGenerator.generate(6, {
//             digits: true,
//             alphabets: false,
//             specialChars: false,
//         });

//         // Create a new user
//         const newUser = new User({
//             fullName,
//             email,
//             mobileNumber,
//             password,
//             verificationCode,
//         });

//         console.log("Saving new user:", newUser);
//         await newUser.save();

//         console.log("Sending email to:", newUser.email);
//         await sendEmail({
//             to: newUser.email,
//             subject: "Verification Code",
//             text: `Your verification code is ${verificationCode}`,
//             html: `<p>Hello ${newUser.fullName},</p><p>Your verification code is <strong>${verificationCode}</strong>.</p>`,
//         });

//         return new apiResponse({
//             statusCode: 200,
//             success: true,
//             message: "Verification code sent to your email",
//         }).send(res);
//     } catch (error) {
//         console.error("Error while registering user:", error.message, error.stack);

//         return next(
//             new apiError({
//                 statusCode: 500,
//                 message: "Error while registering user",
//                 success: false,
//             })
//         );
//     }
// };

// export { registerUser };



import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import otpGenerator from "otp-generator";
import { sendEmail } from "../../middlewares/emailmiddleware/sendemail.js";
import { emailHtmlContent } from "../../utils/emailTemplate.js"
const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, mobileNumber, password } = req.body;

        console.log("Received data:", { fullName, email, mobileNumber, password });

        // Validate input fields
        if (!fullName || !email || !mobileNumber || !password) {
            return next(
                new apiError({
                    statusCode: 400,
                    message: "All fields are required.",
                })
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { mobileNumber }],
        });

        if (existingUser) {
            if (!existingUser.isverified) {
                
                const newVerificationCode = otpGenerator.generate(6, {
                    digits: true,
                    alphabets: false,
                    specialChars: false,
                });

                existingUser.verificationCode = newVerificationCode;
                await existingUser.save();

                // Send verification email
                const emailHtml = emailHtmlContent({
                    fullName: existingUser.fullName,
                    verificationCode: newVerificationCode,
                });

                await sendEmail({
                    to: existingUser.email,
                    subject: "Verification Code Resent",
                    html: emailHtml,
                });

                return new apiResponse({
                    statusCode: 200,
                    success: true,
                    message: "Verification code resent to your email.",
                }).send(res);
            }

            // User already exists and is verified
            return next(
                new apiError({
                    statusCode: 400,
                    message: "User already exists and is verified.",
                })
            );
        }

        // Generate OTP for new user registration
        const verificationCode = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            specialChars: false,
        });

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            mobileNumber,
            password,
            verificationCode,
        });

        await newUser.save();

        // Send verification email
        const emailHtml = emailHtmlContent({
            fullName,
            verificationCode,
        });

        await sendEmail({
            to: email,
            subject: "Verify Your Email",
            html: emailHtml,
        });

        return new apiResponse({
            statusCode: 200,
            success: true,
            message: "Verification code sent to your email.",
        }).send(res);
    } catch (error) {
        console.error("Error in user registration:", error.message, error.stack);

        return next(
            new apiError({
                statusCode: 500,
                message: "Error while registering user.",
            })
        );
    }
};

export { registerUser };

