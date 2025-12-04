/**
 * patientRoutes.js
 * -----------------
 * Express routing layer for patient-related operations.
 *
 * Base URL: /api/patients
 *
 * Features:
 * - Full CRUD for patient records
 * - Role-based access control (Admin / Dentist / Receptionist)
 * - File upload endpoint for dental attachments (X-rays, documents)
 *
 * Storage:
 * - Attachments are stored directly in MongoDB as Buffer fields on the
 *   Patient document (no local filesystem or cloud storage required).
 */

import express from "express";
import multer from "multer";

import { protect, requireRole } from "../middleware/authMiddleware.js";

import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

import Patient from "../models/patient.js";

const router = express.Router();

/* --------------------------------------------
 *   Multer Configuration for In-Memory Uploads
 * --------------------------------------------
 * Files are kept in memory (req.file.buffer) and then saved
 * directly to MongoDB as a Buffer.
 * ------------------------------------------ */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max per file (safety)
  },
});

/* --------------------------------------------
 *   ROUTES: /api/patients
 * ------------------------------------------ */

// GET /api/patients → List all patients
// POST /api/patients → Create new patient
router
  .route("/")
  .get(
    protect, // 🔐 Must be logged in
    getPatients
  )
  .post(
    protect,
    requireRole("admin", "receptionist"), // 👩‍⚕️ Only admin/receptionist can create
    createPatient
  );

// GET /api/patients/:id → Get single patient
// PUT /api/patients/:id → Update patient
// DELETE /api/patients/:id → Delete patient (admin only)
router
  .route("/:id")
  .get(
    protect,
    getPatient
  )
  .put(
    protect,
    requireRole("admin", "receptionist"),
    updatePatient
  )
  .delete(
    protect,
    requireRole("admin"),
    deletePatient
  );

/* --------------------------------------------
 *   File Upload: POST /api/patients/:id/attachments
 * --------------------------------------------
 * Uploads dental files (X-rays, reports, etc.)
 * and stores them directly in MongoDB as Buffer.
 * ------------------------------------------ */
router.post(
  "/:id/attachments",
  protect,
  requireRole("admin", "dentist", "receptionist"),
  upload.single("file"), // expects field name "file"
  async (req, res) => {
    try {
      // No file attached?
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const patient = await Patient.findById(req.params.id);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Save file data + metadata into MongoDB
      patient.attachments.push({
        data: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });

      await patient.save();

      res.status(201).json({
        message: "Attachment uploaded",
        attachments: patient.attachments,
      });
    } catch (err) {
      console.error("Attachment upload error:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;
