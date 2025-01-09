import { Manager } from "../../../models/manager.model.js";
import { Sellerfrom } from "../../../models/user.seller.from.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const sellerUser =  async(
    filters={},
    projection= {},
    options ={},
    managerId
) => {
    
    try {
            //validate manager
            if (!managerId) {
                throw new apiError({
                    statusCode: 400,
                    message: "manager Id"
                })
            }

            const manager = await Manager.findById(managerId);

            //validate 
            if (!manager) {
                throw new apiError({
                    statusCode: 404,
                    message: "Manager not found"
                })
            }

            //combbine filters 
            const combinedFiltersData = { ...filters, "landLocation.address": manager.address };

            //fetch data
            const userSellerData = await Sellerfrom.find(combinedFiltersData,projection,options);
            return userSellerData;
    } catch (error) {
        throw error;
    }
    

}

export { sellerUser }


