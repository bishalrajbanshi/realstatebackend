import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

//display manager
const allManagers = async (filters = {}, projection = null, options = {}) =>{
    try {
        const managers = await Manager.find(filters, projection, options);
        return managers;
    } catch (error) {
        throw error;
    }
};

//delete managers
const deleteManager = async(managerId) => {
    try {
        // Find and delete manager by ID
        const manager = await Manager.findByIdAndDelete(managerId);

        if (!manager) {
            throw new apiError({
                statusCode: 400,
                message: "Manager not found"
            });
        }

        return { success: true, message: "Manager deleted successfully" };
    } catch (error) {
        throw error;
    }
};

//total post 
// const totalPosts = async(adminId,filters ={},projection={},options={})=>{
// try {
//     if (!adminId) {
//         throw new apiError({
//             statusCode:400,
//             message:"invalid admin id"
//         })
//     };

//     const posts = await Post.find(filters,projection,options);

//     console.log("posts",posts);
    
// return posts;
// } catch (error) {
//     throw error
// }
// };



// total post by manager
const postByManager = async(adminId,managerId)=>{

    try {

        if (!managerId) {
            throw new apiError({
                statusCode:401,
                message:"manager is messing"
            })
        }
        if (!adminId) {
            throw new apiError({
                statusCode:401,
                message:"admin is messing"
            })
        }
        if (!managerId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new apiError({
              statusCode: 400,
              message: "Invalid Manager ID format",
            });
          }
      
        //find manager
        const manager = await Manager.findById(managerId);
        if (!manager) {
            throw new apiError({
                statusCode: 404,
                message:"manager not found"
            })
        }
        const posts = await Post.find({postBy:manager._id})
        console.log("posts",posts);
    return posts
        
    } catch (error) {
        throw error;
    }


}
    
export { allManagers,deleteManager,postByManager }