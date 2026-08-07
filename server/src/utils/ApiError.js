/**
 * Base class for standard API errors.
 */
class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error description message
     * @param {Array} errors - Array of specific error details or validation errors
     * @param {string} stack - Custom stack trace if provided
     */
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * 400 Bad Request Error
 */
class BadRequestError extends ApiError {
    constructor(message = "Bad Request", errors = [], stack = "") {
        super(400, message, errors, stack);
    }
}

/**
 * 401 Unauthorized Error
 */
class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized", errors = [], stack = "") {
        super(401, message, errors, stack);
    }
}

/**
 * 403 Forbidden Error
 */
class ForbiddenError extends ApiError {
    constructor(message = "Forbidden", errors = [], stack = "") {
        super(403, message, errors, stack);
    }
}

/**
 * 404 Not Found Error
 */
class NotFoundError extends ApiError {
    constructor(message = "Not Found", errors = [], stack = "") {
        super(404, message, errors, stack);
    }
}

/**
 * 500 Internal Server Error
 */
class InternalServerError extends ApiError {
    constructor(message = "Internal Server Error", errors = [], stack = "") {
        super(500, message, errors, stack);
    }
}

module.exports = {
    ApiError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    InternalServerError
};
