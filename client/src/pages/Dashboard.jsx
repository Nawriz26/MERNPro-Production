// Dashboard.jsx
// Patient Dashboard page.

import { useEffect, useState } from "react";
import api from "../api/axios";
import PatientForm from "../components/PatientForm";
import PatientTable from "../components/PatientTable";
import { usePatients } from "../context/PatientContext";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import AttachmentsModal from "../components/AttachmentsModal";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null); // id for delete
  const [attachmentPatient, setAttachmentPatient] = useState(null); // patient object for modal

  const { setPatientCount } = usePatients();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Load all patients from backend
  const load = async () => {
    const { data } = await api.get("/patients");
    setPatients(data);
    setEditing(null);
    setPatientCount(data.length);
    setPage(1);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create new patient
  const create = async (payload) => {
    try {
      await api.post("/patients", payload);
      toast.success("Patient created");
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || "Error saving patient";
      toast.error(msg);
    }
  };

  // Update existing patient
  const update = async (payload) => {
    try {
      await api.put(`/patients/${editing._id}`, payload);
      toast.success("Patient updated");
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || "Error updating patient";
      toast.error(msg);
    }
  };

  // Delete patient by id
  const remove = async (id) => {
    try {
      await api.delete(`/patients/${id}`);
      toast.success("Patient deleted");
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || "Error deleting patient";
      toast.error(msg);
    }
  };

  // Decide create vs update
  const savePatient = async (payload) => {
    if (editing) {
      await update(payload);
    } else {
      await create(payload);
    }
    setEditing(null);
  };

  // Upload handler for attachments (X-rays)
  const handleUpload = async (patientId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/patients/${patientId}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Attachment uploaded");
      await load();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload attachment");
    }
  };

  // Delete single attachment – used by AttachmentsModal
  const handleDeleteAttachment = async (patientId, attachmentId) => {
    try {
      await api.delete(`/patients/${patientId}/attachments/${attachmentId}`);
      toast.success("Attachment deleted");
      await load();
    } catch (err) {
      console.error("Delete attachment error:", err);
      toast.error("Failed to delete attachment");
    }
  };

  // Search + pagination
  const filtered = patients.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  const goTo = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className="container gap-1 py-4 page-transition">
      <h2 className="center-text w-100 p-2">Patient Dashboard</h2>

      <div className="row mt-3">
        {/* LEFT: Patient form */}
        <div className="col-md-5">
          <div className="container card card-body ">
            <h5 className="alignContent">
              {editing ? "Edit Patient" : "Add New Patient"}
            </h5>
            <PatientForm initial={editing} onSubmit={savePatient} />
          </div>
        </div>

        {/* RIGHT: List, search, pagination */}
        <div className="col-md-7">
          <div className="container card card-body">
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
                  setPage(1);
                }}
              />
            </div>

            {/* Patient table */}
            <PatientTable
              patients={current}
              onEdit={setEditing}
              onDelete={setSelectedPatient}           // pass ID to confirm modal
              onUpload={handleUpload}                  // handle file upload
              onViewAttachments={setAttachmentPatient} // opens attachments modal
            />

            {/* Confirm delete patient modal */}
            <ConfirmModal
              show={!!selectedPatient}
              message="Are you sure that you wish to delete the patient?"
              onConfirm={async () => {
                if (!selectedPatient) return;
                await remove(selectedPatient);
                setSelectedPatient(null);
              }}
              onCancel={() => setSelectedPatient(null)}
              confirmText="Delete"
              cancelText="Cancel"
            />

            {/* Attachments viewer modal */}
            <AttachmentsModal
              show={!!attachmentPatient}
              patient={attachmentPatient}
              onClose={() => setAttachmentPatient(null)}
              onDeleteAttachment={handleDeleteAttachment}
            />

            {/* Pagination */}
            <nav aria-label="Patient pages">
              <ul className="pagination pagination-sm mb-0 justify-content-end">
                <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
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
                      safePage === idx + 1 ? "active" : ""
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
                    safePage === totalPages ? "disabled" : ""
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
