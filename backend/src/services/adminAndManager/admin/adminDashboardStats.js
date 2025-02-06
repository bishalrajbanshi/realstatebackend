import { Admin } from "../../../models/admin.model.js"
import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { User } from "../../../models/user.model.js";
import { apiError } from "../../../utils/common/apiError.js"

const totalUsers = async (adminId,filters,projection,options) => {
    try {
        //validate admin id 
        if (!adminId) {
            throw new apiError({
                statusCode:400,
                message:"invalid admin id"
            })
        };

        //find admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new apiError({
                statusCode:400,
                message:"admin not found"
            })
        };
        const users = await User.find(filters, projection, options);
        if (!users || users.length === 0) {
            throw new apiError({
                statusCode: 404,
                message: "No users found"
            });
        }

        return users;

    } catch (error) {
        throw error
    }
}

//total number of users
const adminStats = async (adminId) => {
    try {
        //validate admin id
        if (!adminId) {
            throw new apiError({
                statusCode: 400,
                message: "undefined admin"
            })
        };

        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new apiError({
                statusCode:401,
                message:"invalid admin"
            })
        };

        const totalUsers = await User.countDocuments().catch(()=>null);
        const totalManagers = await Manager.countDocuments().catch(()=>null);
        const totalPosts = await Post.countDocuments().catch(()=>null);

        const responseData = {
            totalUsers: totalUsers !== null ? totalUsers : "User data not found",
            totalManagers: totalManagers !== null ? totalManagers : "Manager data not found",
            totalPosts: totalPosts !== null ? totalPosts : "Post data not found"
        };

        return {responseData };

    } catch (error) {
        throw error;
    }
}

export { totalUsers,adminStats }