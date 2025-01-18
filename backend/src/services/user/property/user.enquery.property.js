import { Enquertproperty } from "../../../models/enquery.property.model.js";
import { User } from "../../../models/user.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

//send enquery property
const userEnqueryForm = async (userEnqueryData, userId) => {
  try {
    //destructure
    const { address, propertyType, purpose, mobileNumber, message } =
      userEnqueryData;

    if (!address || !propertyType || !purpose || !mobileNumber) {
      throw new apiError({
        statusCode: 400,
        message: "All Fields are required",
      });
    }

    // Fetch user details
    const user = await User.findById(userId);

    if (!user) {
      throw new apiError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const newEnqueryForm = new Enquertproperty({
      fullName: user.fullName,
      email: user.email,
      currentAddress: user.currentAddress,
      address,
      propertyType,
      purpose,
      mobileNumber,
      message,
      sendBy:user
    });
    await newEnqueryForm.save();
  } catch (error) {
    throw error;
  }
};

//enquery property
const viewEnqueryProperty = async (userId) => {
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
  
    // find the enquery data if userid match with enquery form sendBy id
    const allEnqueryData = await Enquertproperty.find({sendBy:user._id})

    if (!allEnqueryData) {
        throw new apiError({
            statusCode: 404,
            message: "nodata found"
        })
    }
    return allEnqueryData;
  } catch (error) {
    throw error;
  }
};

//delet enquery property
 const deleteEnqueyProperty = async(userId,enqueryId)=>{
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
    if (!enqueryId) {
      throw new apiError({
        statusCode:400,
        message:"no property id"
      })
    }

    //find enquery data
    const enqueryData = await Enquertproperty.findByIdAndDelete({userId,_id:enqueryId});

    if (!enqueryData) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid enquery Id"
      })
    }

    return enqueryData;
  } catch (error) {
    throw error;
  }
 }

export { userEnqueryForm, viewEnqueryProperty, deleteEnqueyProperty };
