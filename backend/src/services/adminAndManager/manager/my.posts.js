import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

async function checkManager(managerId) {
    const manager = await Manager.findById(managerId);
    if (!manager) {
        throw new apiError({
            statusCode:401,
            message:"manager not found"
        })
    };
}

const myPost = async(managerId,filters,projection,options) => {
    try {
        //validate 
  const validManager =  checkManager(managerId)
  if (!validManager) {
    throw new apiError({
        statusCode:402,
        message:"invalid manager"
    })
  }

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


//post details
const myPostDetails = async(managerId,postId) => {
    try {
//validate 
  const validManager = await checkManager(managerId)
  if (!validManager) {
    throw new apiError({
        statusCode:402,
        message:"invalid manager"
    })
  }
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