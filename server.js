/**
 * server.js
 * ----------
 * Entry point for the MERNPro Dental Clinic backend server.
 *
 * Responsibilities:
 * - Load environment variables
 * - Initialize Express application
 * - Connect to MongoDB
 * - Register global middleware (CORS, JSON parsing)
 * - Mount all API routes (users, patients, appointments)
 * - Provide a health-check endpoint
 * - Register 404 handler + global error handler
 * - Start the HTTP server only AFTER a successful DB connection
 *
 * Architecture:
 *  /config        → database connection
 *  /routes        → API routing layers
 *  /controllers   → business logic for each route
 *  /middleware    → authentication + error handling
 */

//////////////////////////////////////////////////////////////
// Load environment variables FIRST (before anything else)
//////////////////////////////////////////////////////////////
import dotenv from "dotenv";
dotenv.config();

//////////////////////////////////////////////////////////////
// Core server modules + DB connector
//////////////////////////////////////////////////////////////
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

//////////////////////////////////////////////////////////////
// API route modules + error handlers
//////////////////////////////////////////////////////////////
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Debug message to verify environment variables
console.log(
  "ENV loaded. PORT=",
  process.env.PORT,
  "MONGO_URI set?",
  !!process.env.MONGO_URI
);

//////////////////////////////////////////////////////////////
// Initialize Express application + core middleware
//////////////////////////////////////////////////////////////
const app = express();

app.use(cors());           // Allow frontend calls from React
app.use(express.json());   // Parse JSON bodies (req.body)

//////////////////////////////////////////////////////////////
// Health Check route — confirms backend is active
//////////////////////////////////////////////////////////////
app.get("/", (_req, res) => res.send("MERNPro Dental API is running"));

//////////////////////////////////////////////////////////////
// Validate DB URI presence before connecting
//////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 4000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set. Check your .env file.");
  process.exit(1);
}

//////////////////////////////////////////////////////////////
// Register API route prefixes
// Everything below uses modularized route handlers
//////////////////////////////////////////////////////////////
app.use("/api/users", userRoutes);         // Register/Login/Profile
app.use("/api/patients", patientRoutes);   // CRUD for patients
app.use("/api/appointments", appointmentRoutes); // CRUD for appointments

//////////////////////////////////////////////////////////////
// 404 handler → catches unmatched routes
//////////////////////////////////////////////////////////////
app.use(notFound);

//////////////////////////////////////////////////////////////
// Global error handler → formats all API errors into JSON
//////////////////////////////////////////////////////////////
app.use(errorHandler);

//////////////////////////////////////////////////////////////
// Connect to MongoDB FIRST → then start Express server
//////////////////////////////////////////////////////////////
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err.message);
    process.exit(1);
  });
