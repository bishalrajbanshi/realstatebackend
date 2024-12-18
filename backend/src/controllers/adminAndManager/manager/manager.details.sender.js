import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { Manager } from "../../../models/manager.model.js";

const managerDetails = asyncHandler( async ( req, res) => {
    try {
        const managerId = req.manager?._id;

        //validate
        if (!managerId) {
            throw new apiError({
                statusCode:400,
                message:"Unauthorize manager"
            })
        }

        const manager = await Manager.findById(managerId).select('fullName email username accessToken refreshToken avatar');

        //response
        res.status(200)
        .json( new apiResponse({
            data: manager,
            success: true
        }))


    } catch (error) {
        throw new apiError({
            statusCode:400,
            message: "manager not found"
        })
        process.exit(1)
    }
})

export { managerDetails }