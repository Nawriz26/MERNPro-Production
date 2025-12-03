/**
 * errorMiddleware.js
 * --------------------
 * Global error-handling utilities for Express.
 *
 * Middleware included:
 * 1. notFound  → Handles routes that do not exist
 * 2. errorHandler → Formats and returns all API errors
 *
 * Features:
 * - Sends proper HTTP status codes
 * - Provides detailed stack traces in development
 * - Protects stack output in production
 *
 * Used in:
 * - server.js (after all routes)
 */

/**
 * @desc   Middleware for unknown routes (404)
 * @route  Any unmatched route
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // forward error to main handler
};

/**
 * @desc   Global Express error handler
 * @route  Applies to all errors thrown in controllers/routes
 */
export const errorHandler = (err, req, res, _next) => {
  // If status code not set, default to 500 (server error)
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    // Show real stack only in development mode
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};
