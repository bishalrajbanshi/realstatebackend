class apiResponse {
    constructor({
        statusCode = 200,
        data = [],
        message = "Login in Successfull",
        metadata = null,
    } = {}) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode >= 200 && statusCode < 500; 
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
}

export { apiResponse };


// return new apiResponse({
        //     statusCode: 200,
        //     success: true,
        //     message: "Login successful",
        //     data: { accessToken, refreshToken },
        //     metadata: { ip: req.ip, timestamp: new Date() },
        // }).send(res);