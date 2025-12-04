/**
 * AttachmentsModal.jsx
 * --------------------
 * Shows a list/gallery of attachments for a single patient.
 * Allows downloading / opening files and deleting them.
 */

import api from "../api/axios";

function getFileUrl(filename) {
  // baseURL can be '/api' (local) or 'https://.../api' (Render)
  const base = api.defaults.baseURL || "";

  if (base === "/api") {
    // same origin as frontend, backend mounted at /api
    return `/uploads/${filename}`;
  }

  // Remove trailing '/api' from full URL and append /uploads
  return base.replace(/\/api$/, "") + `/uploads/${filename}`;
}

export default function AttachmentsModal({
  show,
  patient,
  onClose,
  onDeleteAttachment,
}) {
  if (!show || !patient) return null;

  const attachments = patient.attachments || [];

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Attachments for {patient.name || "Patient"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {attachments.length === 0 && (
                <p className="text-muted mb-0">No attachments uploaded yet.</p>
              )}

              {attachments.length > 0 && (
                <div className="list-group">
                  {attachments.map((att) => {
                    const url = getFileUrl(att.filename);
                    const isImage = att.mimeType?.startsWith("image/");

                    return (
                      <div
                        key={att._id}
                        className="list-group-item d-flex align-items-center justify-content-between"
                      >
                        <div className="d-flex align-items-center">
                          {/* Thumbnail for images */}
                          {isImage && (
                            <img
                              src={url}
                              alt={att.originalName}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 4,
                                marginRight: 12,
                              }}
                            />
                          )}

                          <div>
                            <div className="fw-semibold">
                              <a href={url} target="_blank" rel="noreferrer">
                                {att.originalName || att.filename}
                              </a>
                            </div>
                            <div className="small text-muted">
                              {att.mimeType} ·{" "}
                              {Math.round((att.size || 0) / 1024)} KB
                            </div>
                          </div>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            onDeleteAttachment &&
                            onDeleteAttachment(patient._id, att._id)
                          }
                        >
                          <i className="bi bi-trash me-1" />
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}