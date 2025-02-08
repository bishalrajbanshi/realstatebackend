import { Buyproperty } from "../../../models/buy.property.model.js";
import { Enquertproperty } from "../../../models/enquery.property.model.js";
import { Manager } from "../../../models/manager.model.js";
import { Post } from "../../../models/manager.post.model.js";
import { Sellproperty } from "../../../models/sell.property.model.js";
import { utils } from "../../../utils/index.js";
const{ apiError } = utils;

const viewManagerStats = async (managerId) => {
  try {
    //validate id
    if (!managerId) {
        throw new apiError({
            statusCode:401,
            message:"manager undefined"
        })
    };

    //find manager
    const manager = await Manager.findById(managerId);
    if (!manager) {
        throw new apiError({
            statusCode:401,
            message:"manager not found"
        })
    }

    //total post by manager
    const totalPostByManager = await Post.countDocuments({
      postBy: manager._id,
    }).catch(() => null);
    //total buyer from
    const totalBuyerForms = await Buyproperty.countDocuments({
      managerId: manager._id,
    }).catch(() => null);
    const totalEnqueryForms = await Enquertproperty.countDocuments({
      address: manager.address,
    }).catch(() => null);
    const totalSellerForms = await Sellproperty.countDocuments({
      "landLocation.address": manager.address,
    }).catch(() => null);

    const response = {
      totalPostByManager:
        totalPostByManager != null ? totalPostByManager : "Post unavailable",
      totalBuyerForms:
        totalBuyerForms != null ? totalBuyerForms : "Buyer from unavailable",
      totalEnqueryForms:
        totalEnqueryForms != null
          ? totalEnqueryForms
          : "Enquery form unavailable",
      totalSellerForms:
        totalSellerForms != null ? totalSellerForms : "Seller from unavailable",
    };
    return response;
  } catch (error) {
    throw error;
  }
};

export { viewManagerStats }

