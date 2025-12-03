// Home.jsx
// Public landing page.
// - Shows welcome hero + CTA for Sign In / Sign Up when logged out
// - When logged in, fetches and displays a short list of recent patients
// - Footer tagline at the bottom

import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';


export default function Home() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);

  // When user is logged in, fetch recent patients
  useEffect(() => {
    if (!user) return;
    api
      .get('/patients')
      .then((res) => setPatients(res.data))
      .catch(() => {
        // We quietly ignore errors here, since this is just a "preview" list
      });
  }, [user]);

  return (
    <div
      className="container text-center page-transition"
      style={{ alignContent: 'center', height: '100vh' }}
    >
      {/* Landing title */}
      <h1 className="mb-3 fw-bold">Welcome to MERNPro Dental Clinic</h1>

      {/* When not logged in: show sign in / sign up call to action */}
      {!user && (
        <div className="mt-3">
          <p>
            Get started by signing in or creating an account to manage patients.
          </p>
          <a href="/login" className="btn btn-primary me-2">
            Sign In
          </a>
          <a href="/signup" className="btn btn-outline-primary">
            Sign Up
          </a>
        </div>
      )}

      {/* When logged in: show recent patients list */}
      {user && (
        <>
          <h4 className="m-4">Recent Patients</h4>
          <ul className="container mx-50vw list-group">
            {patients.map((p) => (
              <li
                key={p._id}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  <strong>{p.name}</strong> — {p.email} — {p.phone}
                </span>
              </li>
            ))}
            {patients.length === 0 && (
              <li className="list-group-item">No patients yet.</li>
            )}
          </ul>
        </>
      )}

      {/* Simple footer tagline */}
      <footer className="footer fixed-bottom m-0">
        <p className="footer" style={{ alignContent: 'center' }}>
          Secure patient management built with MERN
        </p>
      </footer>
    </div>
  );
}
