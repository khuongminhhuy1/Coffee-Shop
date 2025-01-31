import jwt from "jsonwebtoken";
import AppError from "../errors/appError.js";
async function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return new AppError("Unauthorized", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    return new AppError("Invalid or expired token", 403);
  }
}

export default authMiddleware;
