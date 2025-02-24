import { Post } from "../../models/manager.post.model.js";

function generatePropertyId(Schema) {
    Schema.pre("save", async function (next) {
        if (!this.propertyId) {
            try {
                // Get the last document with the highest propertyId
                const lastProperty = await Post.findOne().sort({ propertyId: -1 }).select('propertyId');

                // If lastProperty exists, set the propertyId to lastProperty.propertyId + 1, else set it to 100
                this.propertyId = lastProperty && lastProperty.propertyId ? lastProperty.propertyId + 1 : 100;

                next(); // Proceed to save
            } catch (error) {
                next(error);
            }
        } else {
            next(); // Proceed if propertyId is already set
        }
    });
}
export { generatePropertyId }