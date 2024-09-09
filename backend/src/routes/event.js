// src/routes/event.js
const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");
const { verifyToken, verifyIT, verifyAdmin } = require("../middleware/auth");

// // Routes for Event management
// router.post("/", verifyToken, verifyAdmin, EventController.createEvent);
// router.get("/", verifyToken, EventController.getEvents);
// router.put("/:eventId", verifyToken, verifyAdmin, EventController.updateEvent);
// router.delete(
//   "/:eventId",
//   verifyToken,
//   verifyAdmin,
//   EventController.deleteEvent
// );

// Get all events with pagination and sorting
router.get("/", verifyToken, EventController.getEvents);

module.exports = router;
