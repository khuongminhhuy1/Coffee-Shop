import "dotenv/config";
import jwt from "jsonwebtoken";
import AppError from "../errors/appError.js";

export function verifyToken(req, res, next) {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return next(new AppError("No token provided!", 403));
  }

  token = token.split(" ")[1]; // Extract the token after "Bearer"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid or expired token", 401));
    }

    req.userId = decoded.id;
    next();
  });
}
