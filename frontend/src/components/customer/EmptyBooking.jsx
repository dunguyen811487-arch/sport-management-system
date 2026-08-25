import { useNavigate } from "react-router-dom";

function EmptyBooking() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-5">

      <div
        style={{
          fontSize: "70px",
        }}
      >
        📅
      </div>

      <h3 className="fw-bold mt-3">
        Chưa có lịch đặt sân
      </h3>

      <p className="text-muted">
        Bạn chưa đặt sân nào.
      </p>

      <button
        className="btn btn-success mt-3"
        onClick={() => navigate("/fields")}
      >
        Đặt sân ngay
      </button>

    </div>
  );
}

export default EmptyBooking;