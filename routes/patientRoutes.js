/**
 * patientRoutes.js
 * -----------------
 * Defines Express routes to manage patient records.
 *
 * Route prefix: /api/patients
 *
 * Responsibilities:
 * - GET    /        → List all patients
 * - POST   /        → Create a patient
 * - GET    /:id     → Get single patient details
 * - PUT    /:id     → Update patient record
 * - DELETE /:id     → Remove a patient
 *
 * Security:
 * - All routes require authentication using protect middleware.
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

// /api/patients
router
  .route("/")
  .get(protect, getPatients)     // All patients
  .post(protect, createPatient); // Create new patient

// /api/patients/:id
router
  .route("/:id")
  .get(protect, getPatient)      // Find patient by ID
  .put(protect, updatePatient)   // Update patient record
  .delete(protect, deletePatient); // Delete patient record

export default router;
