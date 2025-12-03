/**
 * authMiddleware.js
 * ------------------
 * Protects private API routes using JWT authentication.
 *
 * Responsibilities:
 * - Extracts JWT token from Authorization header: "Bearer <token>"
 * - Verifies the token using JWT_SECRET
 * - Decodes user ID from token
 * - Loads the corresponding user from MongoDB (without password)
 * - Attaches user object to req.user
 * - Blocks access when token is missing, invalid, or belongs to a deleted user
 *
 * Used in:
 * - User profile updates
 * - Appointments CRUD
 * - Any route wrapped with router.use(protect)
 */

import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * @desc   Middleware to protect routes (requires authentication)
 * @route  Applied to any route using protect()
 * @access Private
 */
export const protect = async (req, res, next) => {
  let token = null;

  // Check for Authorization header → "Bearer token"
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token found
  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user from database (excluding password field)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      throw new Error("User not found");
    }

    // Proceed to protected route
    next();
  } catch {
    // Token invalid or verification failed
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};
