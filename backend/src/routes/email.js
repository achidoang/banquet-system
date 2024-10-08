// backend/routes/email.js

const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const { User } = require("../models/User"); // Assuming you have a User model for storing emails
console.log(User); // Tambahkan ini untuk memeriksa apakah `User` didefinisikan dengan benar

// Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "it.department.rai@gmail.com",
    pass: "itrai1963",
  },
  debug: true, // Tambahkan debug
  logger: true, // Log semua aktivitas
});

router.post("/send-emails", async (req, res) => {
  try {
    // Fetch semua email user
    const users = await User.find({}, "email");
    const recipientEmails = users.map((user) => user.email);

    // Jika tidak ada user
    if (recipientEmails.length === 0) {
      return res.status(400).send("No recipients found");
    }

    // Email options
    const mailOptions = {
      from: "it.department.rai@gmail.com",
      to: recipientEmails,
      subject: "New Event Created",
      text: "A new event has been created. Please check the details.",
      html: "<h1>New Event Created</h1><p>Please check the event details in your dashboard.</p>",
    };

    // Kirim email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Emails sent successfully");
  } catch (error) {
    console.error("Error while sending emails:", error.message); // Tambahkan logging error
    res.status(500).send("Error sending emails");
  }
});

module.exports = router;
