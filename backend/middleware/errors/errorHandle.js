// src/errors/errorHandler.js
import AppError from "./appError.js";

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error("ERROR :", err);

  // Default error response
  let error = { ...err };
  error.message = err.message;

  // Handle MySQL-specific errors
  if (err.code === "ER_DUP_ENTRY") {
    // MySQL duplicate entry error
    const message = `Duplicate entry: ${err.sqlMessage}`;
    error = new AppError(message, 400); // Bad Request
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    // MySQL foreign key constraint error
    const message = `Foreign key constraint failed: ${err.sqlMessage}`;
    error = new AppError(message, 400); // Bad Request
  }

  if (err.code === "ER_BAD_NULL_ERROR") {
    // MySQL null constraint error
    const message = `Null constraint failed: ${err.sqlMessage}`;
    error = new AppError(message, 400); // Bad Request
  }

  if (err.code === "ER_PARSE_ERROR") {
    // MySQL syntax error
    const message = `Syntax error in SQL query: ${err.sqlMessage}`;
    error = new AppError(message, 400); // Bad Request
  }

  // Handle JWT errors (if applicable)
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again!";
    error = new AppError(message, 401); // Unauthorized
  }

  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired! Please log in again.";
    error = new AppError(message, 401); // Unauthorized
  }

  // Send the error response
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message || "Something went wrong!",
  });
};

export default errorHandler;
