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
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    phone: {
      type: String,
      required: true,
      match: /^\d{3}-\d{3}-\d{4}$/,
    },

    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value < new Date();
        },
        message: "Date of birth must be before today",
      },
    },

    address: {
      type: String,
      required: true,
    },

    notes: String,

    // Attachments such as X-rays / reports
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
