import express from "express";
import {
  createUser,
  forgotPassword,
  getUsers,
  loginUser,
  resetPassword,
  UpdateUser,
  verifyUser,
} from "../controllers/userController.js";
import catchAsync from "../utils/catchAsync.js";
import authMiddleware from "../middleware/verification/auth.js";
import { adminMiddleware } from "../middleware/verification/protected.js";

const router = express.Router();

//Register User
router.post("/register", catchAsync(createUser));
router.get("/verify", catchAsync(verifyUser));
//Login User
router.post("/login", catchAsync(loginUser));

//Pasword
router.post("/forgot-password", catchAsync(forgotPassword));
router.post("/reset-password", catchAsync(resetPassword));

//CRUD Operations
router.get("/users", authMiddleware, adminMiddleware, catchAsync(getUsers));
router.put("/user/:id", authMiddleware, catchAsync(UpdateUser));
router.delete(
  "/user/:id",
  authMiddleware,
  adminMiddleware,
  catchAsync(UpdateUser)
);
export default router;
