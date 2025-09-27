  // server.js
  require("dotenv").config();
  const express = require("express");
  const mongoose = require("mongoose");
  const path = require("path");
  const cors = require("cors");

  const authRoutes = require("./routes/auth");
  const userRoutes = require("./routes/users");

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static frontend
  app.use(express.static(path.join(__dirname, "public")));

  // API routes
  app.use("/api", authRoutes);
  app.use("/api/users", userRoutes);

  // connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
      );
    })
    .catch((err) => {
      console.error("MongoDB connection error", err);
    });
    8917685622