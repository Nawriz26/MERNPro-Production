import dotenv from "dotenv";
import path from "path";
import express from "express";
import { connectDB } from "./config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

// Resolve project root (needed for static /uploads path)
const __dirname = path.resolve();

// Serve uploaded files as static assets
// e.g. http://localhost:4000/uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err.message);
    process.exit(1);
  });
