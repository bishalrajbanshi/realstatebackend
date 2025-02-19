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
      videoLink,
      propertyOverView,
      description,
    } = postdata;

    //extrace the area
    const size = area?.size;
    const unit = area?.unit;
    if (!size || !unit) {
      throw new apiError({
        statusCode: 401,
        message: "area and size is required",
      });
    }

    //extrace the price
    const amount = price?.amount;
    const sizePerAmount = price?.sizePerAmount;
    console.log(amount, sizePerAmount);

    if (!amount || !sizePerAmount) {
      throw new apiError({
        statusCode: 401,
        message: "area and size is required",
      });
    }

    if (
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
        message: "All fields are required",
      });
    }

    const sellerData = sellerId ? await Sellproperty.findById(sellerId) : null;
    if (sellerId && !sellerData)
      throw new apiError({ statusCode: 404, message: "Seller ID is invalid" });

    const manager = await Manager.findById(managerId);
    if (!manager)
      throw new apiError({
        statusCode: 404,
        message: "Manager not found",
      });

    if (sellerId && (await Post.findOne({ sellerId }))) {
      throw new apiError({
        statusCode: 400,
        message: "Post already exists for this seller",
      });
    }

    const avatarFiles = req.files?.["avatar"] || [];
    const imagesFiles = req.files?.["images"] || [];

    if (!avatarFiles.length)
      throw new apiError({ statusCode: 400, message: "Avatar not found" });
    if (!imagesFiles.length)
      throw new apiError({ statusCode: 400, message: "Images not found" });

    if (req.fileValidationError)
      throw new apiError({ statusCode: 400, message: req.fileValidationError });

    const allFiles = [...avatarFiles, ...imagesFiles];

    // Upload all files concurrently
    const uploadPromises = allFiles.map((file) =>
      uploadOnCloudinary(file.path).then((res) => res.url)
    );
    const allLinks = await Promise.all(uploadPromises);

    // Split uploaded links into avatars and images
    const avatarLinks = allLinks.slice(0, avatarFiles.length);
    const imagesLinks = allLinks.slice(avatarFiles.length);

    // Clean up uploaded files
    allFiles.forEach(
      (file) => fs.existsSync(file.path) && fs.unlinkSync(file.path)
    );

    const existingFacilities = sellerData?.facilities || [];
    const newFacilities = Array.isArray(facilities) ? facilities : [facilities];
    const updatedFacilities = [
      ...new Set([...existingFacilities, ...newFacilities]),
    ].filter(Boolean);

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
      propertyOverView: propertyOverView,
      area: { size, unit },
      avatar: avatarLinks,
      images: imagesLinks,
      facing: facing,
      facilities: updatedFacilities.length
        ? updatedFacilities
        : sellerData?.facilities || [],
      price: { amount, sizePerAmount },
      isNegotiable: isNegotiable,
      purpose: purpose,
      videoLink: videoLink,
      featured: featured,
      description: description,
    });

    await newPost.save();
  } catch (error) {
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
