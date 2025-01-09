import { Manager } from "../../../models/manager.model.js";
import { Managerpost } from "../../../models/manager.post.model.js";
import { Sellerfrom } from "../../../models/user.seller.from.model.js";
import { utils } from "../../../utils/index.js";
const { apiError, uploadOnCloudinary } = utils;
import fs from "fs";

const managerpost = async (sellerId, managerId, fullName, mobileNumber, landType, landCategory, facilities, req) => {
  let avatarFiles = null;
  try {
    if (!sellerId) {
      throw new apiError({
        statusCode: 401,
        message: "Seller ID not found",
      });
    }

    const postData = await Sellerfrom.findById(sellerId);
    if (!postData) {
      throw new apiError({
        statusCode: 404,
        message: "Seller ID is invalid",
      });
    }

    // Find manager
    const manager = await Manager.findById(managerId);
    if (!manager) {
      throw new apiError({
        statusCode: 404,
        message: "Manager not found",
      });
    }

    // Manager post validation check if post already exists for this sellerId
    const existingPost = await Managerpost.findOne({ sellerId: sellerId });
    if (existingPost) {
      throw new apiError({
        statusCode: 400,
        message: "Post already exists for this seller",
      });
    }

    // Handle multiple avatar images
    avatarFiles = req.files?.["avatar"];
    if (!avatarFiles || avatarFiles.length === 0) {
      throw new apiError({
        statusCode: 400,
        message: "Images not found",
      });
    }

    // Upload all avatar images to Cloudinary
    const avatarLinks = [];
    for (let file of avatarFiles) {
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      if (!cloudinaryResponse) {
        throw new apiError({
          statusCode: 500,
          message: "Error uploading avatar to Cloudinary",
        });
      }

      avatarLinks.push(cloudinaryResponse.url);

      // Delete the temporary file after upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    // Handle facilities
    const existingFacilities = postData.facilities || [];
    const newFacilities = Array.isArray(facilities) ? facilities : [facilities];
    const updatedFacilities = [...new Set([...existingFacilities, ...newFacilities])];

    // Create the new post
    const newPost = new Managerpost({
      postBy: managerId,
      managerFullName: manager.fullName,
      managerAddress: manager.address,
      sellerId: sellerId,
      sellerFullName: fullName || postData.fullName,
      sellerNumber: mobileNumber || postData.mobileNumber,
      sellerFacilities: updatedFacilities || postData.facilities,
      sellerLandType: landType || postData.landType,
      sellerLandCatagory: landCategory || postData.landCategory,
      avatar: avatarLinks,
    });

    // Save the new post
    await newPost.save();
  } catch (error) {
    // Cleanup temporary files in case of error
    if (avatarFiles) {
      avatarFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    throw error;
  }
};

export { managerpost };
