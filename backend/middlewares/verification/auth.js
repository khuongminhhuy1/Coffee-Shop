import jwt from "jsonwebtoken";
import AppError from "../errors/appError.js";

async function authMiddleware(req, res, next) {
  let token = req.cookies?.token; // Check if token is in cookies

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]; // Extract from Authorization header
  }

  if (!token) {
    return next(new AppError("Unauthorized - No token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 403));
  }
}
export default authMiddleware;
