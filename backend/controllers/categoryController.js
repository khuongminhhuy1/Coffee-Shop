import AppError from "../middlewares/errors/appError.js";
import { prisma } from "../prisma/client.js";

export async function createCategory(req, res) {
  const { name, total } = req.body;
  const newCategory = await prisma.category.create({
    data: {
      name,
      total,
    },
  });
  return res.status(200).send(newCategory);
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const category = await prisma.category.update({
    where: { id: id },
    data: {
      name,
    },
  });
  return res.status(200).json("category updated", category);
}

export async function deleteCategory(req, res) {
  const { id } = req.params;
  await prisma.category.delete({
    where: { id: id },
  });
  return res.status(201).json("category deleted");
}

export async function showCategory(req, res, next) {
  const category = await prisma.category.findMany();
  if (!category) {
    return next(new AppError("Category not found", 404));
  } else {
    return res.status(200).json(category);
  }
}
export async function showSingleCategory(req, res, next) {
  const { id } = req.params;
  const category = await prisma.category.findFirst({
    where: { id: id },
  });
  if (!category) {
    return next(new AppError("Category not found", 404));
  } else {
    return res.status(200).json(category);
  }
}
