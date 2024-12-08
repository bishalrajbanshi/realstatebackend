import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    try {

        if (!localFilePath) {
            return null;
        }

        //upload on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        });

        //success message
        console.log("file uploaded on clodinary",response.url);
        return response;
        
        
    } catch (error) {
        //remove locally saved temp file
        fs.unlinkSync(localFilePath);

    }

}

export { uploadOnCloudinary }