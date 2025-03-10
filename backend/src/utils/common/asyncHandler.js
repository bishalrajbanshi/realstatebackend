import { logger } from "../../db/logger.js";

const asyncHandler = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
        console.log("Res Object Inside asyncHandler:", res);
     
        
        if (!res || !res.status) {
            console.error("Response object not valid");
            logger.error("Response object not valid");
            return next(error);
        }

        logger.error(`Error occurred: ${error.message}`, { stack: error.stack });

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    });
};

export { asyncHandler };
