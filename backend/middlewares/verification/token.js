import "dotenv/config";
import jwt from "jsonwebtoken";
import AppError from "../errors/appError.js";

export function verifyToken(req, res, next) {
  // First check for token in cookies (preferred method)
  let token = req.cookies?.token;
  
  // If no cookie token, fall back to authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("No token provided!", 403));
    }
    
    token = authHeader.split(" ")[1]; // Extract the token after "Bearer"
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user info on the request object
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;
    
    next();
  } catch (err) {
    // Token verification failed
    return next(new AppError("Invalid or expired token", 401));
  }
}