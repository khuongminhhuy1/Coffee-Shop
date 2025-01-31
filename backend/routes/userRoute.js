import express from "express";
import {
  createUser,
  getUsers,
  verifyUser,
} from "../controllers/userController.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

//Register User
router.post("/register", catchAsync(createUser));
router.get("/verify", catchAsync(verifyUser));

//CRUD Operations
router.get("/users", catchAsync(getUsers));
export default router;
