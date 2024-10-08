// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "it", "user"], required: true }, // Role-based access
  email: { type: String, required: true, unique: true },
  refreshToken: { type: String },
});

module.exports = mongoose.model("User", userSchema);
