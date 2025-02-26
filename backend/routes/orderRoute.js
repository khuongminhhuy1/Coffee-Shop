import express from "express";
const router = express.Router();
import { constructUrl } from "../urlHelper.js";
import authMiddleware from "../middlewares/verification/auth.js";
import { adminMiddleware } from "../middlewares/verification/protected.js";
import catchAsync from "../utils/catchAsync.js";
import {
  checkoutOrder,
  getOrders,
  getAllOrders,
  cancelOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

router.use((req, res, next) => {
  res.locals.url = constructUrl(req);
  next();
});

router.post("/checkout", authMiddleware, catchAsync(checkoutOrder)); // Place order
router.get("/:userId", catchAsync(getOrders)); // Get user-specific orders
router.get(
  "/admin/orders",
  authMiddleware,
  adminMiddleware,
  catchAsync(getAllOrders)
); // Get all orders for admin
router.patch(
  "/:orderId/status",
  authMiddleware,
  adminMiddleware,
  catchAsync(updateOrderStatus)
); // Update order status
router.delete("/:orderId/cancel", authMiddleware, catchAsync(cancelOrder)); // Delete order

export default router;
