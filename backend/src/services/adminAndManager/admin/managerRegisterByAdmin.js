import { sendEmail } from "../../../middlewares/emailMiddleware/sendEmail.js";
import { Manager } from "../../../models/manager.model.js";
import { utils } from "../../../utils/index.js";
const { 
    apiError, 
    emailHtmlContent,
    uploadOnCloudinary
} = utils;
import fs from "fs"

const managerRegister = async (managerData, adminId,req) => {
    let avatarFile = null;
    try {
      const { fullName, email, mobileNumber,address, password } = managerData;
 
      if (!adminId) {
         throw new apiError({
             statusCode: 401,
             message: "Unauthorized admin access",
         });
     }
  
      // Validate all fields
      if (
          [fullName, email, mobileNumber, address, password].some((field) => !field?.trim())
      ) {
          throw new apiError({
              statusCode: 400,
              message: "All fields are required",
          });
      };
  
      const existingManager  = await Manager.findOne({
          $or: [{ email }, { mobileNumber }]
      });
      
      // Validate if manager exists
      if (existingManager ) {
          throw new apiError({
              statusCode: 400,
              message: "Manager already exists"
          });
      } 
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

      // Create entry in DB
      const newManager = new Manager({
        fullName,
        email,
        mobileNumber,
        password,
        address,
        avatar: avatarLink,
        createdBy: adminId,
      });
      console.log("Saving new manager:", newManager);
    await newManager.save();
    console.log("New manager saved successfully");
 
     // Send email to manager
     const emailHtml = emailHtmlContent({
         fullName: newManager.fullName,
         verificationCode: password
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
         if (avatarFile?.path && fs.existsSync(avatarFile.path)) {
            fs.unlinkSync(avatarFile.path);
        }

     throw error;
    }
 };
 
 export { managerRegister };