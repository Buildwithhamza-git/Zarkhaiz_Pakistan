const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose invalid ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format.";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }

    // Duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate value for a unique field.";
    }

    // Zod validation error
    if (err.name === "ZodError") {
        statusCode = 400;
        message = err.issues
            .map((issue) => issue.message)
            .join(", ");
    }

    if (statusCode >= 500) {
        console.error(err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

const notFoundHandler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
};

module.exports = errorHandler;
module.exports.notFoundHandler = notFoundHandler;
