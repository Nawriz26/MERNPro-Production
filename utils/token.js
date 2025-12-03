/**
 * token.js
 * --------
 * Utility module for generating JWT tokens.
 *
 * Responsibilities:
 * - Wraps jwt.sign() to create tokens for authenticated users
 * - Reads JWT secret & expiration time from environment variables
 *
 * Environment Variables:
 * - JWT_SECRET   : Secret key used to sign the token
 * - JWT_EXPIRES  : Optional expiration duration (e.g., "1d", "7d")
 *
 * Used In:
 * - userController.js → during registration and login
 */

import jwt from "jsonwebtoken";

/**
 * signToken(payload)
 * ------------------
 * Creates a signed JWT using the provided payload.
 *
 * @param {Object} payload - Data to embed inside the token (e.g., { id, role })
 * @returns {String} JWT string
 *
 * Notes:
 * - Token expires in 7 days if JWT_EXPIRES is not defined.
 * - Token is later validated inside authMiddleware.js.
 */
export const signToken = (payload) =>
  jwt.sign(
    payload,
    process.env.JWT_SECRET,             // Secret key for signing
    { expiresIn: process.env.JWT_EXPIRES || "7d" } // Default 7 days
  );
