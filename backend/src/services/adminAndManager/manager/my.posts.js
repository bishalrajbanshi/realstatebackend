    import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;


//my post 
const myPost = async(managerId,filters,projection,options) => {
    try {
        //validate 
        const manager = await Manager.findById(managerId);
        if (!manager) {
            throw new apiError({
                statusCode:401,
                message:"manager not found"
            })
        };


        //find my post 
        const myPost = await Post.find(filters,projection,options);
        if (!myPost) {
            throw new apiError({
                statusCode:403,
                message:"Not post yet"
            })
        }
        return myPost;
    } catch (error) {
        throw error;
    }
};

// post details
const myPostDetails = async(managerId,postId) => {
    try {
//validate 
const manager = await Manager.findById(managerId);
if (!manager) {
    throw new apiError({
        statusCode:401,
        message:"manager not found"
    })
};
  if (!postId) {
    throw new apiError({
        statusCode:402,
        message:"undefined post id"
    })
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new apiError({
        statusCode:402,
        message:"post not found"
    })
  }

  return post;

    } catch (error) {
       throw error; 
    }
}

export { myPost, myPostDetails }