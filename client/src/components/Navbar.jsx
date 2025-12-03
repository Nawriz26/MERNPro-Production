/**
 * Navbar Component
 * ----------------
 * - Displays logo, navigation links, and auth actions
 * - Shows different menu items depending on login status & role
 * - Includes dark mode toggle (via DarkModeContext)
 * - Responsive: includes hamburger menu
 *
 * Role-based visibility:
 * - Dashboard: all authenticated users
 * - Appointments: admin, dentist, receptionist
 * - Calendar: admin, dentist, receptionist
 * - (Future) Admin page: admin only
 */

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../context/PatientContext';
import logo from '../assets/LogoTeam2.jpg';
import { useDarkMode } from '../context/DarkModeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { patientCount } = usePatients();
  const [isOpen, setIsOpen] = useState(false);

  const { isDark, toggleDarkMode } = useDarkMode();

  // Toggle mobile menu open/close
  const toggle = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Dynamic styling for NavLink
  const navLinkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center nav-link-animated ${
      isActive ? 'active fw-semibold text-warning' : 'text-white-50'
    }`;

  // Simple helper for RBAC checks
  const hasRole = (...roles) => user && roles.includes(user.role);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 shadow-sm">

      {/* Brand Logo + Title */}
      <Link
        className="navbar-brand d-flex align-items-center nav-brand-animated"
        to="/"
        onClick={closeMenu}
      >
        <img
          src={logo}
          alt="MERNPro Logo"
          style={{
            height: '40px',
            width: '40px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginRight: '10px',
          }}
        />
        <span className="fw-bold text-white">MERNPro Dental</span>
      </Link>

      {/* Mobile Hamburger Menu */}
      <button
        className="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        onClick={toggle}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Nav Items */}
      <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>

        {/* LEFT SIDE LINKS */}
        <ul className="navbar-nav me-auto">
          {/* Home */}
          <li className="nav-item">
            <NavLink className={navLinkClass} to="/" onClick={closeMenu}>
              <i className="bi bi-house me-1"></i> Home
            </NavLink>
          </li>

          {/* Guest-only links */}
          {!user && (
            <>
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/login" onClick={closeMenu}>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className={navLinkClass} to="/signup" onClick={closeMenu}>
                  <i className="bi bi-person-plus me-1"></i> Sign Up
                </NavLink>
              </li>
            </>
          )}

          {/* Authenticated user links */}
          {user && (
            <>
              {/* Dashboard: visible to all authenticated users */}
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/dashboard" onClick={closeMenu}>
                  <i className="bi bi-grid me-1"></i> Dashboard
                  {/* Patient count badge */}
                  {patientCount > 0 && (
                    <span className="badge bg-warning text-dark ms-2">
                      {patientCount}
                    </span>
                  )}
                </NavLink>
              </li>

              {/* Appointments: only for admin, dentist, receptionist */}
              {hasRole('admin', 'dentist', 'receptionist') && (
                <li className="nav-item">
                  <NavLink className={navLinkClass} to="/appointments" onClick={closeMenu}>
                    <i className="bi bi-calendar-event me-1"></i> Appointments
                  </NavLink>
                </li>
              )}

              {/* 🆕 Calendar: only for admin, dentist, receptionist */}
              {hasRole('admin', 'dentist', 'receptionist') && (
                <li className="nav-item">
                  <NavLink className={navLinkClass} to="/calendar" onClick={closeMenu}>
                    <i className="bi bi-calendar3 me-1"></i> Calendar
                  </NavLink>
                </li>
              )}

              {/* (Optional) Example of future Admin page */}
              {hasRole('admin') && (
                <li className="nav-item">
                  <NavLink className={navLinkClass} to="/admin" onClick={closeMenu}>
                    <i className="bi bi-shield-lock me-1"></i> Admin
                  </NavLink>
                </li>
              )}

              {/* Profile: all authenticated users */}
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/profile" onClick={closeMenu}>
                  <i className="bi bi-person-circle me-1"></i> My Profile
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* DARK MODE TOGGLE BUTTON */}
        <ul className="navbar-nav align-items-center">
          <li className="nav-item me-2">
            <button
              className="btn btn-outline-light btn-sm btn-animated"
              type="button"
              onClick={toggleDarkMode}
            >
              <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill'} me-1`}></i>
              {isDark ? 'Light' : 'Dark'}
            </button>
          </li>
        </ul>

        {/* RIGHT: WELCOME + SIGN OUT */}
        <ul className="navbar-nav align-items-center">
          {user && (
            <>
              <li className="nav-item me-2">
                <span className="navbar-text text-white-50 small">
                  Welcome,&nbsp;
                  <span className="fw-semibold text-white">
                    {user.username}
                  </span>
                  {user.role && (
                    <span className="badge bg-light text-dark ms-2 text-capitalize">
                      {user.role}
                    </span>
                  )}
                </span>
              </li>

              <li className="nav-item">
                <button
                  className="btn btn-light btn-sm btn-animated"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>

      </div>
    </nav>
  );
}
