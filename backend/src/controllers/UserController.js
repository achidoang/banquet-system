// src/controllers/UserController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/SendEmail.js");

// Register a new user
exports.register = async (req, res) => {
  const { username, password, role, email } = req.body;
  console.log("Registration request received:", {
    username,
    password,
    role,
    email,
  }); // Logging input data

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      email,
    });
    await newUser.save();

    console.log("User registered successfully:", newUser); // Logging success
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error); // Logging error details
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login user
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received:", { username, password }); // Logging input data

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found"); // Logging case where user is not found
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match"); // Logging case where password is incorrect
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful, token generated:", token); // Logging token generation
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error); // Logging error details
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get all users (IT) or only own account for other roles
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role === "it") {
      // If the user is IT, return all users
      const users = await User.find();
      return res.status(200).json(users);
    } else {
      // If not IT, return only the current user's data
      const user = await User.findById(req.user.id);
      return res.status(200).json([user]); // Return as an array for consistency
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    // Jika bukan IT, pastikan pengguna hanya bisa mengakses datanya sendiri
    if (req.user.role !== "it" && req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Access forbidden: Cannot access other users' data" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// Create new user (admin or IT)
exports.createUser = async (req, res) => {
  const { username, password, role, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      email,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Update user by ID with password hashing
exports.updateUser = async (req, res) => {
  try {
    // Jika bukan IT, pastikan hanya bisa mengupdate akun sendiri
    if (req.user.role !== "it" && req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Access forbidden: Cannot update other users' data" });
    }

    const { password, ...otherUpdates } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the password if it's provided in the request
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      otherUpdates.password = hashedPassword;
    }

    // Update the user with the new data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...otherUpdates },
      { new: true }
    );

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Send Reset mail
exports.sendResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Generate JWT token for password reset
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Send email with reset link
    const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: message,
    });

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email", error });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token or user does not exist" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};
