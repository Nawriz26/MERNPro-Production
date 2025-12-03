/**
 * Appointments.jsx
 * -----------------
 * Frontend UI for managing appointment records.
 *
 * Features:
 * - Load all appointments from backend
 * - Load patients for dropdown (patientId foreign-key linking)
 * - Create, update, delete appointments
 * - Edit mode (prefills form)
 * - Search + status filter
 * - Uses ConfirmModal for delete confirmation
 * - Displays appointment list with patient name resolved from patientId
 */

import { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';

export default function Appointments() {
  // Appointment + patient state
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // For ConfirmModal deletion
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form data for create/update
  const [form, setForm] = useState({
    patientId: '',
    date: '',
    time: '',
    reason: '',
    status: 'Scheduled',
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search + filtering UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load appointments from backend
  const loadAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch {
      toast.error('Failed to load appointments');
    }
  };

  // Load patients into dropdown
  const loadPatients = async () => {
    try {
      const { data } = await api.get('/patients');
      setPatients(data);
    } catch {
      toast.error('Failed to load patients for dropdown');
    }
  };

  // Load data on initial render
  useEffect(() => {
    loadAppointments();
    loadPatients();
  }, []);

  // Handle form updates
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Create or update appointment
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.patientId) {
      toast.error('Please select a patient');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };

      if (editingId) {
        await api.put(`/appointments/${editingId}`, payload);
        toast.success('Appointment updated');
      } else {
        await api.post('/appointments', payload);
        toast.success('Appointment created');
      }

      // Reset form
      setForm({
        patientId: '',
        date: '',
        time: '',
        reason: '',
        status: 'Scheduled',
      });
      setEditingId(null);
      loadAppointments();
    } catch {
      toast.error('Error saving appointment');
    } finally {
      setLoading(false);
    }
  };

  // Prefill form for editing
  const onEdit = (appt) => {
    setEditingId(appt._id);

    const patientId =
      (appt.patientId && appt.patientId._id) ||
      appt.patientId ||
      '';

    setForm({
      patientId,
      date: appt.date?.slice(0, 10) || '',
      time: appt.time || '',
      reason: appt.reason || '',
      status: appt.status || 'Scheduled',
    });
  };

  // Delete appointment
  const onDelete = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment deleted');
      await loadAppointments();
    } catch {
      toast.error('Error deleting appointment');
    }
  };

  // Filter appointments by search + status
  const filteredAppointments = appointments.filter((a) => {
    const name = a.patientName || a.patientId?.name || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container py-4 page-transition">
      <h2>Appointments</h2>

      <div className="row mt-3">
        {/* Left Column: Form */}
        <div className="col-md-5">
          <div className="card card-body">
            <h5>{editingId ? 'Edit Appointment' : 'New Appointment'}</h5>

            <form onSubmit={onSubmit}>
              {/* Patient dropdown */}
              <div className="mb-2">
                <label className="form-label">Patient</label>
                <select
                  className="form-select"
                  name="patientId"
                  value={form.patientId}
                  onChange={onChange}
                  required
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} {p.email ? `(${p.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="mb-2">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Time */}
              <div className="mb-2">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={form.time}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Reason */}
              <div className="mb-2">
                <label className="form-label">Reason</label>
                <input
                  className="form-control"
                  name="reason"
                  value={form.reason}
                  onChange={onChange}
                />
              </div>

              {/* Status */}
              <div className="mb-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={onChange}
                >
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <button className="btn btn-primary mt-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Table */}
        <div className="col-md-7">
          <div className="table-responsive card card-body">
            <h5>Upcoming Appointments</h5>

            {/* Search + status filter */}
            <div className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Appointment table */}
            <table className="table table-striped mt-2 rounded">
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
                {filteredAppointments.map((a) => (
                  <tr key={a._id}>
                    <td>{a.patientName || a.patientId?.name || '(Unknown)'}</td>
                    <td>{a.date?.slice(0, 10)}</td>
                    <td>{a.time}</td>
                    <td>{a.status}</td>
                    <td className="text-end">
                      {/* Edit */}
                      <button
                        className="btn btn-sm btn-outline-secondary me-2 w-100"
                        onClick={() => onEdit(a)}
                      >
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        className="btn btn-sm btn-outline-danger w-100"
                        onClick={() => setSelectedPatient(a._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-muted">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
              show={!!selectedPatient}
              message="Are you sure that you wish to delete the appointment?"
              onConfirm={async () => {
                if (!selectedPatient) return;
                await onDelete(selectedPatient);
                setSelectedPatient(null);
              }}
              onCancel={() => setSelectedPatient(null)}
              confirmText="Delete"
              cancelText="Cancel"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
