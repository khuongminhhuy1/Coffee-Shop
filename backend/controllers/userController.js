import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/pwdHash.js";
import crypto, { hash } from "crypto";
import AppError from "../middleware/errors/appError.js";
import { sendEmail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  //Check if all required fields are provided
  if (!name || !email || !password) {
    return next(new AppError("Please provide all required fields", 400));
  }
  //Check if email is valid
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new AppError("Email already exists", 400));
  }
  //Hash Password
  const hashedPassword = await hashPassword(password);
  //Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  //Generate Token
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  //Store token in database
  await prisma.token.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    },
  });
  const verificationLink = `${process.env.SERVER_URL}/verify?token=${hashedToken}`;
  const message = `
  <p>Hello ${user.name},</p>
  <p>Please click the link below to verify the account you just created in Cooffeel</p>
  <p><a href="${verificationLink}">Verify Account</a></p>
  <p>Thank you and welcome to our website!</p>
  `;
  await sendEmail(user.email, "Verify Email", message);

  res.status(201).json({
    status: "success",
    message: "Please check your email to verify your account",
    data: {
      user,
    },
  });
};

export async function verifyUser(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      return next(new AppError("Token is required", 400));
    }

    // Find token in database
    const tokenRecord = await prisma.token.findFirst({
      where: { token },
    });

    if (!tokenRecord) {
      return next(new AppError("Invalid or expired token", 400));
    }

    // Check if token is expired
    if (new Date() > new Date(tokenRecord.expiresAt)) {
      return next(new AppError("Token has expired", 400));
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { verified: true },
    });

    // Delete the used token
    await prisma.token.delete({ where: { id: tokenRecord.id } });

    res.status(200).json({
      status: "success",
      message: "Account verified successfully",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
}

//Get Users
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
