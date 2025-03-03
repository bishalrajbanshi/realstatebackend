import { Post } from "../../../models/manager.post.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const ALLOWED_FILTERS = ["landCategory", "landType", "facing"];

const sanitizeFilters = (filters) => {
  const sanitized = {};
  for (const key in filters) {
    if (ALLOWED_FILTERS.includes(key)) {
      sanitized[key] = filters[key];
    }
  }
  return sanitized;
};

const searchByFilter = async (filters,projection) => {
  try {
    console.log("Filters received:", filters);
    //find the property
    const senitizedFilter = sanitizeFilters(filters);
    const property = await Post.find(senitizedFilter,projection);
    if (!property.length) {
      throw new apiError({
        statusCode: 404,
        message: "no property found",
      });
    }


    return property;
  } catch (error) {
    throw error;
  }
};

export { searchByFilter };
