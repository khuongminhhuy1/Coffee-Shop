import express from "express";
const router = express.Router();
import { constructUrl } from "../urlHelper.js";

import {
  addToCart,
  deleteCart,
  getCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/verification/auth.js";

router.use((req, res, next) => {
  res.locals.url = constructUrl(req);
  next();
});

router.get("/:userId", getCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/:id", deleteCart);

export default router;
