
import { Sellerfrom } from "../../../models/user.seller.from.model.js";
import { utils } from "../../../utils/index.js"
const {apiError} =utils;

const viewSellerData = async(sellerId)=>{
    try {
        //validate sellerId
        if (!sellerId) {
            throw new apiError({
                statusCode: 400,
                message: "invalid seller id"
            })
        };

        //seller form data
        const sellerData = await Sellerfrom.findById(sellerId);
        if (!sellerData) {
            throw new apiError({
                statusCode: 404,
                message: "seller not found"
            })
        };

        return sellerData;

    } catch (error) {
        throw error;
    }
}

export { viewSellerData }