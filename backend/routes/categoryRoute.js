import express from "express";
import {
  createCategory,
  deleteCategory,
  showCategory,
  showSingleCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/verification/auth.js";
import { adminMiddleware } from "../middlewares/verification/protected.js";
import catchAsync from "../utils/catchAsync.js";
import { constructUrl } from "../urlHelper.js";

const router = express.Router();
router.use((req, res, next) => {
  res.locals.url = constructUrl(req);
  next();
});

router.get("/", catchAsync(showCategory));
router.get("/:id", catchAsync(showSingleCategory));
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  catchAsync(createCategory)
);
router.put("/:id", authMiddleware, adminMiddleware, catchAsync(updateCategory));
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  catchAsync(deleteCategory)
);

export default router;
