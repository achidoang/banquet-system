// src/utils/generateToken.js

// generate token for forgot password
const jwt = require("jsonwebtoken");

const generateResetToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Token valid for 15 minutes
  });
};

module.exports = generateResetToken;
