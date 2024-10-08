// src/middleware/auth.js
// const jwt = require("jsonwebtoken");

// // Middleware to verify token
// exports.verifyToken = (req, res, next) => {
//   const token = req.header("Authorization");
//   console.log("Token Received:", token);

//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Memisahkan "Bearer" dari token
//     req.user = decoded;
//     console.log("Token Decoded:", decoded);
//     next();
//   } catch (err) {
//     console.error("Token Invalid:", err);
//     return res.status(400).json({ message: "Invalid token" });
//   }
// };

const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" }); // Pesan spesifik jika token expired
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
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

// General middleware to authorize based on roles
exports.authorizeRole = function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: You do not have permission" });
    }
    next();
  };
};
