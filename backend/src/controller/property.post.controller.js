import { utils } from "../utils/index.js";
const {
  apiError,
  apiResponse,
  asyncHandler,
  getProjection,
  getOptions,
  getProjectionData,
} = utils;
import { services } from "../services/index.js";
const {
  viewFeaturedPosts,
  viewPosts,
  viewProperty,
  categotyDataCount,
  getCategoryProperty,
  getPropertyType,
  propertyViews,
  propertyViewCountData,
} = services;

//view featured post in users
const viewFeaturedPostData = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const filters = { featured: "featured" };
    const projections = getProjection();
    const options = getOptions(page);

    const data = await viewFeaturedPosts(filters, projections, options);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting featured posts",
      })
    );
  }
});

//fetch all post
const fetchAllPosts = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const filters = {};
    const projections = getProjection();
    const options = getOptions(page);

    const data = await viewPosts(filters, projections, options);
    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error fetching post data",
      })
    );
  }
});

//view post details
const viewPropertyDetails = asyncHandler(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1 } = req.query;
    const filters = {};
    const projections = getProjectionData();
    const options = getOptions(page);

    const propertyData = await viewProperty(
      postId,
      filters,
      projections,
      options
    );
    if (!propertyData || propertyData.length === 0) {
      return res.status(404).json({
        success: false,
        message: `NO PROPERTY FOUND`,
      });
    }

    res.status(200).json(
      new apiResponse({
        success: true,
        data: propertyData,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting property",
      })
    );
  }
});

//property view
const propertyView = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const ipAddress = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0] 
    : req.connection.remoteAddress || req.ip; 
    const data = await propertyViews(userId, postId, ipAddress);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error property count",
      })
    );
  }
});

const propertyViewCount = asyncHandler(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const data = await propertyViewCountData(postId);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: error.statusCode || 500,
        message: error.message || "error counting",
      })
    );
  }
});

//view category property
const viewPropertyCategory = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { category } = req.params;
    const filters = { landCategory: category };
    const projections = getProjection();
    const options = getOptions(page);
    const data = await getCategoryProperty(filters, projections, options);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting commercial property",
      })
    );
  }
});

//view by type
const viewPropertyType = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { type } = req.params;
    console.log(type);
    const filters = { landType: type };
    const projections = getProjection();
    const options = getOptions(page);
    const data = await getPropertyType(filters, projections, options);

    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting property",
      })
    );
  }
});

//view stats of propertycategory
const viewCategoryStats = asyncHandler(async (req, res, next) => {
  try {
    const data = await categotyDataCount();
    res.status(200).json(
      new apiResponse({
        success: true,
        data: data,
      })
    );
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting property",
      })
    );
  }
});



export {
  viewFeaturedPostData,
  fetchAllPosts,
  viewPropertyDetails,
  viewCategoryStats,
  viewPropertyCategory,
  viewPropertyType,
  propertyView,
  propertyViewCount,
};
