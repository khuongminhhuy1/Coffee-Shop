import { prisma } from "../prisma/client.js";

export async function saveUserInformation(req, res) {
  const { userId, address, city, state, zipCode, phone, country } = req.body;

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

  // Upsert user information
  const userInfo = await prisma.userInformation.upsert({
    where: { userId: Number(userId) },
    create: {
      userId: Number(userId),
      address,
      city,
      state,
      zipCode,
      phone,
      country,
    },
    update: {
      address,
      city,
      state,
      zipCode,
      phone,
      country,
    },
  });

  res
    .status(200)
    .json({ message: "User information saved successfully", userInfo });
}

export async function deleteUserInformation(req, res) {
  const { id } = req.params;
  await prisma.userInformation.delete({
    where: { id: id },
  });
  return res.status(200).json("User Deleted");
}
