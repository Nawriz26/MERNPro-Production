// Dashboard.jsx
// Patient Dashboard page.
// - Loads all patients from the backend
// - Allows Create / Update / Delete via PatientForm + PatientTable
// - Includes search + pagination + confirmation modal for deletes
// - Updates global patientCount in PatientContext (for navbar badge)

import { useEffect, useState } from 'react';
import api from '../api/axios';
import PatientForm from '../components/PatientForm';
import PatientTable from '../components/PatientTable';
import { usePatients } from '../context/PatientContext';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';


export default function Dashboard() {
  // Full list of patients fetched from API
  const [patients, setPatients] = useState([]);
  // Currently selected patient for edit (full object)
  const [editing, setEditing] = useState(null);
  // Selected patient id when user clicks Delete
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Global patient count (used in Navbar badge)
  const { setPatientCount } = usePatients();

  // Search + pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Load all patients from backend
  const load = async () => {
    const { data } = await api.get('/patients');
    setPatients(data);
    setEditing(null);              // Reset editing state on reload
    setPatientCount(data.length);  // Update global count
    setPage(1);                    // Reset pagination to first page
  };

  // Fetch patients once on mount
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (Reserved for future: phone auth / SMS verification)
  const authenticatePhone = async (phone) => {
    const { data } = await api.post('/auth/send-code', { phone });
    return data;
  };

  // Create new patient
  const create = async (payload) => {
  try {
    await api.post('/patients', payload);
    toast.success('Patient created');
    await load();
  } catch (err) {
    const msg = err.response?.data?.message || 'Error saving patient';
    toast.error(msg);
  }
};


  // Update existing patient (based on `editing._id`)
  const update = async (payload) => {
  try {
    await api.put(`/patients/${editing._id}`, payload);
    toast.success('Patient updated');
    await load();
  } catch (err) {
    const msg = err.response?.data?.message || 'Error updating patient';
    toast.error(msg);
  }
};


  // Delete patient by id
  const remove = async (id) => {
    await api.delete(`/patients/${id}`);
    toast.success('Patient deleted');
    await load();
  };

  // Decide whether to create or update based on editing flag
  const savePatient = async (payload) => {
    if (editing) {
      await update(payload);
    } else {
      await create(payload);
    }
    setEditing(null);
  };

  // Apply search filter to patients list
  const filtered = patients.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });

  // Pagination math
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  // Helper to switch pages safely
  const goTo = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className="container gap-1 py-4 page-transition">
      <h2 className="center-text w-100 p-2">Patient Dashboard</h2>

      <div className="row mt-3">
        {/* LEFT: Patient form (create / edit) */}
        <div className="col-md-5">
          <div className="container card card-body ">
            <h5 className="alignContent">
              {editing ? 'Edit Patient' : 'Add New Patient'}
            </h5>
            {/* When form submits, it calls savePatient */}
            <PatientForm initial={editing} onSubmit={savePatient} />
          </div>
        </div>

        {/* RIGHT: List, search, pagination */}
        <div className="col-md-7">
          <div className="container card card-body">
            {/* Header row with search box */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Patients</h5>
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ maxWidth: 220 }}
                placeholder="Search by name, email, phone"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to first page after new search
                }}
              />
            </div>

            {/* Patient table (current page only) */}
            <PatientTable
              patients={current}
              onEdit={setEditing}           // pass entire patient for editing
              onDelete={setSelectedPatient} // store id for ConfirmModal
            />

            {/* Confirm delete modal */}
            <ConfirmModal
              show={!!selectedPatient}
              message="Are you sure that you wish to delete the patient?"
              onConfirm={async () => {
                if (!selectedPatient) return;
                await remove(selectedPatient); // selectedPatient is patient id
                setSelectedPatient(null);
              }}
              onCancel={() => setSelectedPatient(null)}
              confirmText="Delete"
              cancelText="Cancel"
            />

            {/* Pagination controls */}
            <nav aria-label="Patient pages">
              <ul className="pagination pagination-sm mb-0 justify-content-end">
                <li className={`page-item ${safePage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => goTo(safePage - 1)}
                  >
                    Prev
                  </button>
                </li>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <li
                    key={idx}
                    className={`page-item ${
                      safePage === idx + 1 ? 'active' : ''
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => goTo(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    safePage === totalPages ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => goTo(safePage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>

          </div>
        </div>
      </div>
    </div>
  );
}
