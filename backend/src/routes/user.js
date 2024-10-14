const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { verifyToken, verifyIT, authorizeRole } = require("../middleware/auth");

// Route untuk mendapatkan semua pengguna (IT) atau hanya akun sendiri (non-IT)
router.get("/", verifyToken, UserController.getAllUsers);

// Route untuk mendapatkan detail pengguna berdasarkan ID (IT bisa akses siapa saja, pengguna lain hanya dirinya sendiri)
router.get("/:id", verifyToken, UserController.getUserById);

// Route untuk membuat pengguna baru (hanya IT yang bisa)
router.post("/", verifyToken, verifyIT, UserController.createUser);

// Route untuk mengupdate pengguna (IT bisa update siapa saja, pengguna lain hanya dirinya sendiri)
router.put("/:id", verifyToken, UserController.updateUser);

// Route untuk menghapus pengguna (hanya IT yang bisa)
router.delete("/:id", verifyToken, verifyIT, UserController.deleteUser);

module.exports = router;
