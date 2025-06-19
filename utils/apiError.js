class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Indicates that the error is operational and not a programming error
        Error.captureStackTrace(this, this.constructor); // Captures the stack trace for debugging
    }
}

module.exports = ApiError