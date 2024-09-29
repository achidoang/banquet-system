// src/routes/event.js
const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController"); // Pastikan controller diimpor dengan benar
const { verifyToken, authorizeRole } = require("../middleware/auth"); // Perbaiki impor middleware
const { upload } = require("../middleware/uploadImage"); // Import multer middleware

// Route for creating event (admin and it roles only)
router.post(
  "/",
  verifyToken, // Middleware autentikasi untuk memverifikasi JWT
  authorizeRole(["admin", "it"]), // Middleware untuk memverifikasi role admin dan it
  upload.array("images", 5), // Middleware multer untuk upload max 5 gambar
  EventController.createEvent // Callback function yang valid
);

// Route for getting all events
router.get(
  "/",
  verifyToken, // Middleware autentikasi
  authorizeRole(["admin", "it", "user"]), // Middleware otorisasi untuk berbagai role
  EventController.getEvents // Callback function yang valid
);

// Route for getting single event by id
router.get(
  "/:id",
  verifyToken, // Middleware autentikasi
  authorizeRole(["admin", "it", "user"]), // Middleware otorisasi untuk berbagai role
  EventController.getEventById // Callback function yang valid
);

// Route for updating event by id (admin and it roles only)
router.put(
  "/:id",
  verifyToken, // Middleware autentikasi
  authorizeRole(["admin", "it"]), // Hanya admin dan it
  EventController.updateEvent // Callback function yang valid
);

// Route for deleting event by id (admin and it roles only)
router.delete(
  "/:id",
  verifyToken, // Middleware autentikasi
  authorizeRole(["admin", "it"]), // Hanya admin dan it
  EventController.deleteEvent // Callback function yang valid
);

// Update event status by id (admin and it roles only)
router.put(
  "/:id/status",
  verifyToken,
  authorizeRole(["admin", "it"]),
  EventController.updateEventStatus
);

module.exports = router;
