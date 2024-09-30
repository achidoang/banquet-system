// src/controllers/EventController.js
const Event = require("../models/Event");
const { processImage } = require("../middleware/uploadImage");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const {
      ref_no,
      deposit_received,
      booking_by,
      billing_address,
      start_date,
      end_date,
      pax,
      venue,
      sales_in_charge,
      contact_person,
      list_event,
      status,
      note,
      rundowns,
      jobdesks,
    } = req.body;

    // Parse jobdesks dan rundowns jika dikirim dalam bentuk string (misalnya via form-data)
    const parsedJobdesks = JSON.parse(jobdesks);
    const parsedRundowns = JSON.parse(rundowns); // Tambahkan parsing untuk rundowns

    // Ambil path dari gambar yang diupload
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`); // Simpan relative path

    // Tambahkan image URLs ke jobdesk
    const jobdesksWithImages = parsedJobdesks.map((jobdesk) => {
      return {
        ...jobdesk,
        image_urls: imagePaths, // Tambahkan relative URL ke setiap jobdesk
      };
    });

    // Membuat Event baru dengan Rundowns dan Jobdesks
    const event = new Event({
      ref_no,
      deposit_received,
      booking_by,
      billing_address,
      start_date,
      end_date,
      pax,
      venue,
      sales_in_charge,
      contact_person,
      list_event,
      status,
      note,
      rundowns: parsedRundowns, // Rundowns yang sudah diparse
      jobdesks: jobdesksWithImages, // Jobdesk dengan relative image URLs
    });

    await event.save();

    return res
      .status(201)
      .json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get all Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
};

// Get Single Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch event", error: error.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update event", error: error.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete event", error: error.message });
  }
};

// Update status of an event
exports.updateEventStatus = async (req, res) => {
  const { status, note } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = status;
    event.note = note; // Update the note as well
    await event.save();

    res.status(200).json({ message: "Status updated successfully", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};
