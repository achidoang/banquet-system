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
      rundowns, // Rundowns diterima dari body request
      jobdesks, // Jobdesks diterima dari body request
    });

    await event.save();

    return res
      .status(201)
      .json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Server error" });
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

// Upload Images to Jobdesk
exports.uploadImagesToJobdesk = async (req, res) => {
  try {
    const { id, jobdeskId } = req.params;
    const event = await Event.findById(id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    const jobdesk = event.jobdesks.id(jobdeskId);
    if (!jobdesk) return res.status(404).json({ message: "Jobdesk not found" });

    const processedImages = await Promise.all(
      req.files.map(async (file) => {
        const imageBuffer = await processImage(file.buffer);
        const imageUrl = `/uploads/jobdesk_images/${Date.now()}-${
          file.originalname
        }`;
        await sharp(imageBuffer).toFile(`./public${imageUrl}`); // Save to /public/uploads
        return imageUrl;
      })
    );

    // Add image URLs to the jobdesk
    jobdesk.image_urls = [...(jobdesk.image_urls || []), ...processedImages];
    await event.save();

    res.status(200).json({ message: "Images uploaded successfully", jobdesk });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Server error" });
  }
};
