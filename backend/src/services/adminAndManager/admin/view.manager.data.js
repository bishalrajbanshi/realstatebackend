import { Admin } from "../../../models/admin.model.js";
import { Buyproperty } from "../../../models/buy.property.model.js";
import { Enquertproperty } from "../../../models/enquery.property.model.js";
import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { Sellproperty } from "../../../models/sell.property.model.js";
import { utils } from "../../../utils/index.js";
const { apiError} = utils;

async function checkIds(adminId,managerId) {
    if (!adminId || !managerId) {
        throw new apiError({
            statusCode: 401,
            message:"unknown access"
        })
    };
    const admin = await Admin.findById(adminId); 
    if (!admin) {
        throw new apiError({
            statusCode: 402,
            message: "admin not found"
        })
    };
    const manager = await Manager.findById(managerId);
    if (!manager) {
        throw new apiError({
            statusCode: 402,
            message:"unknown manager"
        })
    }

    return {admin,manager}
}

const viewManagerData = async(adminId,managerId) => {
     try {
        //validation  ids
      const {admin,manager} = await checkIds(adminId,managerId);

        //total post by manager 
        const totalPostbymanager = await Post.countDocuments({
            postBy:manager._id}).catch(() => null);
        //total buyer from
        const totalBuyerForms = await Buyproperty.countDocuments({
            managerId:manager._id
        }).catch(() => null);
        const totalEnqueryForms = await Enquertproperty.countDocuments({
            address:manager.address
        }).catch(() => null);
        const totalSellerForms = await Sellproperty.countDocuments({
            "landLocation.address":manager.address
        }).catch(() => null);
    
const response = {
    totalPostbymanager: totalPostbymanager  != null ? totalPostbymanager : "Post unavailable",
    totalBuyerForms: totalBuyerForms  != null ? totalBuyerForms : "Buyer from unavailable",
    totalEnqueryForms: totalEnqueryForms  != null ? totalEnqueryForms : "Enquery form unavailable",
    totalSellerForms: totalSellerForms  != null ? totalSellerForms : "Seller from unavailable",
}

return response;


     } catch (error) {
        throw error;
     }
};



const viewManagerPost = async(adminId,managerId,filters,projection,options) =>{
    try {
        //validate id
      const {admin,manager} = await checkIds(adminId,managerId);

      //view manager posted post
      const managerPosts = await Post.find(filters,projection,options);
      if (!managerPosts) {
        throw new apiError({
            statusCode: 401,
            message:"post unavailable"
        })
      }

      return managerPosts

    } catch (error) {
        throw error
    }
}

export { viewManagerData,viewManagerPost}