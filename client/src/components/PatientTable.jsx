/**
 * PatientTable Component
 * ----------------------
 * - Renders a responsive table of patient records.
 * - Shows name, email, and phone for each patient.
 * - Exposes Edit and Delete actions via callbacks:
 *    - onEdit(patient)  → parent handles edit state
 *    - onDelete(id)     → parent handles delete + confirmation
 *
 * Note:
 *  - ConfirmModal is not used directly here; it is rendered in the parent
 *    (e.g., Dashboard.jsx) which receives the selected patient id from onDelete.
 */

import ConfirmModal from "./ConfirmModal"; // currently not used in this component

export default function PatientTable({ patients, onEdit, onDelete }) {
  return (
    <div className="table-responsive mb-4">
      <table className="table table-striped rounded border table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th></th> {/* actions column */}
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>

              <td className="text-center">
                {/* Edit button forwards entire patient object */}
                <button
                  className="btn btn-sm btn-outline-secondary p-1 w-100 mb-1"
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>

                {/* Delete button forwards only the patient id */}
                <button
                  className="btn btn-sm btn-outline-danger p-1 w-100"
                  onClick={() => onDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {/* Optionally, you could handle empty state here if patients.length === 0 */}
        </tbody>
      </table>
    </div>
  );
}
