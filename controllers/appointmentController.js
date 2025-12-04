/**
 * appointmentController.js
 * -------------------------
 * Handles all CRUD operations for Appointments.
 *
 * Responsibilities:
 * - Fetch all appointments for the authenticated user
 * - Create an appointment linking patientId → Patient record
 * - Update appointment details and re-link patient if changed
 * - Delete appointments owned by the authenticated user
 *
 * Security:
 * - All routes require authentication (req.user populated via authMiddleware)
 * - Each update/delete checks appointment ownership
 */

import asyncHandler from 'express-async-handler';
import Appointment from '../models/appointmentModel.js';
import Patient from '../models/patient.js';

/**
 * @desc   Get all appointments for logged-in user
 * @route  GET /api/appointments
 * @access Private
 */
export const getAppointments = async (req, res) => {
  try {
    // All staff see everything.
    const appointments = await Appointment.find()
      .populate("patientId", "name email phone") // if patientId is referenced
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    console.error("getAppointments error:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/**
 * @desc   Create a new appointment
 * @route  POST /api/appointments
 * @access Private
 */
export const createAppointment = asyncHandler(async (req, res) => {
  const { patientId, date, time, reason, status } = req.body;

  // Ensure required fields
  if (!patientId || !date || !time) {
    res.status(400);
    throw new Error('patientId, date and time are required');
  }

  // Validate patientId exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found for given patientId');
  }

  // Create new appointment
  const appointment = await Appointment.create({
    patientId,
    patientName: patient.name, // denormalized for easy display
    date,
    time,
    reason,
    status: status || 'Scheduled',
    user: req.user._id, // link appointment to logged-in user
  });

  res.status(201).json(appointment);
});

/**
 * @desc   Update an appointment
 * @route  PUT /api/appointments/:id
 * @access Private
 */
export const updateAppointment = asyncHandler(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);

  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Ensure the appointment belongs to this user
  if (appt.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this appointment');
  }

  const { patientId, date, time, reason, status } = req.body;

  // If patientId changed → revalidate + update patientName
  if (patientId && patientId !== appt.patientId.toString()) {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404);
      throw new Error('Patient not found for given patientId');
    }
    appt.patientId = patientId;
    appt.patientName = patient.name;
  }

  // Update fields only if provided
  appt.date = date ?? appt.date;
  appt.time = time ?? appt.time;
  appt.reason = reason ?? appt.reason;
  appt.status = status ?? appt.status;

  const updated = await appt.save();
  res.json(updated);
});

/**
 * @desc   Delete an appointment
 * @route  DELETE /api/appointments/:id
 * @access Private
 */
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);

  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Only owner can delete
  if (appt.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this appointment');
  }

  await appt.deleteOne();
  res.json({ message: 'Appointment removed' });
});
