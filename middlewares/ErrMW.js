module.exports = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = [];
        for (let field in err.errors) {
            errors.push(err.errors[field].message);
        }
        return res.status(400).json({
            status: false,
            message: "Validation Error",
            errors: errors
        });
    }
    
    // Handle mongoose cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: false,
            message: "Invalid ID format",
            error: err.message
        });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
        return res.status(400).json({
            status: false,
            message: "Duplicate field value",
            error: err.message
        });
    }
    
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false,
            message: "Invalid token",
            error: err.message
        });
    }
    
    // Handle JWT expiration
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false,
            message: "Token expired",
            error: err.message
        });
    }
    
    // Default error response
    res.status(500).json({
        status: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
}
