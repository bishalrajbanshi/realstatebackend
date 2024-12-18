import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { Manager } from "../../../models/manager.model.js";
import { emailHtmlContent } from "../../../utils/emailTemplate.js";
import { sendEmail } from "../../../middlewares/emailmiddleware/sendemail.js";
import bcryptjs from "bcryptjs";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";
import path from "path";
import fs from "fs";

const registerManager = asyncHandler(async (req, res, next) => {
    let avatarFile = null; // Declare here for cleanup in case of an error
    try {
        const { fullName, email, mobileNumber, password } = req.body;

        // Validate admin access
        const adminId = req.admin?._id;
        if (!adminId) {
            throw new apiError({
                statusCode: 401,
                message: "Unauthorized admin access",
            });
        }

        // Check for missing fields
        if ([fullName, email, mobileNumber, password].some((field) => !field?.trim())) {
            throw new apiError({
                statusCode: 400,
                message: "All fields are required",
            });
        }

        // Check if manager already exists
        const existingManager = await Manager.findOne({
            $or: [{ email }, { mobileNumber }],
        });
        if (existingManager) {
            throw new apiError({
                statusCode: 409,
                message: "Manager already exists",
            });
        }

        // Get uploaded avatar file
        avatarFile = req.files?.["avatar"]?.[0] ?? null;
        if (!avatarFile) {
            throw new apiError({
                statusCode: 400,
                message: "Avatar file is required",
            });
        }

        // Upload avatar to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(avatarFile.path);
        if (!cloudinaryResponse) {
            throw new apiError({
                statusCode: 500,
                message: "Error uploading avatar to Cloudinary",
            });
        }
        const avatarLink = cloudinaryResponse.url;

        // Delete the temporary file
        if (fs.existsSync(avatarFile.path)) {
            fs.unlinkSync(avatarFile.path);
        }

        // Save manager to DB
        const newManager = new Manager({
            fullName,
            email,
            mobileNumber,
            password,
            avatar: avatarLink,
            createdBy: adminId,
        });

        await newManager.save();

        // Send email to the manager
        const htmlContent = emailHtmlContent({
            fullName: newManager.fullName,
            verificationCode: password,
        });

        await sendEmail({
            to: newManager.email,
            subject: "Manager Registration - Login Credentials",
            html: htmlContent,
        });

        // Return success response
        return res.status(201).json({
            success: true,
            message: "Manager registered successfully",
            data: {
                fullName: newManager.fullName,
                email: newManager.email,
                mobileNumber: newManager.mobileNumber,
                avatar: avatarLink,
            },
        });
    } catch (error) {
        console.error("Error while registering manager:", error);

        // Cleanup temporary file in case of error
        if (avatarFile?.path && fs.existsSync(avatarFile.path)) {
            fs.unlinkSync(avatarFile.path);
        }

        next(error);
    }
});


export { registerManager };
