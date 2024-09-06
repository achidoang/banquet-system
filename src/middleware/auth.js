// src/middleware/auth.js
const jwt = require("jsonwebtoken");

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Token Received for Verification:", token); // Log token yang diterima

  // Jika token tidak ada
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Log token yang sudah ter-decode
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message); // Log error jika ada
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to check IT role
exports.verifyIT = (req, res, next) => {
  if (req.user.role !== "it") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// Middleware to check Admin role
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
