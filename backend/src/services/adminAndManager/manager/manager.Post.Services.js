import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { Sellproperty } from "../../../models/sell.property.model.js";
import { middlewares } from "../../../middlewares/index.js";
const { uploadOnCloudinary } =middlewares;
import { utils } from "../../../utils/index.js";
const { apiError } = utils;
import fs from "fs";

const managerpost = async (userId, managerId, postdata, req) => {
  let avatarFiles = null;
  let imagesFiles = null;
  
  try {
    const { fullName, mobileNumber, landType, landCategory, facilities, area, price, isNegotiable, purpose, description } = postdata;
    
    if (!userId) {
      throw new apiError({ statusCode: 401, message: "Seller ID not found" });
    }

    const sellerData = await Sellproperty.findById(userId);
    if (!sellerData) {
      throw new apiError({ statusCode: 404, message: "Seller ID is invalid" });
    }

    const manager = await Manager.findById(managerId);
    if (!manager) {
      throw new apiError({ statusCode: 404, message: "Manager not found" });
    }

    const existingPost = await Post.findOne({ userId: userId });
    if (existingPost) {
      throw new apiError({ statusCode: 400, message: "Post already exists for this seller" });
    }

    avatarFiles = req.files?.["avatar"];
    imagesFiles = req.files?.["images"];
    if (!avatarFiles || avatarFiles.length === 0) {
      throw new apiError({ statusCode: 400, message: "Avatar not found" });
    };
    if (!imagesFiles || imagesFiles.length === 0) {
      throw new apiError({ statusCode: 400, message: "Images not found" });
    }

    // Upload all avatar images to Cloudinary 
    const avatarPromises = avatarFiles.map(file => uploadOnCloudinary(file.path).then(response => response.url));
    const avatarLinks = await Promise.all(avatarPromises);

    // Upload all images to Cloudinary 
    const imagesPromises = imagesFiles.map(file => uploadOnCloudinary(file.path).then(response => response.url));
    const imagesLinks = await Promise.all(imagesPromises);

    // Delete the temporary files after upload
    avatarFiles.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    imagesFiles.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    // Handle facilities
    const existingFacilities = sellerData.facilities || [];
    const newFacilities = Array.isArray(facilities) ? facilities : [facilities];
    const updatedFacilities = [
      ...new Set([...existingFacilities, ...newFacilities]),
    ].filter((facility) => facility);

    // Create the new post
    const newPost = new Post({
      postBy: managerId,
      managerFullName: manager.fullName,
      managerAddress: manager.address,
      userId: userId,
      homeName: sellerData.homeName,
      fullName: fullName || sellerData.fullName,
      sellerNumber: mobileNumber || sellerData.mobileNumber,
      landLocation: sellerData.landLocation,
      landType: landType || sellerData.landType,
      landCatagory: landCategory || sellerData.landCategory,
      area: area,
      avatar: avatarLinks,
      images: imagesLinks,
      facilities: updatedFacilities.length > 0 ? updatedFacilities : sellerData.facilities,
      price: price,
      isNegotiable: isNegotiable,
      purpose: purpose,
      description: description,
    });

    // Save the new post
    await newPost.save();
  } catch (error) {
    // Cleanup temporary files in case of error
    if (avatarFiles) {
      avatarFiles.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    throw error;
  }
};


export { managerpost };


