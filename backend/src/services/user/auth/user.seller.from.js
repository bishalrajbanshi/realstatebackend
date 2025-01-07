import { User } from "../../../models/user.model.js";
import { Sellerfrom } from "../../../models/user.seller.from.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const sellerFormByUser = async function (sellerData, userId) {
 try {
     const { landLocation = [], landType, landCategory, facilities = [], discription } =
       sellerData;

       if (landLocation.length > 0) {
            const { address, city, area } =landLocation[0];
       }
   
     //validate fields
     if (
        !landLocation.length ||
        [landType, landCategory, discription].some(
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

      
     //fetch the user
     const user = await User.findById(userId);
     if (!user) {
       throw new apiError({
         statusCode: 404,
         message: "user not found",
       });
     }
   
     const newSellerForm = new Sellerfrom({
       fullName: user.fullName,
       mobileNumber: user.mobileNumber,
       landLocation,
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

export { sellerFormByUser }
