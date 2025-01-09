import { Manager } from "../../../models/manager.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

//display manager
const allManagers = async (filters = {}, projection = null, options = {}) =>{
    try {
        const managers = await Manager.find(filters, projection, options);
        return managers;
    } catch (error) {
        throw error;
    }
};

//delete managers
const deleteManager = async(managerId) => {
    try {
        // Find and delete manager by ID
        const manager = await Manager.findByIdAndDelete(managerId);

        if (!manager) {
            throw new apiError({
                statusCode: 400,
                message: "Manager not found"
            });
        }

        return { success: true, message: "Manager deleted successfully" };
    } catch (error) {
        throw error;
    }
};
export { deleteManager }


    


export { allManagers }