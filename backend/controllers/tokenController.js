import { prisma } from "../prisma/client.js";
import jwt from "jsonwebtoken";

export async function generateRefreshToken(userId) {
  // Generate unique token
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

  await prisma.refreshToken.deleteMany({ where: { userId } });
  // Store refresh token in the database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    },
  });

  return refreshToken;
}

export async function refreshTokenHandler(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken; // Get token from cookies

    if (!refreshToken) {
      return next(new AppError("Refresh token missing", 401));
    }

    // Find refresh token in the database
    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      return next(new AppError("Invalid refresh token", 403));
    }

    // Check if token is expired
    if (new Date(storedToken.expiresAt) < new Date()) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      return next(
        new AppError("Refresh token expired, please log in again", 403)
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

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
      { expiresIn: "1h" }
    );

    // Generate a new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Delete old refresh token and store new one
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return next(new AppError("Internal server error", 500));
  }
}
