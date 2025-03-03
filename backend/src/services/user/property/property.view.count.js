import { Post } from "../../../models/manager.post.model.js";
import { View } from "../../../models/property.view.js";
import { User } from "../../../models/user.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;
//property view
const propertyViews = async (userId, postId, ipAddress) => {
    try {
      // Validate if required fields are missing
      if (!userId || !postId || !ipAddress) {
        throw new apiError({
          statusCode: 401,
          message: "Invalid fields",
        });
      }
  
      // Validate userId and postId
      const user = await User.findById(userId);
      const post = await Post.findById(postId);
  
      // Check if user and post exist
      if (!user || !post) {
        throw new apiError({
          statusCode: 404,
          message: "User or Post not found",
        });
      }
  
      // Check if the user/IP has already viewed this post
      const existingView = await View.findOne({ postId,userId });
  
      if (existingView) {
        // If this IP has already viewed the post, return an error
        throw new apiError({
          statusCode: 400,
          message: "View already counted for this IP",
        });
      }
  
      // Create a new view entry for this user/IP
      const newView = new View({
        postId: postId,
        userId: user._id,
        ipAddress: ipAddress,
      });
  
      // Save the new view entry
      await newView.save();
  
      // Increment the view count for the post
      await Post.findByIdAndUpdate(postId, { $inc: { viewCount: 1 } });
  
      // Return success response with new view
      return newView;
    } catch (error) {
      throw error;
    }
};
  
//property view count
const propertyViewCountData = async (postId) => {
    try {
      // Validate postId
      if (!postId) {
        throw new apiError({
          statusCode: 401,
          message: "postId not found"
        });
      }
  
      // Count the number of views for the specific postId
      const postCount = await View.countDocuments({ postId });
  
  
      // Return the view count for the post
      return postCount;
  
    } catch (error) {
      throw error;
    }
};
  

export { propertyViews,propertyViewCountData }