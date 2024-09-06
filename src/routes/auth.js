// src/routes/auth.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Routes for authentication
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
