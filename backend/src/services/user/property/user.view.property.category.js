import { utils } from "../../../utils/index.js";
const { apiError } = utils;
import { Post } from "../../../models/manager.post.model.js";

//commercial property
const commercialProperty = async(filters,projections,options) => {
    try {
        const data = await getProperty(filters,projections,options);
        return data;
    } catch (error) {
        throw error;
    }
}
//residential property
const residentialProperty = async(filters,projections,options) => {
    try {
        const data = await getProperty(filters,projections,options);
        return data;
    } catch (error) {
        throw error;
    }
}
// land
const land = async(filters,projections,options) => {
    try {
        const data = await getProperty(filters,projections,options);
        return data;
    } catch (error) {
        throw error;
    }
}
// house
const house = async(filters,projections,options) => {
    try {
        const data = await getProperty(filters,projections,options);
        return data;
    } catch (error) {
        throw error;
    }
}
// house
const apartment = async(filters,projections,options) => {
    try {
        const data = await getProperty(filters,projections,options);
        return data;
    } catch (error) {
        throw error;
    }
}
// house
const flat = async(filters,projections,options) => {
    try {
        const data = await getProperty(filters,projections,options);
        return data;
    } catch (error) {
        throw error;
    }
}


//get property
async function getProperty(filters,projections,options) {
    try {
          // vallidate
          if (typeof filters !== "object" || typeof projections !== "object" || typeof options !== "object") {
            throw new apiError({
                statusCode: 400,
                message: "Invalid filters, projections, or options. They must be objects."
            });
        }
        const property =  await Post.find(filters,projections,options);
        if (property.length === 0) {
            throw new apiError({
                statusCode: 404,
                message: "No  posts found."
            });
        }

        return property;
    } catch (error) {
     throw error;   
    }
}

export { commercialProperty,residentialProperty,house,apartment,flat,land }