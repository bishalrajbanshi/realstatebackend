const asyncHandler = (func) => async (req, res, next) => {
    try {
        // Debugging to check if res is correct
        console.log("Res Object Inside asyncHandler:", res);

        await func(req, res, next);
    } catch (error) {
        console.error("Error in asyncHandler:", error);

        // Debugging response object
        if (!res || !res.status) {
            console.error("Response object not valid", res);
        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export { asyncHandler };
