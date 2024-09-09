// src/middleware/auth.js
const jwt = require("jsonwebtoken");

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Token Received:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Splitting to remove "Bearer"
    req.user = decoded;
    console.log("Token Decoded:", decoded);
    next();
  } catch (err) {
    console.error("Token Invalid:", err);
    return res.status(400).json({ message: "Invalid token" });
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
