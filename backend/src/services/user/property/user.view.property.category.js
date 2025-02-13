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

// view categoty data count
const categotyDataCount = async()=> {
    try {
        const commercialProperty = await Post.countDocuments({landType:"Commercial"});
        const residentialProperty = await Post.countDocuments({landType:"Residential"});
        const land = await Post.countDocuments({landCategory:"Land"});
        const house = await Post.countDocuments({landCategory:"House"});
        const apartment = await Post.countDocuments({landCategory:"Apartment"});
        const flat = await Post.countDocuments({landCategory:"Flat"});

        const response = {
            commercialProperty :commercialProperty != null ? commercialProperty : "post unavailabel",
            residentialProperty :residentialProperty != null ? residentialProperty : "post unavailabel",
            land :land != null ? land : "post unavailabel",
            house :house != null ? house : "post unavailabel",
            apartment :apartment != null ? apartment : "post unavailabel",
            flat :flat != null ? flat : "post unavailabel"
        }

        return response;
    } catch (error) {
        throw error
    }
}

export { commercialProperty,residentialProperty,house,apartment,flat,land ,categotyDataCount}