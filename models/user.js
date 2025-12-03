/**
 * user.js
 * -------
 * Defines the User schema for the MERNPro Dental Clinic application.
 *
 * Responsibilities:
 * - Stores authentication credentials (username, email, password)
 * - Supports password hashing + comparison
 * - Assigns user roles (admin or staff)
 *
 * Security:
 * - Passwords are automatically hashed using bcrypt in pre-save hook
 * - comparePassword() is used during login to verify credentials
 *
 * Fields:
 * - username: unique, trimmed
 * - email   : unique, lowercased
 * - password: hashed string
 * - role    : "admin" or "staff" (default: staff)
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },

    password: { 
      type: String, 
      required: true 
    },

    role: { 
      type: String, 
      enum: ["admin", "staff"], 
      default: "staff" 
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

/**
 * Pre-save hook:
 * Automatically hashes password *only if modified*.
 */
userSchema.pre("save", async function (next) {
  // If password was not changed → skip hashing
  if (!this.isModified("password")) return next();

  // Hash the password with bcrypt salt rounds = 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Compare a login password (candidate) with stored hash.
 * Used in the login controller.
 */
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
