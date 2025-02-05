import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { Sellproperty } from "../../../models/sell.property.model.js";
import { middlewares } from "../../../middlewares/index.js";
const { uploadOnCloudinary } =middlewares;
import { utils } from "../../../utils/index.js";
const { apiError } = utils;
import fs from "fs";

//manager post
const managerpost = async (sellerId, managerId, postdata, req) => {
  let avatarFiles = null;
  let imagesFiles = null;
  
  try {
    const { fullName,propertyTitle, mobileNumber,landLocation,landCity,
      landAddress,landType, landCategory, facilities, area, price, isNegotiable, purpose, featured,videoLink, description } = postdata;

    if ([landType, landCategory, facilities, area, price, isNegotiable, purpose, description].some((field) => String(field).trim() === "")) {
      throw new apiError({
        statusCode: 400,
        message: "All fields are required",
      });
    }
    
    
    let sellerData = null;

    if (sellerId) {
      sellerData = await Sellproperty.findById(sellerId);
      if (!sellerData) {
        throw new apiError({ statusCode: 404, message: "Seller ID is invalid" });
      }
    }

    const manager = await Manager.findById(managerId);
    if (!manager) {
      throw new apiError({ statusCode: 404, message: "Manager not found" });
    }
if (sellerId) {
  const existingPost = await Post.findOne({ sellerId: sellerId });
  if (existingPost) {
    throw new apiError({ statusCode: 400, message: "Post already exists for this seller" });
  }
  
}
   

    avatarFiles = req.files?.["avatar"];
    imagesFiles = req.files?.["images"];


    // Multer throws a file size error
    if (req.fileValidationError) {
      throw new apiError({ statusCode: 400, message: req.fileValidationError });
    }

    if (!avatarFiles || avatarFiles.length === 0) {
      throw new apiError({ statusCode: 400, message: "Avatar not found" });
    }
    if (!imagesFiles || imagesFiles.length === 0) {
      throw new apiError({ statusCode: 400, message: "Images not found" });
    }

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
const existingFacilities = sellerData?.facilities || [];
const newFacilities = Array.isArray(facilities) ? facilities : [facilities];

// Merge and remove duplicates
const updatedFacilities = [...new Set([...existingFacilities, ...newFacilities])].filter(Boolean);


    // Create the new post
    const newPost = new Post({
      postBy: managerId,
      managerFullName: manager.fullName,
      managerAddress: manager.address,
      sellerId: sellerId || null,
      propertyTitle: propertyTitle || sellerData.propertyTitle,
      fullName: fullName || sellerData.fullName,
      sellerNumber: mobileNumber || sellerData.mobileNumber,
      landLocation: landLocation || sellerData.landLocation,
      landCity: landCity || sellerData.landCity,
      landAddress: landAddress || sellerData.landAddress,
      landType: landType || sellerData.landType,
      landCatagory: landCategory || sellerData.landCategory,
      area: area,
      avatar: avatarLinks,
      images: imagesLinks,
      facilities: updatedFacilities.length > 0 ? updatedFacilities : sellerData?.facilities || [],
      price: price,
      isNegotiable: isNegotiable,
      purpose: purpose,
      videoLink: videoLink,
      featured: featured,
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
      if (!updateData || typeof updateData !== "object" || Object.keys(updateData).length === 0) {
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
const postDelete = async(managerId,postId)=>{
  try {
    if (!managerId || !postId) {
      throw new apiError({
        statusCode: 400,
        message: "managerId or PostId not found"
      })
    };

    const manager = await Manager.findById(managerId);
    console.log("manager",manager);
    
    if (!manager) {
      throw new apiError({
        statusCode: 400,
        message:"manager not found"
      })
    };
    const post = await Post.findOneAndDelete({ _id: postId, postBy: manager._id });
    if (!post) {
      throw new apiError({
        statusCode: 400,
        message:"invalid post deletion"
      })
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
}




export { managerpost,editPost, postDelete };


