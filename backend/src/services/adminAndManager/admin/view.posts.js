import { Admin } from "../../../models/admin.model.js"
import { Post } from "../../../models/manager.post.model.js";
import { apiError } from "../../../utils/common/apiError.js"

const viewPostData = async(adminId,filters,projection,options) => {
    try {
        //validate admin id
            if (!adminId) {
                throw new apiError({
                    statusCode:401,
                    message:"admin id undefined"
                })
            }

            // find adminId
            const admin = await Admin.findById(adminId);

            //validate exist admin
            if (!admin) {
                throw new apiError({
                    statusCode:401,
                    message:"invalid admin"
                })
            }

            const viewPosts = await Post.find(filters,projection,options);
            if (!viewPosts || viewPosts.length === 0) {
                throw new apiError({
                    statusCode: 404,
                    message: "No viewPosts found"
                });
            }
            return viewPosts;

    } catch (error) {
        throw error;
    }

}

export { viewPostData }