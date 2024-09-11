// src/models/Event.js
const mongoose = require("mongoose");

// Rundown Schema
const rundownSchema = new mongoose.Schema({
  rundown_date: {
    type: Date,
    required: true,
  },
  time_start: {
    type: String,
    required: true,
  },
  time_end: {
    type: String,
    required: true,
  },
  event_activity: {
    type: String,
    required: true,
  },
});

// Jobdesk Schema
const jobdeskSchema = new mongoose.Schema({
  department_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  people_in_charge: {
    type: String,
    required: true,
  },
});

// Event Schema
const eventSchema = new mongoose.Schema(
  {
    ref_no: {
      type: String,
      required: true,
    },
    deposit_received: {
      type: String,
      required: true,
    },
    booking_by: {
      type: String,
      required: true,
    },
    billing_address: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    pax: {
      type: Number,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    sales_in_charge: {
      type: String,
      required: true,
    },
    contact_person: {
      type: String,
      required: true,
    },
    list_event: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "process", "done", "cancel"],
      default: "pending",
    },
    note: {
      type: String,
      default: "",
    },
    rundowns: [rundownSchema], // Array of Rundowns
    jobdesks: [jobdeskSchema], // Array of Jobdesks
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
