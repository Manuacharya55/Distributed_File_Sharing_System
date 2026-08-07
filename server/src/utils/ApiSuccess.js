/**
 * Utility class to represent standard API success responses.
 */
class ApiSuccess {
    /**
     * @param {number} statusCode - HTTP status code (typically 200, 201, etc.)
     * @param {any} data - Response payload data
     * @param {string} message - Descriptive success message
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

module.exports = { ApiSuccess };
