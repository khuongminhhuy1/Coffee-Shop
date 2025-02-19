import "dotenv/config";
import { prisma } from "../prisma/client.js";
import { hashPassword, comparePassword } from "../utils/pwdHash.js";
import crypto from "crypto";
import AppError from "../middlewares/errors/appError.js";
import { sendEmail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "./tokenController.js";
import { uploadToCloudinary } from "../utils/upload.js";

export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  //Check if all required fields are provided
  if (!name || !email || !password) {
    return next(new AppError("Please provide all required fields", 400));
  }
  //Validate Email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  if (!validateEmail(email)) {
    throw new AppError("Invalid email format", 400);
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
  <p>Please click the link below to verify the account you just created in our Coffee E-Shop</p>
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
//Login
export async function loginUser(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide all required fields", 400));
  }
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  if (!validateEmail(email)) {
    throw new AppError("Invalid email format", 400);
  }
  //Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return next(new AppError("Invalid credentials", 400));
  }
  if (!user.verified) {
    return next(
      new AppError("User not verified, Please verify your account", 401)
    );
  }
  //Check if password is correct
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return next(new AppError("Password Incorrect", 401));
  }

  //Generate Token

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  const refreshToken = await generateRefreshToken(user.id);
  res.cookie("token", token, {
    httpOnly: true, // Prevents access to the token from JavaScript
    secure: false, // Set to true in production for HTTPS
    sameSite: "Lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.status(200).json({
    status: "success",
    data: {
      token,
      refreshToken,
    },
  });
}
//Forgot Password
export async function forgotPassword(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please provide your email", 400));
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  await prisma.token.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    },
  });
  const resetLink = `${process.env.APP_URL}/reset-password?token=${hashedToken}`;
  const message = `
  <p>Hello ${user.name},</p>
  <p>Please click the link below to reset your password</p>
  <p><a href="${resetLink}">Reset Password</a></p>
  <p>If you did not request a password reset, please ignore this email</p>
  `;
  await sendEmail(user.email, "Password Reset", message);
  res.status(200).json({
    status: "success",
    message: "Please check your email to reset your password",
  });
}
export async function resetPassword(req, res, next) {
  const { token } = req.query;
  const { password } = req.body;
  if (!token) {
    return next(new AppError("Token are required", 400));
  }
  await prisma.token
    .findFirst({
      where: { token },
    })
    .then(async (tokenRecord) => {
      if (!tokenRecord) {
        return next(new AppError("Invalid or expired token", 400));
      }
      if (new Date() > new Date(tokenRecord.expiresAt)) {
        return next(new AppError("Token has expired", 400));
      }
      const hashedPassword = await hashPassword(password);
      await prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword },
      });
      await prisma.token.delete({ where: { id: tokenRecord.id } });
      return res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    })
    .catch((error) => {
      next(new AppError(error.message, 500));
    });
}
export async function changePassword(req, res, next) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new AppError("Please provide all required fields", 400));
  }
  await prisma.user
    .findUnique({
      where: { id: req.user.id },
    })
    .then(async (user) => {
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        return next(new AppError("Old password is incorrect", 401));
      }
      const hashedPassword = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword },
      });
      return res.status(200).json({
        status: "success",
        message: "Password changed successfully",
      });
    })
    .catch((error) => {
      next(new AppError(error.message, 500));
    });
}

//Update User
export async function UpdateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let avatarUrl = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      avatarUrl = uploadResult.secure_url;
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (avatarUrl) updateData.avatar = avatarUrl;

    if (!Object.keys(updateData).length) {
      return next(new AppError("No data provided for update", 400));
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function DeleteUser(req, res, next) {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: id } });
  return res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
}

export async function logoutUser(req, res, next) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  });
  return res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
}

//Get Users
export async function getUsers(req, res, next) {
  const users = await prisma.user.findMany();
  return res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
}
//Get User Data
export async function getUserData(req, res, next) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: id },
    include: {
      userInformation: true,
    },
  });
  if (user) {
    return res.status(200).json({
      message: "User Data Retrieved",
      user: {
        ...user,
        userInformation: user.userInformation || null, // Ensuring null if missing
      },
    });
  } else {
    return next(new AppError("User not found", 404));
  }
}
