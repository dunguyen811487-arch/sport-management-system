import { useLocation, useNavigate } from "react-router-dom";

import formatCurrency from "../../utils/formatCurrency";

import "../../assets/styles/booking-success.css";

function BookingSuccess() {
  const navigate = useNavigate();

  const { state } = useLocation();

  // ==========================================
  // Lấy booking
  //
  // Hỗ trợ cả 2 kiểu:
  //
  // state = {
  //   booking: {...}
  // }
  //
  // hoặc
  //
  // state = {
  //   bookingCode,
  //   field,
  //   ...
  // }
  // ==========================================

  const booking = state?.booking || state;

  // ==========================================
  // Không có dữ liệu
  // ==========================================

  if (!booking || !booking.field) {
    return (
      <div className="booking-success-card text-center">

        <div className="success-empty-icon">
          ⚠️
        </div>

        <h3>
          Không tìm thấy thông tin đặt sân
        </h3>

        <p className="text-muted">
          Có thể phiên đặt sân đã hết hoặc bạn
          đã truy cập trang này trực tiếp.
        </p>

        <button
          className="btn btn-success"
          onClick={() => navigate("/")}
        >
          ← Về trang chủ
        </button>

      </div>
    );
  }

  // ==========================================
  // Thông tin sân
  // ==========================================

  const field = booking.field;

  const fieldName =
    field?.fieldName || "Không xác định";

  const fieldType =
    field?.fieldType || "";

  const subType =
    field?.subType || "";

  const location =
    field?.location || "";

  const bookingDate =
    booking.bookingDate || "Chưa xác định";

  const selectedSlots =
    booking.selectedSlots || [];

  const totalHours =
    booking.totalHours ||
    selectedSlots.length;

  const totalPrice =
    booking.totalPrice || 0;

  const bookingCode =
    booking.bookingCode ||
    "Đang cập nhật";

  const note =
    booking.note || "";

  // ==========================================
  // Phương thức thanh toán
  // ==========================================

  let paymentMethodText =
    "Chưa xác định";

  if (
    booking.paymentMethod === "Tiền mặt"
  ) {
    paymentMethodText =
      "Thanh toán tại quầy";
  }

  if (
    booking.paymentMethod === "VNPay"
  ) {
    paymentMethodText =
      "Thanh toán Online - VNPay";
  }

  // ==========================================
  // Trạng thái thanh toán
  // ==========================================

  const paymentStatus =
    booking.paymentStatus || "pending";

  // ==========================================
  // Text trạng thái
  // ==========================================

  let paymentStatusText =
    "Chờ thanh toán";

  let paymentStatusClass =
    "bg-warning text-dark";

  let paymentStatusIcon =
    "bi-hourglass-split";

  if (
    paymentStatus ===
    "waiting_confirmation"
  ) {
    paymentStatusText =
      "Chờ nhân viên xác nhận thanh toán";

    paymentStatusClass =
      "bg-info text-dark";

    paymentStatusIcon =
      "bi-clock-history";
  }

  if (
    paymentStatus === "paid"
  ) {
    paymentStatusText =
      "Đã thanh toán";

    paymentStatusClass =
      "bg-success";

    paymentStatusIcon =
      "bi-check-circle-fill";
  }

  // ==========================================
  // Khung giờ
  // ==========================================

  const getBookingTime = () => {
    if (
      selectedSlots.length === 0
    ) {
      return "Chưa xác định";
    }

    const sortedSlots =
      [...selectedSlots].sort();

    const first =
      sortedSlots[0];

    const lastSlot =
      sortedSlots[
        sortedSlots.length - 1
      ];

    const lastHour =
      parseInt(
        lastSlot.split(":")[0],
        10
      ) + 1;

    const last =
      `${String(lastHour).padStart(
        2,
        "0"
      )}:00`;

    return `${first} - ${last}`;
  };

  return (
    <div className="container py-5">

      <div className="booking-success-card">

        {/* ==========================================
            ICON
        ========================================== */}

        <div className="success-icon">

          <i className="bi bi-check-lg"></i>

        </div>

        {/* ==========================================
            TITLE
        ========================================== */}

        <h1 className="success-title">

          Đặt sân thành công!

        </h1>

        <p className="success-message">

          Cảm ơn bạn đã sử dụng dịch vụ
          Sport Management.

        </p>

        {/* ==========================================
            BOOKING CODE
        ========================================== */}

        <div className="booking-code-box">

          <span>
            Mã đặt sân
          </span>

          <strong>
            {bookingCode}
          </strong>

        </div>

        {/* ==========================================
            FIELD
        ========================================== */}

        <div className="success-section">

          <h4>
            🏟️ Thông tin sân
          </h4>

          <div className="success-field">

            {field?.image && (
              <img
                src={field.image}
                alt={fieldName}
                className="success-field-image"
              />
            )}

            <div className="success-field-info">

              <h3>
                {fieldName}
              </h3>

              {fieldType && (
                <p>
                  <i className="bi bi-tag-fill"></i>
                  {fieldType}
                </p>
              )}

              {subType && (
                <p>
                  <i className="bi bi-grid-fill"></i>
                  {subType}
                </p>
              )}

              {location && (
                <p>
                  <i className="bi bi-geo-alt-fill"></i>
                  {location}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ==========================================
            BOOKING INFO
        ========================================== */}

        <div className="success-section">

          <h4>
            📅 Thông tin lịch đặt
          </h4>

          <div className="success-info-grid">

            <div className="success-info-item">

              <span>
                Ngày đặt
              </span>

              <strong>
                {bookingDate}
              </strong>

            </div>

            <div className="success-info-item">

              <span>
                Khung giờ
              </span>

              <strong>
                {getBookingTime()}
              </strong>

            </div>

            <div className="success-info-item">

              <span>
                Số giờ
              </span>

              <strong>
                {totalHours} giờ
              </strong>

            </div>

            <div className="success-info-item">

              <span>
                Thanh toán
              </span>

              <strong>
                {paymentMethodText}
              </strong>

            </div>

          </div>

        </div>

        {/* ==========================================
            PAYMENT
        ========================================== */}

        <div className="success-section">

          <h4>
            💰 Thanh toán
          </h4>

          <div className="success-payment">

            <div className="d-flex justify-content-between">

              <span>
                Đơn giá
              </span>

              <strong>
                {formatCurrency(
                  field?.pricePerHour || 0
                )}

                / giờ
              </strong>

            </div>

            <div className="d-flex justify-content-between mt-2">

              <span>
                Số giờ
              </span>

              <strong>
                {totalHours}
              </strong>

            </div>

            <hr />

            <div className="d-flex justify-content-between">

              <strong>
                Tổng thanh toán
              </strong>

              <strong className="success-total-price">

                {formatCurrency(
                  totalPrice
                )}

              </strong>

            </div>

          </div>

        </div>

        {/* ==========================================
            PAYMENT STATUS
        ========================================== */}

        <div className="success-section">

          <h4>
            💳 Trạng thái thanh toán
          </h4>

          <div className="text-center">

            <span
              className={`badge ${paymentStatusClass} px-4 py-2`}
              style={{
                fontSize: "15px",
              }}
            >

              <i
                className={`bi ${paymentStatusIcon} me-2`}
              ></i>

              {paymentStatusText}

            </span>

          </div>

          {paymentStatus ===
            "waiting_confirmation" && (
            <div className="alert alert-info mt-3 mb-0">

              <i className="bi bi-info-circle-fill me-2"></i>

              Bạn đã gửi yêu cầu xác nhận thanh
              toán. Nhân viên sẽ kiểm tra giao dịch
              và xác nhận cho bạn.

            </div>
          )}

          {paymentStatus ===
            "paid" && (
            <div className="alert alert-success mt-3 mb-0">

              <i className="bi bi-check-circle-fill me-2"></i>

              Thanh toán của bạn đã được nhân viên
              xác nhận.

            </div>
          )}

        </div>

        {/* ==========================================
            NOTE
        ========================================== */}

        {note && (
          <div className="success-section">

            <h4>
              📝 Ghi chú
            </h4>

            <div className="success-note">
              {note}
            </div>

          </div>
        )}

        {/* ==========================================
            BOOKING STATUS
        ========================================== */}

        <div className="success-status">

          <div>

            <i className="bi bi-check-circle-fill"></i>

            <span>
              Đặt sân đã được ghi nhận
            </span>

          </div>

          <div>

            <i className="bi bi-shield-check"></i>

            <span>
              Thông tin đặt sân đã được lưu
            </span>

          </div>

          {paymentStatus ===
            "waiting_confirmation" && (
            <div>

              <i className="bi bi-person-check"></i>

              <span>
                Đang chờ nhân viên xác nhận
                thanh toán
              </span>

            </div>
          )}

        </div>

        {/* ==========================================
            BUTTON
        ========================================== */}

        <div className="success-actions">

          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              navigate("/")
            }
          >

            <i className="bi bi-house-fill me-2"></i>

            Trang chủ

          </button>

          <button
            className="btn btn-success"
            onClick={() =>
              navigate(
                "/booking-history"
              )
            }
          >

            <i className="bi bi-calendar-check-fill me-2"></i>

            Xem lịch sử đặt sân

          </button>

        </div>

      </div>

    </div>
  );
}

export default BookingSuccess;