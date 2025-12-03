/**
 * appointmentModel.js
 * --------------------
 * Defines the Appointment schema for the MERNPro Dental Clinic application.
 *
 * Responsibilities:
 * - Stores appointment scheduling information
 * - Links appointments to a specific patient (patientId)
 * - Stores patientName redundantly for fast access & stable UI display
 * - Links appointment to the authenticated User who created it
 *
 * Fields:
 * - patientId: ObjectId → references Patient collection
 * - patientName: string copy of patient's name (denormalized)
 * - date, time, reason, status: appointment details
 * - user: ObjectId → references User who owns/created this appointment
 *
 * Notes:
 * - Status is restricted to 3 values: Scheduled, Completed, Cancelled
 * - timestamps option automatically adds createdAt + updatedAt fields
 */

import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    // References Patient collection: allows joining with populate()
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },

    // Denormalized name so UI does not break if patient is deleted/renamed
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    // The appointment date (YYYY-MM-DD)
    date: {
      type: Date,
      required: true,
    },

    // The time string (ex: "14:30")
    time: {
      type: String,
      required: true,
    },

    // Reason for the visit (optional)
    reason: {
      type: String,
      trim: true,
    },

    // Appointment status
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },

    // The authenticated user who created this appointment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
