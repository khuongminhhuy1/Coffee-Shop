import { prisma } from "../../prisma/client.js";
import AppError from "../errors/appError.js";

export async function checkVerified(req, res, next) {
  const email = req.body.email;
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (!user.verified) {
    return next(new AppError("User not verified", 403));
  }
  next();
}
