/**
 * AuthContext.jsx
 * ----------------
 * Provides global authentication state across the MERNPro Dental app.
 *
 * Responsibilities:
 * - Stores `user` (including role) and `token` in React state and localStorage
 * - Handles login, signup, logout
 * - Updates user profile and keeps Navbar / UI in sync
 * - Makes authenticated data available through `useAuth()`
 *
 * Notes:
 * - Expects backend to return { user: { _id, username, email, role }, token }
 * - Works with Axios interceptor to attach JWT automatically
 * - Decouples UI from backend authentication details
 */

import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

// Create context and custom hook
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  // Load initial user and token from localStorage on first render
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  /**
   * Normalizes the user object to ensure consistent shape.
   * Guarantees that `role` is always present (fallback: 'receptionist').
   */
  const normalizeUser = (rawUser) => {
    if (!rawUser) return null;
    return {
      _id: rawUser._id,
      username: rawUser.username,
      email: rawUser.email,
      role: rawUser.role || 'receptionist', // default role if missing
    };
  };

  /**
   * Login with email/username + password.
   * Saves user + token to state + localStorage.
   */
  const login = async (emailOrUsername, password) => {
    const { data } = await api.post('/users/login', { emailOrUsername, password });
    // Expecting data = { user: {...}, token: "..." }
    const normalized = normalizeUser(data.user);

    setUser(normalized);
    setToken(data.token);

    localStorage.setItem('user', JSON.stringify(normalized));
    localStorage.setItem('token', data.token);
  };

  /**
   * Signup new user and store credentials.
   * Backend should assign a default role or one from payload.
   */
  const signup = async (payload) => {
    const { data } = await api.post('/users/register', payload);
    const normalized = normalizeUser(data.user);

    setUser(normalized);
    setToken(data.token);

    localStorage.setItem('user', JSON.stringify(normalized));
    localStorage.setItem('token', data.token);
  };

  /**
   * Logout clears both local state + localStorage.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  /**
   * Update user info after profile changes.
   * Merges partial updates (e.g., username/email) with existing user,
   * so we don't accidentally drop fields like `role` or `_id`.
   */
  const updateUserFromProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...(updatedFields || {}) };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, updateUserFromProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}