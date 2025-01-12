import { Post } from "../../../models/manager.post.model.js";
import { User } from "../../../models/user.model.js";
import { Buyproperty } from "../../../models/buy.property.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const userPurchase = async (userId, postId, mobileNumber) => {
  try {
    //validate user id
    if (!userId) {
      throw new apiError({
        statusCode: 400,
        message: "user Id not found",
      });
    }
    const user = await User.findById(userId);
  //validat user
    if (!user) {
      throw new apiError({
        statusCode: 404,
        message: "user not exist",
      });
    }

  
    if (!postId) {
      throw new apiError({
        statusCode: 400,
        message: "post not exist",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new apiError({
        statusCode: 404,
        message: "post not exist",
      });
    }
 
    

      // Check if the user has already requested this post
      const existingRequestCount = await Buyproperty.countDocuments({
        sendBy: userId,
        postId: postId
      });
  
      if (existingRequestCount > 0) {
        throw new apiError({
          statusCode: 400,
          message: "You have already requested this post"
        });
      }


    const newRequest = new Buyproperty({
      sendBy: userId,
      fullName: user.fullName,
      currentNumber: mobileNumber,
      postId: postId,
      managerId:post.postBy
    });

    await newRequest.save();

    return newRequest;
  } catch (error) {
    throw error;
  }
};

export { userPurchase };
