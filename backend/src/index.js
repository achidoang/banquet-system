// src/index.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const path = require("path");
const eventRoutes = require("./routes/event");
const userRoutes = require("./routes/user");
const emailRoutes = require("./routes/email");
const cors = require("cors");
const https = require("https"); // Tambahkan ini
const fs = require("fs"); // Tambahkan ini untuk membaca sertifikat SSL

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.0.109:3000",
    "https://banquet-system.vercel.app",
  ], // Pisahkan dengan tanda koma
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();

// Middleware
app.use(express.json()); // To parse JSON body requests

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

app.use(cors(corsOptions));
app.options("*", cors());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes); // Add event routes
app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Sertifikat SSL
const httpsOptions = {
  key: fs.readFileSync("server.key"), // Kunci SSL
  cert: fs.readFileSync("server.cert"), // Sertifikat SSL
};

// Start the server
const PORT = process.env.PORT || 5000;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
