
//post projections
const getProjection = () => {
  return {
    avatar: 1,
    propertyTitle: 1,
    facilities:1,
    description: 1,
    landCategory:1,
    isNegotiable:1,
    propertyOverView:1,
    amenities:1,
    purpose:1,
    landType: 1,
    featured: 1,
    price: 1,
    area: 1,
    purpose: 1,
  };
};

//options for posts
const getOptions = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return {
    sort: { createdAt: -1 },
    limit,
    skip,
  };
};

//projection fro postdetails
const getProjectionData = () => {
  return {
    images: 1,
    videoLink:1,
    propertyTitle: 1,
    landCategory:1,
    landLocation:1,
    amenities:1,
    landCity:1,
    landAddress:1,
    landType: 1,
    area: 1,
    facilities:1,
    price: 1,
    isNegotiable:1,
    purpose:1,
    featured: 1,
    purpose: 1,
    description: 1,
    createdAt:1
  }
}

export { getProjection , getOptions, getProjectionData }
