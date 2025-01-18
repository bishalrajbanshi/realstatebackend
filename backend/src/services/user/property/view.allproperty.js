// import { Enquertproperty } from "../../../models/enquery.property.model.js";
// import { User } from "../../../models/user.model.js";
// import { utils } from "../../../utils/index.js";
// const { apiError } = utils;

// const viewEnqueryProperty = async (userId) => {
//   try {
//     //validate user id
//     if (!userId) {
//       throw new apiError({
//         statusCode: 400,
//         message: "Invalid user access",
//       });
//     }

//     //find the user 
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new apiError({
//             statusCode: 400,
//             message:"Invalid user"
//         })
//     }
  
//     // find the enquery data if userid match with enquery form sendBy id
//     const allEnqueryData = await Enquertproperty.find({sendBy:user._id})

//     if (!allEnqueryData) {
//         throw new apiError({
//             statusCode: 404,
//             message: "nodata found"
//         })
//     }
//     return allEnqueryData;
//   } catch (error) {
//     throw error;
//   }
// };

// export { viewEnqueryProperty }
