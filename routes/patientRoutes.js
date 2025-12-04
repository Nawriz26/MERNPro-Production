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
/**
 * patientRoutes.js
 * -----------------
 * Express routing layer for patient-related operations.
 *
 * Base URL: /api/patients
 */

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

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
    protect,
    getPatients
  )
  .post(
    protect,
    requireRole("admin", "receptionist"),
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
 * ------------------------------------------ */
router.post(
  "/:id/attachments",
  protect,
  requireRole("admin", "dentist", "receptionist"),
  upload.single("file"),
  async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      patient.attachments.push({
        filename: req.file.filename,
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

/* --------------------------------------------
 *   List Attachments: GET /api/patients/:id/attachments
 * ------------------------------------------ */
router.get(
  "/:id/attachments",
  protect,
  requireRole("admin", "dentist", "receptionist"),
  async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json({ attachments: patient.attachments });
    } catch (err) {
      console.error("Get attachments error:", err);
      res.status(500).json({ message: "Failed to load attachments" });
    }
  }
);

/* --------------------------------------------
 *   Delete Attachment:
 *   DELETE /api/patients/:id/attachments/:attachmentId
 * ------------------------------------------ */
router.delete(
  "/:id/attachments/:attachmentId",
  protect,
  requireRole("admin", "dentist"),
  async (req, res) => {
    try {
      const { id, attachmentId } = req.params;

      const patient = await Patient.findById(id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Find the attachment subdocument
      const attachment = patient.attachments.id(attachmentId);
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }

      // Try to delete the physical file (best-effort)
      const filePath = path.join("uploads", attachment.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn("Could not delete file from disk:", filePath, err.message);
        }
      });

      // Remove from MongoDB array
      attachment.remove();
      await patient.save();

      res.json({
        message: "Attachment deleted",
        attachments: patient.attachments,
      });
    } catch (err) {
      console.error("Delete attachment error:", err);
      res.status(500).json({ message: "Failed to delete attachment" });
    }
  }
);

export default router;
