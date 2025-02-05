import { Manager } from "../../../models/manager.model.js"
import { utils } from "../../../utils/index.js";
const {
    apiError,
    generateAccessToken,
    generateRefreshToken
} = utils;

const managerDetails = async(managerId) =>{
    try {
        //validate manager id
        console.log("manager ID",managerId);
        
        if (!managerId) {
            throw new apiError({
                statusCode: 400,
                message: "Invalid adminId"
            })
        };

        const manager = await Manager.findById(managerId).select(
            "fullName email role mobileNumber avatar accessToken refreshToken"
        );


        //validate manager
        if (!manager) {
          throw new apiError({
            statusCode: 400,
            message: "Invalid manager"
          })
        }
        return manager;
    } catch (error) {
        throw error
    }
}

export { managerDetails };