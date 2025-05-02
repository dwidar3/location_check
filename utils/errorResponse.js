// utils/errorResponse.js

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);  // Call the parent class constructor
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}

export default ErrorResponse;
