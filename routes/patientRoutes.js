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
 * Security:
 * - All routes require authentication (protect middleware)
 * - Mutating routes require certain roles (requireRole)
 *
 * Endpoints:
 *   GET    /                 → List all patients (all authenticated roles)
 *   POST   /                 → Create new patient (admin, receptionist)
 *
 *   GET    /:id              → Get single patient details
 *   PUT    /:id              → Update patient record (admin, receptionist)
 *   DELETE /:id              → Delete patient (admin only)
 *
 *   POST   /:id/attachments  → Upload X-rays or other attachments
 */

import express from "express";
import multer from "multer";
import path from "path";

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
 *   Multer Configuration for File Uploads
 * --------------------------------------------
 * Files are saved to /uploads folder with unique
 * timestamps to avoid collisions.
 * ------------------------------------------ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

/* --------------------------------------------
 *   ROUTES: /api/patients
 * ------------------------------------------ */

// GET /api/patients → List all patients
// POST /api/patients → Create new patient
router
  .route("/")
  .get(
    protect, // 🔐 Must be logged in
    getPatients // 📄 List patients
  )
  .post(
    protect, // 🔐 Must be logged in
    requireRole("admin", "receptionist"), // 👩‍⚕️ Only admin/receptionist can create
    createPatient
  );

// GET /api/patients/:id → Get single patient
// PUT /api/patients/:id → Update patient
// DELETE /api/patients/:id → Delete patient (admin only)
router
  .route("/:id")
  .get(
    protect, // 🔐 Must be logged in
    getPatient // 📄 Get single patient
  )
  .put(
    protect,
    requireRole("admin", "receptionist"), // ✏️ Update allowed for admin/receptionist
    updatePatient
  )
  .delete(
    protect,
    requireRole("admin"), // ❌ Only admin can delete
    deletePatient
  );

/* --------------------------------------------
 *   File Upload: POST /api/patients/:id/attachments
 * --------------------------------------------
 * Uploads dental files (X-rays, reports, etc.)
 * and attaches metadata to the patient record.
 * ------------------------------------------ */
router.post(
  "/:id/attachments",
  protect,
  requireRole("admin", "dentist", "receptionist"), // 📎 Staff with access
  upload.single("file"), // Handle single file upload from field name "file"
  async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Append new attachment metadata to array
      patient.attachments.push({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        // uploadedAt will auto default in schema
      });

      await patient.save();

      res.status(201).json({
        message: "File uploaded",
        attachments: patient.attachments,
      });
    } catch (err) {
      console.error("Attachment upload error:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;
