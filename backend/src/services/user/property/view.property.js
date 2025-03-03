import { Post } from "../../../models/manager.post.model.js"
import { apiError } from "../../../utils/common/apiError.js"

const viewPosts = async(
    filters,
    projection,
    options
) =>{
    try {
//validate 
if (typeof filters !== "object" || typeof projection !== "object" || typeof options !== "object") {
  throw new apiError({
      statusCode: 400,
      message: "Invalid filters, projections, or options. They must be objects."
  });
}

        //all posts fetch
        const allPost = await Post.find(filters,projection,options);
        const totalproperty = await Post.countDocuments()

        const response = {
          allPost : allPost !=null ? allPost : "post unavailable",
          totalproperty :totalproperty != null ? totalproperty : "unavailabel",
        }
      
        return response;
    } catch (error) {
        throw error;
    }
}

//property details
const viewProperty = async (postId, filters, projection, options) => {
    try {
      if (typeof filters !== "object" || typeof projection !== "object" || typeof options !== "object") {
        throw new apiError({
            statusCode: 400,
            message: "Invalid filters, projections, or options. They must be objects."
        });
    }
      // Validate postId
      if (!postId) {
        throw new apiError({
          statusCode: 400,
          message: "Invalid post ID",
        });
      }
  
      // Find the post by postId
      const post = await Post.findById(postId, projection, options);
  
      // If no post found
      if (!post) {
        throw new apiError({
          statusCode: 404,
          message: "Post not found",
        });
      }
  
      return post;
    } catch (error) {
      throw error;
    }
  };

  //view feature posts
  const viewFeaturedPosts = async(filters,projections,options)=> {
    try {
        //find post according to the filters,projections,options
        const viewFeatured = await Post.find(filters,projections,options);
        if (!viewFeatured) {
          throw new apiError({
            statusCode:401,
            message:"featured post is unavailable"
          })
        }

        return viewFeatured

    } catch (error) {
      throw error;
    }
  }
  
export { viewPosts,viewProperty, viewFeaturedPosts }