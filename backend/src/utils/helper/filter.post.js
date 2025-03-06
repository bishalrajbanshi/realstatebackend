
//post projections
const getProjection = () => {
  return {
    propertyId:1,
    avatar: 1,
    propertyTitle: 1,
    facilities:1,
    description: 1,
    facing:1,
    province:1,
    landCategory:1,
    landAddress:1,
    isNegotiable:1,
    propertyOverView:1,
    purpose:1,
    landType: 1,
    featured: 1,
    price: 1,
    area: 1,
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
    propertyId:1,
    facebookVideoLink:1,
    youtubeVideoLink:1,
    propertyTitle: 1,
    landCategory:1,
    facing:1,
    province:1,
    landAddress:1,
    landType: 1,
    area: 1,
    facilities:1,
    price: 1,
    isNegotiable:1,
    purpose:1,
    featured: 1,
    description: 1,
    createdAt:1
  }
}

//buyer form projections
const buyerFromProjection = ()=> {
  return {
    fullName: 1,
    mobileNumber: 1,
    postId:1,
    state: 1,
  }
}

//seller from projections
const sellerFormProjections = () => {
  return {
    homeName: 1,
    fullName: 1,
    mobileNumber: 1,
    state: 1,
    discription: 1
  }
}

//enquery from projections
const enqueryFromProjections = () =>{
  return {
    fullName: 1,
    mobileNumber: 1,
    currentAddress: 1,
    state: 1,
  }
}

export { getProjection , getOptions, getProjectionData,buyerFromProjection,sellerFormProjections,enqueryFromProjections }
