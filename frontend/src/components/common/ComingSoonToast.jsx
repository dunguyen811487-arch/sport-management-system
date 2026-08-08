import { useEffect, useState } from "react";

function ComingSoonToast({ show, onClose }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);

    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div
      className="toast show position-fixed bottom-0 end-0 m-4"
      style={{ zIndex: 9999 }}
    >
      <div className="toast-header bg-warning">
        <strong className="me-auto">
          🚧 Tính năng đang phát triển
        </strong>

        <button
          className="btn-close"
          onClick={onClose}
        ></button>
      </div>

      <div className="toast-body">
        Chức năng này sẽ có trong phiên bản tiếp theo.
      </div>
    </div>
  );
}

export default ComingSoonToast;