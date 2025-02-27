import { utils } from "../../../utils/index.js";
const { apiError } = utils;
import { Post } from "../../../models/manager.post.model.js";
//get property by category
const getCategoryProperty = async(filters,projections,options) =>{
    try {
        const data = await getProperty(filters,projections,options);
        return data;
    } catch (error) {
        throw error;
    }
};

//get property by type
const getPropertyType = async(filters,projections,options) =>{
    try {
        const data = await getProperty(filters,projections,options);
        return data;
    } catch (error) {
        throw error;
    }
};


//get property
async function getProperty(filters,projections,options) {
    try {
          // vallidate
          if (typeof filters !== "object" || typeof projections !== "object" || typeof options !== "object") {
            throw new apiError({
                statusCode: 400,
                message: "Invalid filters, projections, or options. They must be ob1jects."
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
        const commercial = await Post.countDocuments({landType:"commercial"});
        const residential = await Post.countDocuments({landType:"residential"});
        const land = await Post.countDocuments({landCategory:"land"});
        const house = await Post.countDocuments({landCategory:"house"});
        const apartment = await Post.countDocuments({landCategory:"apartment"});
        const flat = await Post.countDocuments({landCategory:"flat"});

        const response = {
            commercial :commercial != null ? commercial : "post unavailabel",
            residential :residential != null ? residential : "post unavailabel",
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

export { getCategoryProperty,getPropertyType,categotyDataCount}