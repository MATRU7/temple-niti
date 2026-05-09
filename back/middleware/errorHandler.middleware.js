/**
 * Global Error Handler Middleware
 * Catches all errors passed via next(err) and returns clean responses.
 * In production, stack traces are suppressed.
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    const isDev = process.env.NODE_ENV !== 'production';

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: messages,
            ...(isDev && { stack: err.stack })
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid authentication token.'
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Authentication token has expired.'
        });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ID format for field: ${err.path}`
        });
    }

    // Default: Internal server error
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(isDev && { stack: err.stack })
    });
}

export default errorHandler;
