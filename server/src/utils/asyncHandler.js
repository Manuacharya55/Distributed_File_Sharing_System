/**
 * A wrapper function to handle errors in asynchronous Express route handlers
 * and pass them to the next error-handling middleware.
 * 
 * @param {Function} requestHandler - The asynchronous Express request handler
 * @returns {Function} Express middleware function
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

module.exports = { asyncHandler };
