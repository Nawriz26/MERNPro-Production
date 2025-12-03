/**
 * config/db.js
 * -------------
 * Establishes MongoDB connection using Mongoose.
 *
 * Responsibilities:
 * - Reads the MongoDB connection string from process.env.MONGO_URI
 * - Attempts connection using mongoose.connect()
 * - Logs success with connected host name
 * - Logs failures with a descriptive message and terminates the process
 *
 * Used by:
 * - server.js (called before starting the Express server)
 */

import mongoose from "mongoose";

/**
 * Connect to MongoDB Atlas
 * -------------------------
 * This function is called during server startup.
 * If it fails, the backend cannot operate, so the process exits.
 */
export const connectDB = async () => {
  try {
    // Connect using MONGO_URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log connection success
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    // Log connection error for debugging
    console.error("❌ DB connection failed:", err.message);

    // Exit the process to prevent running the app without a database
    process.exit(1);
  }
};
