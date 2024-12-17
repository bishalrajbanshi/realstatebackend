import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { Manager } from "../../models/manager.model.js";
import { emailHtmlContent } from "../../utils/emailTemplate.js";
import { sendEmail } from "../../middlewares/emailmiddleware/sendemail.js";
import bcryptjs from "bcryptjs";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import path from "path";
import fs from "fs";

const registerManager = asyncHandler(async (req, res, next) => {
    try {
        const { fullName, email, mobileNumber, password } = req.body;
        const pwdToManager = password;

      

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

          // get the upload filr info
          const avatarFile = req.files["avatar"]?req.files["avatar"][0]: null;

          if (!avatarFile) {
             throw new apiError({
                 statusCode:400,
                 message: "avatar not found"
             })
          }
 
         //upload on cloudinary
         const cloudinaryresponse = await uploadOnCloudinary(avatarFile.path)
         if (!cloudinaryresponse) {
            fs.unlinkSync(avatarFile.path);
            throw new apiError({
                statusCode:500,
                message:"Error uploding avatar on cloudinary"
            })
         }

         const avatarLink = cloudinaryresponse.url;

         //delet local filr path
         fs.unlinkSync(avatarFile.path);
   

        // Create and save new manager
        const newManager = new Manager({
            fullName,
            email,
            mobileNumber,
            password,
            avatar:avatarLink,
            createdBy: adminId,
        });

        await newManager.save();
   

        const htmlContent = emailHtmlContent({
            fullName:newManager.fullName,
            verificationCode: pwdToManager 
        });

        await sendEmail({
            to:newManager.email,
            subject: "Manager Registration - Login Credentials",
            html: htmlContent, 
        })
      

        // Send success response
        return res.status(201).json({
            success: true,
            message: "Manager registered successfully",
            data: {
                fullName: newManager.fullName,
                email: newManager.email,
                mobileNumber: newManager.mobileNumber,
                avatar: avatarLink
            },
        });
    } catch (error) {
        console.error("Error while registering manager:", error);
        next(error);
    }
});

export { registerManager };
