import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { Admin } from "../../../models/admin.model.js";


const adminDetails = asyncHandler ( async ( req, res) => {
   try {
     const adminID  = req.admin?._id;
     console.log("adminId",adminID);
 
     //validate admin id
     if (!adminID) {
         throw new apiError({
             statusCode:400,
             message:"Unauthorize admin"
         })
     }
 
     const admin = await Admin.findById(adminID).select('fullName email username accessToken refreshToken');
 
     //send data
     res.status(200)
     .json( new apiResponse({
         data:admin,
         success: true,
     }))
 
   } catch (error) {
    throw new apiError({
        statusCode:400,
        message: "admin not found"
    })
   }
   process.exit(1)
    
})

export { adminDetails }