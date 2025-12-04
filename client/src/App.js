/**
 * App.js
 * ------
 * Main application component.
 *
 * Responsibilities:
 * - Wraps global providers (DarkMode, Auth, Patient)
 * - Defines routing structure using react-router-dom
 * - Applies PrivateRoute protection to secured pages
 * - Renders shared Navbar + ToastContainer globally
 *
 * Notes:
 * - Public routes:  /, /login, /signup
 * - Protected routes: /dashboard, /profile, /appointments, /calendar
 *   (actual role-based visibility for links is handled in Navbar + backend)
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from './context/AuthContext';
import PatientProvider from './context/PatientContext';
import DarkModeProvider from './context/DarkModeContext';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Routes - Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Appointments from './pages/Appointments';
import Calendar from './pages/Calendar'; // Calendar page for appointments view

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <PatientProvider>
          <BrowserRouter>
            {/* Global top navigation (visible on all pages) */}
            <Navbar />

            {/* Global toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
              theme="colored"
            />

            {/* Route definitions */}
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* PROTECTED ROUTES (must be logged in) */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/appointments" element={<Appointments />} />
                {/* Calendar route – protected. Role-based access is enforced on backend + Navbar */}
                <Route path="/calendar" element={<Calendar />} />
              </Route>

              {/* FALLBACK 404 PAGE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PatientProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}
