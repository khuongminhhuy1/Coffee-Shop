import express from "express";
import { constructUrl } from "../urlHelper.js";
import authMiddleware from "../middlewares/verification/auth.js";
import { adminMiddleware } from "../middlewares/verification/protected.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import { handleMulterError, upload, uploadImages } from "../utils/upload.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

router.use((req, res, next) => {
  res.locals.url = constructUrl(req);
  next();
});

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.array("images"),
  handleMulterError,
  uploadImages,
  catchAsync(createProduct)
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadImages,
  handleMulterError,
  catchAsync(updateProduct)
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  catchAsync(deleteProduct)
);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
export default router;
