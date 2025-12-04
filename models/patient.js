/**
 * patient.js
 * ----------
 * Defines the Patient schema for the MERNPro Dental Clinic application.
 *
 * Responsibilities:
 * - Stores core patient demographics and contact information
 * - Stores any uploaded dental attachments (e.g. X-rays) directly in MongoDB
 *
 * Notes:
 * - attachments[] stores file data as a Buffer plus metadata
 * - Keep file sizes small (< 16MB) to stay under MongoDB document limits
 */

import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // ensures uniformity
    },

    phone: {
      type: String,
      required: true,
    },

    dateOfBirth: Date, // optional
    address: String,   // optional
    notes: String,     // optional

    // 🔹 Attachments stored directly in MongoDB (Buffer)
    attachments: [
      {
        data: Buffer,                 // binary file data
        originalName: String,         // e.g. "xray-2025-12.png"
        mimeType: String,             // e.g. "image/png"
        size: Number,                 // bytes
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt + updatedAt fields
  }
);

export default mongoose.model("Patient", patientSchema);
