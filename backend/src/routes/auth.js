// src/routes/auth.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  forgotPassword,
  resetPassword,
  sendResetEmail,
} = require("../controllers/UserController");
const { verifyToken } = require("../middleware/auth");

// Endpoint untuk memverifikasi token
router.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// Routes for authentication
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// src/routes/auth.js
router.post("/forgot-password", UserController.sendResetEmail);
router.post("/reset-password/:token", UserController.resetPassword);

module.exports = router;
