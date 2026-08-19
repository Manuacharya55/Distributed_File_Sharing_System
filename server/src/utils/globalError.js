

export const globalError = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    console.log(err)
    const stack = process.env.NODE_ENV !== "production" ? err.stack : undefined;
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors
    });
};
