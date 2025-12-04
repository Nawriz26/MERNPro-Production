// Appointments.jsx
// ----------------
// - Allows staff to create / edit / delete appointments
// - Patient is selected from dropdown (patients fetched from API)
// - Validations:
//   - patientId: required
//   - date: required & > today
//   - time: required
//   - reason: required
//   - status: required

import { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patientId: '',
    date: '',
    time: '',
    reason: '',
    status: 'Scheduled',
  });

  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  const loadAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch {
      toast.error('Failed to load appointments');
    }
  };

  const loadPatients = async () => {
    try {
      const { data } = await api.get('/patients');
      setPatients(data);
    } catch {
      toast.error('Failed to load patients');
    }
  };

  useEffect(() => {
    loadAppointments();
    loadPatients();
  }, []);

  const validate = () => {
    const errs = {};

    if (!form.patientId) errs.patientId = 'Patient is required';

    if (!form.date) {
      errs.date = 'Date is required';
    } else {
      const chosen = new Date(form.date);
      const today = new Date(todayStr);
      if (chosen <= today) {
        errs.date = 'Date must be greater than today';
      }
    }

    if (!form.time) errs.time = 'Time is required';

    if (!form.reason.trim()) errs.reason = 'Reason is required';

    if (!form.status) errs.status = 'Status is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/appointments/${editingId}`, form);
        toast.success('Appointment updated');
      } else {
        await api.post('/appointments', form);
        toast.success('Appointment created');
      }

      setForm({
        patientId: '',
        date: '',
        time: '',
        reason: '',
        status: 'Scheduled',
      });
      setEditingId(null);
      setErrors({});
      await loadAppointments();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving appointment';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (appt) => {
    setEditingId(appt._id);
    setForm({
      patientId: appt.patientId?._id || appt.patientId || '',
      date: appt.date?.slice(0, 10) || '',
      time: appt.time || '',
      reason: appt.reason || '',
      status: appt.status || 'Scheduled',
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment deleted');
      await loadAppointments();
    } catch {
      toast.error('Error deleting appointment');
    }
  };

  return (
    <div className="container py-4 page-transition">
      <h2>Appointments</h2>

      <div className="row mt-3">
        {/* LEFT: Appointment form */}
        <div className="col-md-5">
          <div className="card card-body">
            <h5>{editingId ? 'Edit Appointment' : 'New Appointment'}</h5>
            <form onSubmit={onSubmit}>
              {/* Patient dropdown */}
              <div className="mb-2">
                <label className="form-label">Patient</label>
                <select
                  className={`form-select ${errors.patientId ? 'is-invalid' : ''}`}
                  value={form.patientId}
                  onChange={(e) =>
                    setForm({ ...form, patientId: e.target.value })
                  }
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — {p.email}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <div className="invalid-feedback">{errors.patientId}</div>
                )}
              </div>

              {/* Date */}
              <div className="mb-2">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                  min={todayStr} // UI hint; validate again in JS
                />
                {errors.date && (
                  <div className="invalid-feedback">{errors.date}</div>
                )}
              </div>

              {/* Time */}
              <div className="mb-2">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                  required
                />
                {errors.time && (
                  <div className="invalid-feedback">{errors.time}</div>
                )}
              </div>

              {/* Reason */}
              <div className="mb-2">
                <label className="form-label">Reason</label>
                <input
                  className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                  required
                />
                {errors.reason && (
                  <div className="invalid-feedback">{errors.reason}</div>
                )}
              </div>

              {/* Status */}
              <div className="mb-2">
                <label className="form-label">Status</label>
                <select
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  required
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <div className="invalid-feedback">{errors.status}</div>
                )}
              </div>

              <button className="btn btn-primary mt-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Appointment list */}
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
                    <td>
                      {a.patientId?.name || a.patientName || 'Unknown'}
                    </td>
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
