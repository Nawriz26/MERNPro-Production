/**
 * patient.js
 * ----------
 * Defines the Patient schema for the MERNPro Dental Clinic application.
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
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    dateOfBirth: Date,
    address: String,
    notes: String,

    // 🔐 Attachments such as X-rays / reports
    attachments: [
      {
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Patient", patientSchema);
