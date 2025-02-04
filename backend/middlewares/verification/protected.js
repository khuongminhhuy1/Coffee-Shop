import AppError from "../errors/appError.js";

export function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(new AppError("Access Denied. Admins Only! ", 403));
  }
  next();
}
