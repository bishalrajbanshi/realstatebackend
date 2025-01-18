import { Enquertproperty } from "../../../models/enquery.property.model.js";
import { Manager } from "../../../models/manager.model.js";
import { Sellproperty } from "../../../models/sell.property.model.js";
import { utils } from "../../../utils/index.js";
const{apiError}=utils;

//view total enquery data 
const totalEnqueryForm = async(managerId)=>{
    try {
    const manager = await getManager(managerId);
  const enqueryData = await Enquertproperty.countDocuments({address:manager.address})
  
  return enqueryData;
    } catch (error) {
      throw error;
    }
};

//view total seller from
const totalSellerForm = async(managerId)=>{

    try {
        const manager =await getManager(managerId);
        const sellerData = await Sellproperty.countDocuments({
            landLocation: { $elemMatch: { address: manager.address } },
          });
          
          if (!sellerData) {
            throw new apiError({
                statusCode: 404,
                message:"no data found"
            })
          }
    return sellerData;            
    } catch (error) {
        throw error;
    }
}


async function getManager(managerId) {
    if (!managerId) {
        throw new apiError({
            statusCode: 400,
            message:"no manager id"
        })
    }

    const manager =  await Manager.findById(managerId);
    if (!manager) {
        throw new apiError({
            statusCode:401,
            message: "invalid manager id"
        })
    }
    return manager;
}

  export{ totalEnqueryForm, totalSellerForm }