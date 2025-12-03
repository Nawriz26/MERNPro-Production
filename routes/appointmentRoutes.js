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

import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------------------
 *   Apply authentication to ALL appointment routes
 * --------------------------------------------
 * Every endpoint below this line requires a
 * valid JWT and a resolved req.user.
 * ------------------------------------------ */
router.use(protect);

/* --------------------------------------------
 *   ROUTES: /api/appointments
 * ------------------------------------------ */

// GET /api/appointments
//   → List appointments (all authenticated users)
// POST /api/appointments
//   → Create new appointment (admin, dentist, receptionist)
router
  .route("/")
  .get(
    getAppointments // 📄 Get all appointments (scope enforced in controller if needed)
  )
  .post(
    requireRole("admin", "dentist", "receptionist"), // 👩‍⚕️ Staff who can schedule
    createAppointment
  );

/* --------------------------------------------
 *   ROUTES: /api/appointments/:id
 * ------------------------------------------ */

// PUT /api/appointments/:id
//   → Update appointment (admin, dentist, receptionist)
// DELETE /api/appointments/:id
//   → Delete appointment (admin, dentist)
router
  .route("/:id")
  .put(
    requireRole("admin", "dentist", "receptionist"), // ✏️ Modify appointment details
    updateAppointment
  )
  .delete(
    requireRole("admin", "dentist"), // ❌ Only admin + dentist can delete
    deleteAppointment
  );

export default router;
