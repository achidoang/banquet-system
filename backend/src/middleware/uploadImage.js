// src/middleware/uploadImage.js

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// Multer configuration (limit 5MB, only JPG, JPEG, PNG)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only JPG, JPEG, and PNG images are allowed!"));
    }
    cb(null, true);
  },
});

// Sharp for resizing and compressing images
const processImage = async (buffer) => {
  return await sharp(buffer)
    .resize({ width: 1000 }) // Max width of 1000px
    .toFormat("jpeg", { quality: 80 }) // Convert to JPEG with 80% quality
    .toBuffer();
};

module.exports = { upload, processImage };
