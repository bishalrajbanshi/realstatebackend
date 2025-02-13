import { utils } from "../utils/index.js";
const { apiError, apiResponse, asyncHandler, getProjection, getOptions,getProjectionData } =
  utils;
import { services } from "../services/index.js";
const { viewFeaturedPosts,viewPosts,viewProperty,commercialProperty,residentialProperty,apartment,flat,house,land,categotyDataCount } = services;


//view featured post in users
const viewFeaturedPostData = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const filters = { featured:"featured"}
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
        const { page =1 } = req.query;
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


// display property by caltgory
const viewCommercialProperty = asyncHandler( async(req,res,next) => {
  try {
    const { page = 1} = req.query;
    const filters = { landType:"Commercial"};
    const projections = getProjection();
    const options = getOptions(page)
    const data = await commercialProperty(filters,projections,options);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting commercial property",
      })
    );
  }
})


const viewResidentialProperty = asyncHandler( async(req,res,next) => {
  try {
    const { page = 1} = req.query;
    const filters = { landType:"Residential"};
    const projections = getProjection();
    const options = getOptions(page)
    const data = await residentialProperty(filters,projections,options);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting commercial property",
      })
    );
  }
})


const viewLand = asyncHandler( async(req,res,next) => {
  try {
    const { page = 1} = req.query;
    const filters = { landCategory:"Land"};
    const projections = getProjection();
    const options = getOptions(page)
    const data = await land(filters,projections,options);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting commercial property",
      })
    );
  }
})


const viewHouse = asyncHandler( async(req,res,next) => {
  try {
    const { page = 1} = req.query;
    const filters = { landCategory:"House"};
    const projections = getProjection();
    const options = getOptions(page)
    const data = await house(filters,projections,options);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting commercial property",
      })
    );
  }
})

const viewApartment = asyncHandler( async(req,res,next) => {
  try {
    const { page = 1} = req.query;
    const filters = { landCategory:"Apartment"};
    const projections = getProjection();
    const options = getOptions(page)
    const data = await apartment(filters,projections,options);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting commercial property",
      })
    );
  }
})


const viewFlat = asyncHandler( async(req,res,next) => {
  try {
    const { page = 1} = req.query;
    const filters = { landCategory:"Flat"};
    const projections = getProjection();
    const options = getOptions(page)
    const data = await flat(filters,projections,options);

    res.status(200)
    .json(new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting commercial property",
      })
    );
  }
});



//view stats of propertycategory
const viewCategoryStats = asyncHandler(async(req,res,next) => {
  try {
    const data = await categotyDataCount();
    res.status(200)
    .json( new apiResponse({
      success: true,
      data:data
    }))
  } catch (error) {
    return next(
      new apiError({
        statusCode: 500,
        message: error.message || "error getting property",
      })
    );
  }
})

export { viewFeaturedPostData, fetchAllPosts,viewPropertyDetails,viewCommercialProperty,viewResidentialProperty,viewHouse,viewLand,viewApartment,viewFlat,viewCategoryStats };
