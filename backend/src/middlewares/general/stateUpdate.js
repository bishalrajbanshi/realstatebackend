import { apiError } from "../../utils/common/apiError.js"; 

const stateUpdate = async(model, state, postId)=>{
    try {
        if (!state) {
          throw new apiError({
            statusCode: 400,
            message: "State is required"
          });
        }
    
        if (!postId) {
          throw new apiError({
            statusCode: 400,
            message: "Post ID is required"
          });
        }
    
        // Find the post using dynamic model
        const post = await model.findById(postId);
        if (!post) {
          throw new apiError({
            statusCode: 404,
            message: "Post not found"
          });
        }
    
        const validStates = ["pending", "approved", "reject"];
        if (!validStates.includes(state)) {
          throw new apiError({
            statusCode: 400,
            message: "Invalid state value. Allowed values are 'pending', 'approved', or 'reject'."
          });
        }

         // Prevent changing state from "approved" to "pending"
         if (post.state === "completed" && state !== "completed") {
          throw new apiError({
              statusCode: 400,
              message: "Once a post is completed, it cannot be changed to any other state."
          });
      }
      
      
    
    
        // Update the state of the post
        const updatedPost = await model.findByIdAndUpdate(postId, { state }, { new: true });
        return updatedPost
    
        next(); 
    
      } catch (error) {
        throw error
      }
}

export { stateUpdate };
