/**
 * ConfirmModal Component
 * ----------------------
 * Reusable Bootstrap modal used for delete confirmations.
 * Props:
 *  - show: boolean → determines visibility
 *  - onConfirm: action for Confirm button
 *  - onCancel: action for Cancel button
 *  - message: modal text
 *  - confirmText / cancelText: button labels
 */

export default function ConfirmModal({
  show,
  onConfirm,
  onCancel,
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  // Don't render modal if 'show' is false
  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Confirm</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} />
            </div>

            {/* Modal Body */}
            <div className="modal-body">{message}</div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                {cancelText}
              </button>

              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                {confirmText}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
