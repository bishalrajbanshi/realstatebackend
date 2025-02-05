// const asyncHandler = (func) => async (req, res, next) => {
//     try {
//         // Debugging to check if res is correct
//         console.log("Res Object Inside asyncHandler:", res);

//         await func(req, res, next);
//     } catch (error) {
//         // Debugging response object
//         if (!res || !res.status) {
//             console.error("Response object not valid", res);
//         }

//         res.status(error.statusCode || 500).json({
//             success: false,
//             message: error.message || "Internal server error",
//         });
//     }
// };

// export { asyncHandler };


const asyncHandler = (func) => async (req, res, next) => {
    try {
        // Debugging to check if res is correctly passed
        console.log("Inside asyncHandler, Res Object:", res);

        await func(req, res, next);
    } catch (error) {
        console.error("Error caught in asyncHandler:", error);

        if (!res || typeof res.status !== "function") {
            console.error("Invalid response object detected:", res);
            return next(error);
        }

        next(error); 
    }
};

export { asyncHandler };
