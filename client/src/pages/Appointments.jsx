// Appointments.jsx
// ----------------
// - Lists upcoming appointments
// - Allows create, edit, delete
// - Uses /api/appointments backend

import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    patientName: "",
    date: "",
    time: "",
    reason: "",
    status: "Scheduled",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/appointments");
      setAppointments(data);
    } catch (err) {
      console.error("Load appointments error:", err);
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/appointments/${editingId}`, form);
        toast.success("Appointment updated");
      } else {
        await api.post("/appointments", form);
        toast.success("Appointment created");
      }
      setForm({
        patientName: "",
        date: "",
        time: "",
        reason: "",
        status: "Scheduled",
      });
      setEditingId(null);
      await load();
    } catch (err) {
      console.error("Save appointment error:", err);
      toast.error("Error saving appointment");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (appt) => {
    setEditingId(appt._id);
    setForm({
      patientName: appt.patientName || "",
      date: appt.date?.slice(0, 10) || "",
      time: appt.time || "",
      reason: appt.reason || "",
      status: appt.status || "Scheduled",
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment deleted");
      await load();
    } catch (err) {
      console.error("Delete appointment error:", err);
      const msg = err.response?.data?.message || "Error deleting appointment";
      toast.error(msg);
    }
  };

  return (
    <div className="container py-4 page-transition">
      <h2>Appointments</h2>

      <div className="row mt-3">
        <div className="col-md-5">
          <div className="card card-body">
            <h5>{editingId ? "Edit Appointment" : "New Appointment"}</h5>
            <form onSubmit={onSubmit}>
              <div className="mb-2">
                <label className="form-label">Patient Name</label>
                <input
                  className="form-control"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Reason</label>
                <input
                  className="form-control"
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <button className="btn btn-primary mt-2" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card card-body">
            <h5>Upcoming Appointments</h5>
            <table className="table table-striped mt-2">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>{a.patientName}</td>
                    <td>{a.date?.slice(0, 10)}</td>
                    <td>{a.time}</td>
                    <td>{a.status}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => onEdit(a)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(a._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-muted">
                      No appointments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
