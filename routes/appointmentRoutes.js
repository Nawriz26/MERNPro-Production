/**
 * appointmentRoutes.js
 * ---------------------
 * Defines Express routes for Appointment CRUD operations.
 *
 * Route prefix: /api/appointments
 *
 * Responsibilities:
 * - All routes protected using authMiddleware (router.use(protect))
 * - GET    /        → Fetch all appointments for logged-in user
 * - POST   /        → Create new appointment
 * - PUT    /:id     → Update appointment by ID
 * - DELETE /:id     → Delete appointment by ID
 *
 * Notes:
 * - Ownership checks are handled inside appointmentController
 */

import express from 'express';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication to ALL appointment routes
router.use(protect);

// /api/appointments  → list + create
router
  .route('/')
  .get(getAppointments)      // Get all appointments for current user
  .post(createAppointment);  // Create appointment

// /api/appointments/:id → update + delete
router
  .route('/:id')
  .put(updateAppointment)     // Update specific appointment
  .delete(deleteAppointment); // Delete appointment

export default router;
