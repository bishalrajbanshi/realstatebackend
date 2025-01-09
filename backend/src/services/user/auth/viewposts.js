import { Managerpost } from "../../../models/manager.post.model.js"
import { apiError } from "../../../utils/common/apiError.js"

const viewPosts = async() =>{
    try {
        //all posts fetch
        const allPost = await Managerpost.find();

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
export { viewPosts }