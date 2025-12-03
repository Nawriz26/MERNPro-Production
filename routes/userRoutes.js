/**
 * userRoutes.js
 * --------------
 * Defines user authentication and profile management routes.
 *
 * Route prefix: /api/users
 *
 * Endpoints:
 * - POST /register → Register new user
 * - POST /login    → Authenticate + return JWT
 * - PUT  /profile  → Update logged-in user's profile (protected)
 *
 * Profile update:
 * - Requires valid JWT
 * - Allows updating username, email, and password
 */

import express from "express";
import {
  register,
  login,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post("/register", register); // Create new account
router.post("/login", login);       // Login + return JWT

// Private route for updating profile
router.put("/profile", protect, updateUserProfile);

export default router;
