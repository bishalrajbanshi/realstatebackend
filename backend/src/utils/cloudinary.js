import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Manager } from "../models/manager.model.js";
import { apiError } from "./apiError.js";

// Cloudinary Configuration
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided.");
            return null;
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", 
        });

        console.log("File uploaded to Cloudinary:", response.url);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        // Safely remove the file in case of upload error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw error; // Pass the error up to the controller
    }
};



export { uploadOnCloudinary };
