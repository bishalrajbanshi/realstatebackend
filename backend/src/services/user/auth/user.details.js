import { User } from "../../../models/user.model.js";
import { utils } from "../../../utils/index.js";
const{apiError} = utils;

const  userDetails = async (userId)=>{
    try {
        if (!userId) {
            throw new apiError({
                statusCode: 400,
                message: "Invalid User Id"
            })
        }
        const user = await User.findById(userId).select( 
            "fullName email mobileNumber currentAddress refreshToken accessToken"
        );
        if (!user) {
            throw new apiError({
                statusCode: 404,
                message: "User not found",
            });
        }

        return user;
    } catch (error) {
        throw error;
    }
}

export { userDetails }