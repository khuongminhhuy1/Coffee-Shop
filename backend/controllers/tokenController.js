import { prisma } from "../prisma/client.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function generateRefreshToken(userId) {
  // Generate unique token
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

  await prisma.refreshToken.deleteMany({ where: { userId } });
  // Store refresh token in the database
  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      userId,
      expiresAt,
    },
  });

  return refreshToken;
}

export async function refreshTokenHandler(req, res, next) {
  const refreshToken = req.cookies?.refreshToken; // Get token from cookies

  if (!refreshToken) {
    return next(new AppError("Refresh token missing", 401));
  }
  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

  // Find refresh token in the database
  const storedToken = await prisma.refreshToken.findFirst({
    where: { userId: decoded.userId, token: refreshToken },
  });

  if (!storedToken) {
    return next(new AppError("Invalid refresh token", 403));
  }

  // Check if refresh token is expired
  if (new Date(storedToken.expiresAt) < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    return next(
      new AppError("Refresh token expired, please log in again", 403)
    );
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Generate a new access token
  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Generate a new refresh token
  const newRefreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // Delete only the used refresh token & store a new one
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Set new refresh token in cookies
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("token", newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  return res.json({ accessToken: newAccessToken });
}

export async function verifySession(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Return user data
    res.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {
    // If token is expired, try to refresh it
    return refreshTokenHandler(req, res, next);
  }
}
