import { stringify } from "uuid";
import { prisma } from "../prisma/client.js";

export async function saveUserInformation(req, res) {
  const { userId, address, city, state, zipCode, phone, country } = req.body;

  // Validate all fields
  if (
    !userId ||
    !address ||
    !city ||
    !state ||
    !zipCode ||
    !phone ||
    !country
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Upsert user information
    const userInfo = await prisma.userInformation.upsert({
      where: { userId },
      create: { userId, address, city, state, zipCode, phone, country },
      update: { address, city, state, zipCode, phone, country },
    });

    res
      .status(200)
      .json({ message: "User information saved successfully", userInfo });
  } catch (error) {
    console.error("Error saving user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserInformation(req, res) {
  const userId = req.params.userId;
  const convertedId = String(userId);
  // Validate userId
  if (!convertedId || typeof convertedId !== "string") {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  // Optional: Check if the authenticated user is authorized to access this profile
  if (req.user.convertedId !== convertedId && !req.user.role === "ADMIN") {
    return res.status(403).json({
      error: "Forbidden: You are not authorized to access this profile.",
    });
  }

  const userInfo = await prisma.userInformation.findUnique({
    where: { userId: convertedId },
  });
  res.status(200).json(userInfo);
}

export async function deleteUserInformation(req, res) {
  const { id } = req.params;
  await prisma.userInformation.delete({
    where: { id: id },
  });
  return res.status(200).json("User Deleted");
}
