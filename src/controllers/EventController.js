// src/controllers/EventController.js
const Event = require("../models/Event");

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, date, rundown } = req.body;

  try {
    const newEvent = new Event({
      title,
      date,
      rundown,
      createdBy: req.user.id, // Add the user ID from JWT token
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "username"); // Populate createdBy with user data
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, date, rundown } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, date, rundown },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res
      .status(200)
      .json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
