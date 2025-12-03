/**
 * userController.js
 * ------------------
 * Handles all user authentication + profile management logic.
 *
 * Responsibilities:
 * - Register new users
 * - Login existing users
 * - Update logged-in user's profile (username, email, password)
 *
 * Security:
 * - Registration checks for duplicate users
 * - Login validates password using User.comparePassword()
 * - Profile updates require authentication (req.user injected by authMiddleware)
 */

import asyncHandler from 'express-async-handler';
import User from "../models/user.js";
import { signToken } from "../utils/token.js";

/**
 * @desc   Register a new user
 * @route  POST /api/users/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if username or email already exists
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Create new user
    const user = await User.create({ username, email, password, role });

    // Generate JWT
    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({
      token,
      user: { id: user._id, username, email, role: user.role },
    });
  } catch (e) {
    next(e);
  }
};

/**
 * @desc   Login a user with email OR username
 * @route  POST /api/users/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Find user by email OR username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    // Validate credentials
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = signToken({ id: user._id, role: user.role });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
};

/**
 * @desc   Update logged-in user's profile
 * @route  PUT /api/users/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // from authMiddleware

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update allowed fields
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  // Change password (if provided)
  if (req.body.password) {
    user.password = req.body.password; // will be hashed in pre-save middleware
  }

  const updatedUser = await user.save();

  // Return updated profile to frontend
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

export {
  register,
  login,
  updateUserProfile,
};
