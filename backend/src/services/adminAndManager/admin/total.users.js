import { Admin } from "../../../models/admin.model.js"
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

export { totalUsers }