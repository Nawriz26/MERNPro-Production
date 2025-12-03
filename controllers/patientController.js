/**
 * patientController.js
 * ---------------------
 * Handles CRUD operations for Patient records.
 *
 * Responsibilities:
 * - Retrieve patient list or a single patient
 * - Create a new patient
 * - Update patient fields
 * - Delete patient record
 *
 * Notes:
 * - This controller does NOT filter by user; all patients are shared.
 * - Part 4 could optionally assign patients per user.
 */

import Patient from "../models/patient.js";

/**
 * @desc   Get all patients
 * @route  GET /api/patients
 * @access Private
 */
export const getPatients = async (_req, res, next) => {
  try {
    const list = await Patient.find().sort({ createdAt: -1 }); // newest first
    res.json(list);
  } catch (e) {
    next(e);
  }
};

/**
 * @desc   Get a single patient by id
 * @route  GET /api/patients/:id
 * @access Private
 */
export const getPatient = async (req, res, next) => {
  try {
    const p = await Patient.findById(req.params.id);
    if (!p) {
      res.status(404);
      throw new Error("Patient not found");
    }
    res.json(p);
  } catch (e) {
    next(e);
  }
};

/**
 * @desc   Create a new patient
 * @route  POST /api/patients
 * @access Private
 */
export const createPatient = async (req, res, next) => {
  try {
    const created = await Patient.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    // Handle duplicate email (MongoDB error code 11000)
    if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
      res.status(400);
      return next(new Error("A patient with this email already exists."));
    }
    next(e);
  }
};


/**
 * @desc   Update patient info
 * @route  PUT /api/patients/:id
 * @access Private
 */
export const updatePatient = async (req, res, next) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error("Patient not found");
    }

    res.json(updated);
  } catch (e) {
    if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
      res.status(400);
      return next(new Error("A patient with this email already exists."));
    }
    next(e);
  }
};


/**
 * @desc   Delete a patient
 * @route  DELETE /api/patients/:id
 * @access Private
 */
export const deletePatient = async (req, res, next) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404);
      throw new Error("Patient not found");
    }

    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
};
