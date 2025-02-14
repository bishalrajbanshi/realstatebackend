import { User } from "../../../models/user.model.js";
import { Sellproperty } from "../../../models/sell.property.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;


//userseller property
const sellerFormByUser = async function (sellerData, userId) {
 try {
     const { mobileNumber,propertyTitle,landLocation,landCity,landAddress , landType, landCategory, facilities = [], discription } =
       sellerData;

     //validate fields
     if (
        [propertyTitle, landLocation, landType, landCategory,landCity,landAddress, discription].some(
          (field) => typeof field !== "string" || !field.trim()
        ) ||
        !facilities.length ||
        facilities.some((facility) => typeof facility !== "string" || !facility.trim())
      ) {
        throw new apiError({
          statusCode: 400,
          message: "All fields are required and must be non-empty strings",
        });
      }

      //validate
      if (!userId) {
        throw new apiError({
          statusCode: 400,
          message: `Invalid user Id`
        })
      }
      
     //fetch the user
     const user = await User.findById(userId);
     if (!user) {
       throw new apiError({
         statusCode: 404,
         message: "user not found",
       });
     }
   
     const newSellerForm = new Sellproperty({
       fullName: user.fullName,
       mobileNumber: mobileNumber || user.mobileNumber,
       propertyTitle,
       landLocation, //province 1
       landCity,
       landAddress,
       landCategory,
       landType,
       facilities,
       discription,
       sendBy: user
     });
     await newSellerForm.save();
     return newSellerForm;
 } catch (error) {
    throw error
 }
};

//get seller property
const getSellerData = async (userId) => {
  try {
    //validate user id
    if (!userId) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid user access",
      });
    }

    //find the user 
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError({
            statusCode: 400,
            message:"Invalid user"
        })
    }
  
    // find  id
    const allEnqueryData = await Sellproperty.find({sendBy:user._id})

    if (!allEnqueryData) {
        throw new apiError({
            statusCode: 404,
            message: "no data found"
        })
    }
    return allEnqueryData;
  } catch (error) {
    throw error;
  }
};


//delet enquery property
 const deleteSellerfrom = async(userId,sellerId)=>{
  try {
if (!userId) {
  throw new apiError({
    statusCode: 400,
    message: "no user id"
  })
};

const user = await User.findById(userId);
if (!user) {
  throw new apiError({
    statusCode: 400,
    message:"invalid user"
  })
}
    if (!sellerId) {
      throw new apiError({
        statusCode:400,
        message:"no seller id"
      })
    }

    //find enquery data
    const enqueryData = await Sellproperty.findByIdAndDelete({userId,_id:sellerId});

    if (!enqueryData) {
      throw new apiError({
        statusCode: 400,
        message: "no data found"
      })
    }

    return enqueryData;
  } catch (error) {
    throw error;
  }
 }


export { sellerFormByUser,getSellerData,deleteSellerfrom }
