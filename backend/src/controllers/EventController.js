// src/controllers/EventController.js
const Event = require("../models/Event");
const { processImage } = require("../middleware/uploadImage");
const fs = require("fs");
const path = require("path");

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

// // Delete Event
// exports.deleteEvent = async (req, res) => {
//   try {
//     const deletedEvent = await Event.findByIdAndDelete(req.params.id);
//     if (!deletedEvent)
//       return res.status(404).json({ message: "Event not found" });
//     res.status(200).json({ message: "Event deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete event", error: error.message });
//   }
// };

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get image URLs from event
    const imageUrls = event.jobdesks.flatMap((jobdesk) => jobdesk.image_urls);

    // Remove images from the filesystem
    imageUrls.forEach((imageUrl) => {
      const fullPath = path.join(__dirname, "..", imageUrl); // Resolve the full path to the image

      // Check if the file exists and then delete
      fs.unlink(fullPath, (err) => {
        if (err) {
          // Log error if file is not found, but continue the deletion process
          console.error(`Failed to delete image at ${fullPath}:`, err.message);
        }
      });
    });

    // After deleting images, delete the event from the database
    await Event.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ message: "Event and related images deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Failed to delete event" });
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

// Delete Image
exports.deleteImages = async (req, res) => {
  const { imagesToDelete } = req.body;
  try {
    imagesToDelete.forEach((imageUrl) => {
      const imagePath = path.join(__dirname, "..", imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete image from server
      }
    });
    res.status(200).json({ message: "Images deleted successfully" });
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).json({ message: "Failed to delete images" });
  }
};
