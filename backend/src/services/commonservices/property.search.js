import { Post } from "../../models/manager.post.model.js";
import { utils } from "../../utils/index.js";
const { apiError } = utils;

export const searchProperty = async (searchQuery) => {
    try {
        console.log("Received searchQuery:", searchQuery); 

        // Convert searchQuery to a number
        const propertyId = Number(searchQuery); 

        console.log("Converted propertyId:", propertyId);

        // Validate if it's a valid number
        if (isNaN(propertyId)) {
            throw new apiError({
                statusCode: 401,
                message: "Invalid Property ID format. It must be a number."
            });
        }

         // Fetch properties with IDs greater than or equal to the searched propertyId
         const properties = await Post.find({ propertyId: { $gte: propertyId } }).sort({ propertyId: 1 });

        if (!properties) {
            throw new apiError({
                statusCode: 402,
                message: "No properties found with this ID."
            });
        }

        return properties;

    } catch (error) {
        throw error;
    }
};
