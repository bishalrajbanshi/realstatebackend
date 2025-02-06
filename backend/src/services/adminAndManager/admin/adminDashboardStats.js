import { Admin } from "../../../models/admin.model.js"
import { Buyproperty } from "../../../models/buy.property.model.js";
import { Enquertproperty } from "../../../models/enquery.property.model.js";
import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { Sellproperty } from "../../../models/sell.property.model.js";
import { User } from "../../../models/user.model.js";
import { apiError } from "../../../utils/common/apiError.js"

//total users
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

//admin stats
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

        return responseData ;

    } catch (error) {
        throw error;
    }
}

//total-seller total-enquery total-buyer total-posts
const statsPieChart = async(adminId) => {
    try {
        if (!adminId) {
            throw new apiError({
                statusCode: 401,
                message:"undefined admin id"
            })
        };

        //exist or not admin
        const existingAdmin = await Admin.findById(adminId);
        if (!existingAdmin) {
            throw new apiError({
                statusCode:401,
                message:"Invalid admin"
            })
        };

        const totalSellerForm = await Sellproperty.countDocuments().catch(() => null)
        const totalBuyerForm =  await Buyproperty.countDocuments().catch(()=> null);
        const totalEnqueryForm = await Enquertproperty.countDocuments().catch(()=>null);
        const totalPost = await Post.countDocuments().catch(()=> null);

        const response = {
            totalSellerForm: totalSellerForm !=null ? totalSellerForm: "Seller forn unavailable",
            totalBuyerForm:totalBuyerForm !=null ? totalBuyerForm: "Buyer form unavailable",
            totalEnqueryForm:totalEnqueryForm !=null ? totalEnqueryForm: "Enquery form unavailable",
            totalPost:totalPost !=null ? totalPost: "Post unavailable",
        }
        return response;

    } catch (error) {
        throw error
    }
}

export { totalUsers,adminStats,statsPieChart }