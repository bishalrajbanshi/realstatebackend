import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { Sellproperty } from "../../../models/sell.property.model.js";
import { middlewares } from "../../../middlewares/index.js";
const { uploadOnCloudinary } = middlewares;
import { utils } from "../../../utils/index.js";
const { apiError } = utils;
import fs from "fs";

// Manager Post
const managerpost = async (sellerId, managerId, postdata, req) => {
  try {
    const {
      fullName,
      propertyTitle,
      mobileNumber,
      province,
      landAddress,
      landType,
      landCategory,
      area,
      facing,
      facilities,
      price,
      isNegotiable,
      purpose,
      featured,
      facebookVideoLink,
      youtubeVideoLink,
      propertyOverView,
      description,
    } = postdata;

    // Validate required fields
    if (
      !area?.size ||
      !area?.unit ||
      !price?.amount ||
      !price?.sizePerAmount ||
      [
        landType,
        province,
        propertyOverView,
        landCategory,
        facilities,
        isNegotiable,
        purpose,
        description,
      ].some((field) => !String(field).trim())
    ) {
      throw new apiError({
        statusCode: 400,
        message: "All required fields are missing or invalid",
      });
    }

    // Validate seller and manager
    const sellerData = sellerId ? await Sellproperty.findById(sellerId) : null;
    if (sellerId && !sellerData) {
      throw new apiError({ statusCode: 404, message: "Seller ID is invalid" });
    }

    const manager = await Manager.findById(managerId);
    if (!manager) {
      throw new apiError({ statusCode: 404, message: "Manager not found" });
    }

    // Check if a post already exists for the seller
    if (sellerId && (await Post.findOne({ sellerId }))) {
      throw new apiError({
        statusCode: 400,
        message: "Post already exists for this seller",
      });
    }

    // Validate uploaded files
    const avatarFiles = req.files?.["avatar"] || [];
    const imagesFiles = req.files?.["images"] || [];

    if (!avatarFiles.length || !imagesFiles.length) {
      throw new apiError({
        statusCode: 400,
        message: "Avatar and images are required",
      });
    }

    if (req.fileValidationError) {
      throw new apiError({
        statusCode: 400,
        message: req.fileValidationError,
      });
    }

    // Upload files to Cloudinary concurrently
    const allFiles = [...avatarFiles, ...imagesFiles];
    const uploadPromises = allFiles.map((file) =>
      uploadOnCloudinary(file.path).then((res) => res.secure_url)
    );
    const allLinks = await Promise.all(uploadPromises);

    // Split uploaded links into avatars and images
    const avatarLinks = allLinks.slice(0, avatarFiles.length);
    const imagesLinks = allLinks.slice(avatarFiles.length);

    // Clean up uploaded files
    allFiles.forEach((file) => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });

    // Merge facilities
    const existingFacilities = sellerData?.facilities || [];
    const newFacilities = Array.isArray(facilities) ? facilities : [facilities];
    const updatedFacilities = [
      ...new Set([...existingFacilities, ...newFacilities]),
    ].filter(Boolean);

    // Create new post
    const newPost = new Post({
      postBy: managerId,
      managerFullName: manager.fullName,
      managerAddress: manager.province,
      sellerId: sellerId || null,
      propertyTitle: propertyTitle || sellerData?.propertyTitle,
      fullName: fullName || sellerData?.fullName,
      sellerNumber: mobileNumber || sellerData?.mobileNumber,
      province: province || sellerData?.province,
      landAddress: landAddress || sellerData?.landAddress,
      landType: landType || sellerData?.landType,
      landCategory: landCategory || sellerData?.landCategory,
      propertyOverView,
      area: { size: area.size, unit: area.unit },
      avatar: avatarLinks,
      images: imagesLinks,
      facing,
      facilities: updatedFacilities.length ? updatedFacilities : [],
      price: { amount: price.amount, sizePerAmount: price.sizePerAmount },
      isNegotiable: isNegotiable,
      purpose: purpose,
      facebookVideoLink: facebookVideoLink,
      youtubeVideoLink: youtubeVideoLink,
      featured: featured,
      description: description,
    });

    await newPost.save();
  } catch (error) {
    // Clean up files in case of error
    if (req.files) {
      const allFiles = [...(req.files["avatar"] || []), ...(req.files["images"] || [])];
      allFiles.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    throw error;
  }
};
//manager edit post
const editPost = async (managerId, postId, updateData) => {
  try {
    // Validation
    if (!managerId) {
      throw new apiError({
        statusCode: 400,
        message: "Manager ID is required",
      });
    }
    if (!postId) {
      throw new apiError({
        statusCode: 400,
        message: "Post ID is required",
      });
    }

    // Validate update data
    if (
      !updateData ||
      typeof updateData !== "object" ||
      Object.keys(updateData).length === 0
    ) {
      throw new apiError({
        statusCode: 400,
        message: "Update data is required and cannot be empty",
      });
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      throw new apiError({
        statusCode: 404,
        message: "Post not found",
      });
    }

    // Update data directly
    Object.keys(updateData).forEach((key) => {
      post[key] = updateData[key];
    });

    // Save updated post
    await post.save();
  } catch (error) {
    throw error;
  }
};

//manager delete post
const postDelete = async (managerId, postId) => {
  try {
    if (!managerId || !postId) {
      throw new apiError({
        statusCode: 400,
        message: "managerId or PostId not found",
      });
    }

    const manager = await Manager.findById(managerId);
    console.log("manager", manager);

    if (!manager) {
      throw new apiError({
        statusCode: 400,
        message: "manager not found",
      });
    }
    const post = await Post.findOneAndDelete({
      _id: postId,
      postBy: manager._id,
    });
    if (!post) {
      throw new apiError({
        statusCode: 400,
        message: "invalid post deletion",
      });
    }
  } catch (error) {
    // Handle invalid ObjectId casting errors
    if (error.name === "CastError" && error.path === "_id") {
      throw new apiError({
        statusCode: 400,
        message: "Invalid postId format",
      });
    }
    throw error;
  }
};

export { managerpost, editPost, postDelete };