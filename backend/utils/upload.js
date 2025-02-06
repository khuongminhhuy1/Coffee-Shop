import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Only images are allowed!"), false);
    }
    cb(null, true);
  },
});

const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "uploads" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
  next();
};

const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    // Loop through each uploaded file and upload it to Cloudinary
    const uploadPromises = req.files.map(
      (file) => uploadToCloudinary(file.buffer) // Upload each file buffer to Cloudinary
    );

    const uploadResults = await Promise.all(uploadPromises); // Wait for all uploads to complete

    // Add the image URLs to the request object
    req.images = uploadResults.map((result) => result.secure_url); // Store the image URLs in `req.images`

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    next(error); // Pass any error to the error handler
  }
};
export {
  cloudinary,
  upload,
  uploadToCloudinary,
  handleMulterError,
  uploadImages,
};
