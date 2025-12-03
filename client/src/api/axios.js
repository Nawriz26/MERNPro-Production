/**
 * Axios Instance for MERNPro Dental Clinic
 * ---------------------------------------
 * - Sets baseURL to '/api' to use CRA proxy → backend at localhost:4000
 * - Automatically attaches JWT token (if exists) using Axios interceptors
 * - Ensures all protected routes send Authorization headers
 */

import axios from 'axios';

// Create axios client for API requests
const api = axios.create({
  baseURL: '/api', // CRA proxy → http://localhost:4000/api
});

// Attach JWT token on every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Add Authorization header only if token exists
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
