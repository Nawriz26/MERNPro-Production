/**
 * appointmentRoutes.js
 * ---------------------
 * Express routes for Appointment CRUD operations.
 *
 * Base URL: /api/appointments
 *
 * Features:
 * - Full CRUD for appointment records
 * - Role-based access control (Admin / Dentist / Receptionist)
 *
 * Security:
 * - All routes require authentication (protect middleware)
 * - Mutating routes are restricted by role (requireRole)
 *
 * Endpoints:
 *   GET    /           → List appointments (all authenticated users)
 *   POST   /           → Create new appointment (admin, dentist, receptionist)
 *
 *   PUT    /:id        → Update appointment (admin, dentist, receptionist)
 *   DELETE /:id        → Delete appointment (admin, dentist)
 *
 * Notes:
 * - Any additional ownership checks can be enforced in appointmentController
 */
// routes/appointmentRoutes.js

import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All appointment routes require authentication
router.use(protect);

// /api/appointments  → list + create
router
  .route("/")
  .get(
    requireRole("admin", "dentist", "receptionist"), // 👀 staff can view all
    getAppointments
  )
  .post(
    requireRole("admin", "dentist", "receptionist"), // 📝 staff can create
    createAppointment
  );

// /api/appointments/:id → update + delete
router
  .route("/:id")
  .put(
    requireRole("admin", "dentist", "receptionist"), // ✏ staff can update
    updateAppointment
  )
  .delete(
    requireRole("admin", "dentist"),                 // ❌ only admin/dentist delete
    deleteAppointment
  );

export default router;
