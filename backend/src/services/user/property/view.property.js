import { Post } from "../../../models/manager.post.model.js"
import { apiError } from "../../../utils/common/apiError.js"

const viewPosts = async(
    filters={},
    projection={},
    options={}
) =>{
    try {
        //all posts fetch
        const allPost = await Post.find(filters,projection,options);

        if (!allPost || allPost.length === 0) {
           throw new apiError({
            statusCode: 404,
            message: "No posts found",
           })
        }

       
        return allPost;
    } catch (error) {
        throw error;
    }
}

const viewProperty = async (postId, filters = {}, projection = {}, options = {}) => {
    try {
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
  
export { viewPosts,viewProperty }