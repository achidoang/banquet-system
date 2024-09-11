// src/routes/auth.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { verifyToken } = require("../middleware/auth");

// Endpoint untuk memverifikasi token
router.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// Routes for authentication
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
