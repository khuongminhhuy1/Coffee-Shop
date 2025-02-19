import express from "express";
import {
  changePassword,
  createUser,
  DeleteUser,
  forgotPassword,
  getUserData,
  getUsers,
  loginUser,
  logoutUser,
  resetPassword,
  UpdateUser,
  verifyUser,
} from "../controllers/userController.js";
import catchAsync from "../utils/catchAsync.js";
import authMiddleware from "../middlewares/verification/auth.js";
import { adminMiddleware } from "../middlewares/verification/protected.js";
import { constructUrl } from "../urlHelper.js";
import { refreshTokenHandler } from "../controllers/tokenController.js";
import { checkVerified } from "../middlewares/verification/verified.js";
import {
  deleteUserInformation,
  getUserInformation,
  saveUserInformation,
} from "../controllers/userInfoController.js";
import { handleMulterError, upload } from "../utils/upload.js";

const router = express.Router();
router.use((req, res, next) => {
  res.locals.url = constructUrl(req);
  next();
});

//Register User
router.post("/register", catchAsync(createUser));
router.get("/verify", catchAsync(verifyUser));
//Login User
router.post("/login", checkVerified, catchAsync(loginUser));
//Logout User
router.post("/logout", catchAsync(logoutUser));

//Pasword
router.post("/forgot-password", catchAsync(forgotPassword));
router.post("/reset-password", catchAsync(resetPassword));
router.put("/change-password", authMiddleware, catchAsync(changePassword));

//CRUD Operations
router.get("/users", authMiddleware, catchAsync(getUsers));
router.get("/user/:id", authMiddleware, catchAsync(getUserData));
router.put(
  "/user/:id",
  authMiddleware,
  upload.single("avatar"),
  handleMulterError,
  catchAsync(UpdateUser)
);
router.delete(
  "/user/:id",
  authMiddleware,
  adminMiddleware,
  catchAsync(DeleteUser)
);

//Refresh token
router.get("/refresh-token", refreshTokenHandler);

//User Data
router.get("/profile/:userId", authMiddleware, catchAsync(getUserInformation));
router.post(
  "/profile/:userId",
  authMiddleware,
  catchAsync(saveUserInformation)
);
router.delete(
  "/profile/:userId",
  authMiddleware,
  catchAsync(deleteUserInformation)
);

//Admin test
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  return res.status(200).json("success");
});
export default router;
