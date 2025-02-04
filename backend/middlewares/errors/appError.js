export default class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // Mark errors as operational (expected errors)
  
      // Capture the stack trace (excluding the constructor call)
      Error.captureStackTrace(this, this.constructor);
    }
  }