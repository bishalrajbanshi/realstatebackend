class apiResponse {
    constructor({
        statusCode = 200,
        data = [],
        message = "Request successful",
        metadata = null,
        success = statusCode >= 200 && statusCode < 500,
    }) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success; 
        this.metadata = metadata;
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
            metadata: this.metadata,
        });
    }

    // Static method for error responses 
    static errorResponse(res, message = "Something went wrong", statusCode = 500) {
        return new apiResponse({
            statusCode,
            message,
            success: false,
        }).send(res);
    }
}

export { apiResponse };
