/**
 * AuthContext.jsx
 * ----------------
 * Provides global authentication state across the MERNPro Dental app.
 *
 * Responsibilities:
 * - Stores `user` and `token` in React state and localStorage
 * - Handles login, signup, logout
 * - Updates user profile and syncs it with localStorage
 * - Makes authenticated data available through `useAuth()`
 *
 * Notes:
 * - Works with Axios interceptor to attach JWT automatically
 * - Decouples UI from backend authentication details
 */

import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

// Create context and custom hook
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  // Load initial user and token from localStorage on first render
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  /**
   * Login with email/username + password
   * Saves user + token to state + localStorage
   */
  const login = async (emailOrUsername, password) => {
    const { data } = await api.post('/users/login', { emailOrUsername, password });

    setUser(data.user);
    setToken(data.token);

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  /**
   * Signup new user and store credentials
   */
  const signup = async (payload) => {
    const { data } = await api.post('/users/register', payload);

    setUser(data.user);
    setToken(data.token);

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  /**
   * Logout clears both local state + localStorage
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  /**
   * Update user info after profile changes
   * Keeps UI (like Navbar) in sync with backend.
   */
  const updateUserFromProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  useEffect(() => {
    // Future improvement: add auto-logout on token expiry
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, updateUserFromProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
