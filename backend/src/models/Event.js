// src/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  rundown: [
    {
      time: String,
      activity: String,
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to user who created the event
});

module.exports = mongoose.model("Event", eventSchema);
