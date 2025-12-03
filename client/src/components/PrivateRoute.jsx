/**
 * PrivateRoute Component
 * ----------------------
 * - Wrapper for protecting routes that require authentication.
 * - Uses React Router's <Outlet /> to render child routes when user is logged in.
 * - If no user is present in AuthContext, redirects to /login.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { user } = useAuth(); // current logged-in user (or null)

  // If user exists, render nested route(s); otherwise redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
