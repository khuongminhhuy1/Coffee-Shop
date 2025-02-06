import { prisma } from "../prisma/client.js";
import AppError from "../middlewares/errors/appError.js";

export async function createProduct(req, res, next) {
  const { name, categories, price, description } = req.body;
  if (!name || !categories || !price || !description) {
    return next(new AppError("All fields are required"), 400);
  }

  if (!Array.isArray(categories)) {
    return next(new AppError("Categories should be an array of IDs", 400));
  }

  // If category IDs are passed as strings, you may need to parse them into integers or UUIDs (depending on your schema)
  const categoryIds = categories.map((category) => {
    const id = parseInt(category, 10); // For integer-based categories
    if (isNaN(id)) {
      return next(new AppError(`Invalid category ID: ${category}`, 400));
    }
    return id;
  });

  const imageUrls = req.images;

  const priceFloat = parseFloat(price);
  if (isNaN(priceFloat)) {
    return next(new AppError("Invalid price format", 400));
  }
  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      categories: {
        connect: categoryIds.map((id) => ({ id })), // Connect existing categories
      },
      images: {
        create: imageUrls.map((url) => ({ url })),
      },
      price: priceFloat,
    },
    include: {
      categories: true, // Return categories in response
      images: true,
    },
  });
  await prisma.category.updateMany({
    where: { id: { in: categoryIds } },
    data: {
      total: {
        increment: 1, // Increment the total count by 1
      },
    },
  });
  return res.status(200).json(product);
}

export async function updateProduct(req, res, next) {
  const { id } = req.params; // Get product ID from the request params
  const { name, categories, price, description } = req.body; // Get data from the body

  if (!name || !categories || !price || !description) {
    return next(new AppError("All fields are required", 400));
  }

  // Check if the product exists
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Handle the categories: ensure it's an array
  const categoryIds = categories.map((category) => {
    return { id: category }; // For example, for integer IDs, connect them to the existing categories
  });

  // If there are image updates, handle the images as well
  const imageUrls = req.files ? req.files.map((file) => file.path) : [];

  // Update product
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name,
      price: parseFloat(price),
      description,
      categories: {
        connect: categoryIds, // Update categories
      },
      images:
        imageUrls.length > 0
          ? {
              create: imageUrls.map((url) => ({ url })), // Add new images if any
            }
          : undefined, // Skip if no images are provided
    },
    include: {
      categories: true,
      images: true,
    },
  });

  return res.status(200).json({
    message: "Product updated successfully!",
    product: updatedProduct,
  });
}

export async function getAllProducts(req, res) {
  const products = await prisma.product.findMany({
    include: {
      categories: true, // Include categories in the response
      images: true, // Include images in the response
    },
  });
  return res.status(200).json({
    message: "All products retrieved successfully!",
    products,
  });
}
export async function getSingleProduct(req, res) {
  const { id } = req.params; // Get product ID from the URL parameter

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: true, // Include categories in the response
      images: true, // Include images in the response
    },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found!" });
  }

  return res.status(200).json({
    message: "Product retrieved successfully!",
    product,
  });
}
export async function deleteProduct(req, res) {
  const { id } = req.params; // Get product ID from URL parameter
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found!" });
  }

  // Delete images associated with the product first, if needed
  await prisma.image.deleteMany({
    where: { productId: id },
  });

  // Delete product
  await prisma.product.delete({
    where: { id },
  });

  return res.status(200).json({
    message: "Product deleted successfully!",
  });
}
