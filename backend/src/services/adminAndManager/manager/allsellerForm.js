import { Manager } from "../../../models/manager.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const sellerFormByUser =  async(
    filters={},
    projection= null,
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

    } catch (error) {
        
    }
    

}

export { sellerFormByUser }


