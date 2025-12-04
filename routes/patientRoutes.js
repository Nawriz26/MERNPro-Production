/**
 * patientRoutes.js
 * -----------------
 * Express routing layer for patient-related operations.
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

/* Multer storage for /uploads folder */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // <-- this folder must exist on Render
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

/* CRUD routes */

router
  .route("/")
  .get(protect, getPatients)
  .post(
    protect,
    requireRole("admin", "receptionist"),
    createPatient
  );

router
  .route("/:id")
  .get(protect, getPatient)
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

/* ✅ Upload attachment */
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

/* ✅ Delete attachment */
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

      // Remove attachment from array
      const before = patient.attachments.length;
      patient.attachments = patient.attachments.filter(
        (att) => att._id.toString() !== attachmentId
      );

      if (patient.attachments.length === before) {
        return res.status(404).json({ message: "Attachment not found" });
      }

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
