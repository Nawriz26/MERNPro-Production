/**
 * patient.js
 * ----------
 * Defines the Patient schema for the MERNPro Dental Clinic application.
 *
 * Responsibilities:
 * - Stores core patient demographics and contact information
 * - Provides base fields for patient management features
 *
 * Fields:
 * - name       : Full patient name
 * - email      : Unique email address (lowercased automatically)
 * - phone      : Contact number
 * - dateOfBirth: Optional birthdate
 * - address    : Optional text address
 * - notes      : Optional notes or medical remarks
 *
 * Notes:
 * - timestamps enables createdAt + updatedAt fields
 */

import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name:  { 
      type: String, 
      required: true, 
      trim: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true, // ensures uniformity
    },

    phone: { 
      type: String, 
      required: true 
    },

    dateOfBirth: Date,    // optional

    address: String,      // optional

    notes: String         // optional
  },
  {
    timestamps: true, // adds createdAt + updatedAt fields
  }
);

export default mongoose.model("Patient", patientSchema);
