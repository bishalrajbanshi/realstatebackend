import { Sellerfrom } from "../../../models/user.seller.from.model.js";
import { apiError } from "../../../utils/common/apiError.js";

const userSellerData = async (postId) => {
    try {

      if (!postId) {
        throw new apiError({
          statusCode: 401,
          message: "Seller ID not found",
        });
      }
  
      const postData = await Sellerfrom.findById(postId);
      if (!postData) {
        throw new apiError({
          statusCode: 404,
          message: "Seller ID is invalid",
        });
      }
  
      return postData;
    } catch (error) {
      throw error; // Propagate the error to be handled in managerPosts
    }
  };
  

export { userSellerData }