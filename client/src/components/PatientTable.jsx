/**
 * PatientTable Component
 * ----------------------
 * - Renders a responsive table of patient records.
 * - Shows name, email, phone.
 * - Provides buttons for:
 *    - Edit
 *    - Delete
 *    - Upload X-ray
 *    - View Attachments (opens modal)
 *
 * Props:
 *  - patients: array of patient objects
 *  - onEdit(patient)
 *  - onDelete(patientId)
 *  - onUpload(patientId, file)
 *  - onViewAttachments(patient)
 */

export default function PatientTable({
  patients,
  onEdit,
  onDelete,
  onUpload,
  onViewAttachments,
}) {
  return (
    <div className="table-responsive mb-4">
      <table className="table table-striped rounded border table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th style={{ width: "230px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>

              <td className="text-center">
                {/* Edit button */}
                <button
                  className="btn btn-sm btn-outline-secondary p-1 w-100 mb-1"
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>

                {/* Delete button (opens ConfirmModal via parent) */}
                <button
                  className="btn btn-sm btn-outline-danger p-1 w-100 mb-1"
                  onClick={() => onDelete(p._id)}
                >
                  Delete
                </button>

                {/* Upload X-ray / attachment */}
                <label className="btn btn-sm btn-outline-primary p-1 w-100 mb-1">
                  Upload X-ray
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && onUpload) {
                        onUpload(p._id, file);
                      }
                      // allow selecting the same file again
                      e.target.value = "";
                    }}
                  />
                </label>

                {/* View attachments (opens modal) */}
                <button
                  className="btn btn-sm btn-outline-dark p-1 w-100"
                  onClick={() => onViewAttachments && onViewAttachments(p)}
                  disabled={!p.attachments || p.attachments.length === 0}
                >
                  View Attachments
                  {p.attachments && p.attachments.length > 0
                    ? ` (${p.attachments.length})`
                    : ""}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
