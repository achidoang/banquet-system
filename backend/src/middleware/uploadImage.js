// src/middleware/uploadImage.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");

// Setup multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");

    // Check if the uploads folder exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter to accept only JPG, JPEG, PNG formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
  }
};

// Limit file size to 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware to serve uploads folder (optional, if you want to do it here)
const serveUploads = (app) => {
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"))); // Perbaiki path ini
};

module.exports = { upload };
