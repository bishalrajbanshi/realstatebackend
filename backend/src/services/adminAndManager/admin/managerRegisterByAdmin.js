import { Manager } from "../../../models/manager.model.js";
import { utils } from "../../../utils/index.js";
const { apiError, emailHtmlContent } = utils;

import { middlewares } from "../../../middlewares/index.js";
const { uploadOnCloudinary, sendEmail } = middlewares;

import fs from "fs";

const managerRegister = async (managerData, adminId, req) => {
    let avatarFile = null;
    try {
        const { fullName, email, mobileNumber, address, password } = managerData;

        if (!adminId) {
            throw new apiError({
                statusCode: 401,
                message: "Unauthorized admin access",
            });
        }

        //  Validate required fields
        if ([fullName, email, mobileNumber, address, password].some((field) => !field?.trim())) {
            throw new apiError({
                statusCode: 400,
                message: "All fields are required",
            });
        }

        // Check if the manager already exists
        const existingManager = await Manager.findOne({
            $and: [{ email }, { mobileNumber }],
        });

        if (existingManager) {
            throw new apiError({
                statusCode: 400,
                message: "Manager already exists",
            });
        }

        //  Check if avatar file exists in request
        avatarFile = req.files?.avatar?.[0]?.path;
        if (!avatarFile) {
            throw new apiError({
                statusCode: 400,
                message: "Avatar file is required",
            });
        }

        //  Ensure the file exists before uploading
        if (!fs.existsSync(avatarFile)) {
            throw new apiError({
                statusCode: 400,
                message: "Uploaded file not found",
            });
        }

        //  Upload avatar to Cloudinary
        console.time("Cloudinary Upload Time");
        const cloudinaryResponse = await uploadOnCloudinary(avatarFile);
        console.timeEnd("Cloudinary Upload Time");

        if (!cloudinaryResponse || !cloudinaryResponse.url) {
            throw new apiError({
                statusCode: 500,
                message: "Error uploading avatar to Cloudinary",
            });
        }

        const avatarLink = cloudinaryResponse.url;
        console.log("Cloudinary Upload Successful:", avatarLink);

        //  Delete the temporary file after upload
        if (fs.existsSync(avatarFile)) {
            fs.unlinkSync(avatarFile);
        }

        //  Create new manager entry in DB
        const newManager = new Manager({
            fullName,
            email,
            mobileNumber,
            password,
            address,
            avatar: avatarLink,
            createdBy: adminId,
        });

        await newManager.save();
       

        //  Send email to manager
        const emailHtml = emailHtmlContent({
            fullName: newManager.fullName,
            verificationCode: password,
        });

         sendEmail({
            to: newManager.email,
            subject: "Manager Registration - Login Credentials",
            html: emailHtml,
        });

        return newManager;
    } catch (error) {
        console.error("Error in managerRegister:", error);

        // Cleanup temporary file in case of error
        if (avatarFile && fs.existsSync(avatarFile)) {
            fs.unlinkSync(avatarFile);
        }

        throw error;
    }
};

export { managerRegister };
