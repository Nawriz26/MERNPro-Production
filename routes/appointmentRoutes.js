/**
 * appointmentRoutes.js
 * ---------------------
 * Defines Express routes for Appointment CRUD operations.
 *
 * Route prefix: /api/appointments
 *
 * Responsibilities:
 * - All routes protected using authMiddleware (router.use(protect))
 * - GET    /        → Fetch all appointments
 * - POST   /        → Create new appointment
 * - PUT    /:id     → Update appointment by ID
 * - DELETE /:id     → Delete appointment by ID
 *
 * Role-based rules:
 * - Create / Update: admin, dentist, receptionist
 * - Delete         : admin, dentist, receptionist   ✅ updated
 */

import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication to ALL appointment routes
router.use(protect);

// /api/appointments  → list + create
router
  .route("/")
  .get(
    // All authenticated roles can view appointments
    getAppointments
  )
  .post(
    // Only staff roles can create appointments
    requireRole("admin", "dentist", "receptionist"),
    createAppointment
  );

// /api/appointments/:id → update + delete
router
  .route("/:id")
  .put(
    // Only staff roles can update appointments
    requireRole("admin", "dentist", "receptionist"),
    updateAppointment
  )
  .delete(
    // ✅ Now admin, dentist, receptionist can delete
    requireRole("admin", "dentist", "receptionist"),
    deleteAppointment
  );

export default router;
