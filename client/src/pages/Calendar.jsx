// Calendar.jsx
// Simple calendar-like view of appointments grouped by date.

import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Calendar() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get("/appointments")
      .then((res) => setAppointments(res.data || []))
      .catch(() => {
        // handle error silently or with toast
      });
  }, [user]);

  // Group by date (YYYY-MM-DD)
  const grouped = appointments.reduce((acc, appt) => {
    const key = (appt.date || "").slice(0, 10); // assume ISO date
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="container py-4 page-transition">
      <h2>Appointment Calendar</h2>
      <p className="text-muted">
        Simple calendar-style view grouped by date.
      </p>

      {sortedDates.length === 0 && (
        <div className="alert alert-info mt-3">
          No appointments scheduled yet.
        </div>
      )}

      {sortedDates.map((date) => (
        <div key={date} className="card mt-3">
          <div className="card-header fw-bold">
            {date}
          </div>
          <ul className="list-group list-group-flush">
            {grouped[date].map((a) => (
              <li key={a._id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{a.time}</strong>{" "}
                    — {a.patientName || "Unknown patient"}{" "}
                    {a.reason && <> — <em>{a.reason}</em></>}
                  </div>
                  <span className="badge bg-secondary">{a.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
