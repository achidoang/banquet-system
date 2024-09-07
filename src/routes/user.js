const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { verifyToken, verifyIT } = require("../middleware/auth");

// CRUD for users, only IT can access these routes
router.get("/", verifyToken, verifyIT, UserController.getAllUsers);
router.get("/:id", verifyToken, verifyIT, UserController.getUserById);
router.post("/", verifyToken, verifyIT, UserController.createUser);
router.put("/:id", verifyToken, verifyIT, UserController.updateUser);
router.delete("/:id", verifyToken, verifyIT, UserController.deleteUser);

module.exports = router;
