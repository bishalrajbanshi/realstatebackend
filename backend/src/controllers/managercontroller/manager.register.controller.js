import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { Manager } from "../../models/manager.model.js";

const managerRegister = asyncHandler(async (req, res, next) => {
    const { fullName, email, mobileNumber, password } = req.body;

    // Step 1: Input Validation
    if ([fullName, email, mobileNumber, password].some(field => !field || field.trim() === "")) {
        throw new apiError({
            statusCode: 400,
            message: "ALL FIELDS ARE REQUIRED",
            success: false,
        });
    }

    // Step 2: Check if the manager already exists by email or mobile number
    const existingManager = await Manager.findOne({
        $or: [{ email }, { mobileNumber }],
    });

    if (existingManager) {
        throw new apiError({
            statusCode: 409,
            message: "MANAGER WITH EMAIL OR NUMBER ALREADY EXISTS",
            success: false,
        });
    }

    // Step 3: Create and save the new Manager
    try {
        const newManager = await Manager.create({
            fullName,
            email,
            mobileNumber,
            password,
        });

        // Remove sensitive data 
        const sanitizedManager = {
            _id: newManager._id,
            fullName: newManager.fullName,
            email: newManager.email,
            mobileNumber: newManager.mobileNumber,
        };

        // Step 4: Send the successful response
        return new apiResponse({
            statusCode: 201,
            message: "MANAGER REGISTERED SUCCESSFULLY",
            success: true,
            data: sanitizedManager,
        }).send(res);
    } catch (error) {
        console.error("Error during manager registration:", error);
        return next(
            new apiError({
                statusCode: 500,
                message: "AN ERROR OCCURRED WHILE REGISTERING MANAGER",
                success: false,
            })
        );
    }
});

export { managerRegister };
