import express from "express";
import {
  changePassword,
  createUser,
  forgotPassword,
  getUsers,
  loginUser,
  logoutUser,
  resetPassword,
  UpdateUser,
  verifyUser,
} from "../controllers/userController.js";
import catchAsync from "../utils/catchAsync.js";
import authMiddleware from "../middleware/verification/auth.js";
import { adminMiddleware } from "../middleware/verification/protected.js";
import { constructUrl } from "../urlHelper.js";

const router = express.Router();

router.use((req, res, next) => {
  res.locals.url = constructUrl(req);
  next();
});

//Register User
router.post("/register", catchAsync(createUser));
router.get("/verify", catchAsync(verifyUser));
//Login User
router.post("/login", catchAsync(loginUser));
//Logout User
router.post("/logout", catchAsync(logoutUser));

//Pasword
router.post("/forgot-password", catchAsync(forgotPassword));
router.post("/reset-password", catchAsync(resetPassword));
router.put("/change-password", authMiddleware, catchAsync(changePassword));

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
