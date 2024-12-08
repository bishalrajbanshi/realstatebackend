class apiError extends Error {
    constructor({
        statusCode = 500,
        message = "Something went wrong",
        errors = [],
        data = null,
        stack = null,
        metadata = null,
    } = {}) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.data = data;
        this.metadata = metadata;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    send(res) {
        const response = {
            success: this.success,
            message: this.message,
            data: this.data,
        };

        if (this.errors && this.errors.length > 0) {
            response.errors = this.errors;
        }

        if (this.metadata) {
            response.metadata = this.metadata;
        }

        if (process.env.NODE_ENV !== 'production' && this.stack) {
            response.stack = this.stack;
        }

        return res.status(this.statusCode).json(response);
    }

    static notFound(message = "Resource not found") {
        return new apiError({ statusCode: 404, message });
    }

    static badRequest(message = "Bad Request", errors = []) {
        return new apiError({ statusCode: 400, message, errors });
    }

    static unauthorized(message = "Unauthorized") {
        return new apiError({ statusCode: 401, message });
    }
}

export { apiError };
