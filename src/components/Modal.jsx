export default function Modal({ show, title, onClose, children }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop show"></div>

      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              {title && <h5 className="modal-title mb-0">{title}</h5>}
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}