import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import formatCurrency from "../../utils/formatCurrency";

import "../../assets/styles/payment.css";

function Payment() {
  const navigate = useNavigate();

  const { state } = useLocation();

  // ==========================================
  // Không có dữ liệu thanh toán
  // ==========================================

  if (!state) {
    navigate("/fields");
    return null;
  }

  const {
    field,
    bookingDate,
    selectedSlots,
    totalHours,
    totalPrice,
    paymentMethod,
    note,
    bookingCode,
  } = state;

  const [timeLeft, setTimeLeft] = useState(15 * 60);

  // ==========================================
  // Countdown
  // ==========================================

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Phiên thanh toán đã hết hạn.");

      navigate("/booking-history");

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // ==========================================
  // Format thời gian
  // ==========================================

  const minutes = String(
    Math.floor(timeLeft / 60)
  ).padStart(2, "0");

  const seconds = String(
    timeLeft % 60
  ).padStart(2, "0");

  // ==========================================
  // Khung giờ
  // ==========================================

  const bookingTime = () => {
    if (!selectedSlots || selectedSlots.length === 0) {
      return "Chưa xác định";
    }

    const sorted = [...selectedSlots].sort();

    const first = sorted[0];

    const lastHour =
      parseInt(
        sorted[sorted.length - 1].split(":")[0],
        10
      ) + 1;

    return `${first} - ${String(lastHour).padStart(
      2,
      "0"
    )}:00`;
  };

  // ==========================================
  // Khách bấm "Tôi đã thanh toán"
  // ==========================================

  const handleSuccess = () => {
    /*
     * QUAN TRỌNG:
     *
     * Khách KHÔNG được tự chuyển paymentStatus
     * thành "paid".
     *
     * Chỉ gửi yêu cầu cho nhân viên xác nhận.
     */

    const updatedBooking = {
      ...state,

      paymentStatus: "waiting_confirmation",

      status: "pending",

      paymentRequestedAt: new Date().toISOString(),
    };

    // ==========================================
    // Cập nhật booking trong LocalStorage
    // ==========================================

    const savedBookings =
      JSON.parse(
        localStorage.getItem("bookings")
      ) || [];

    const updatedBookings =
      savedBookings.map((booking) => {
        if (
          booking.bookingCode ===
          updatedBooking.bookingCode
        ) {
          return {
            ...booking,
            paymentStatus:
              "waiting_confirmation",
            status: "pending",
            paymentRequestedAt:
              updatedBooking.paymentRequestedAt,
          };
        }

        return booking;
      });

    localStorage.setItem(
      "bookings",
      JSON.stringify(updatedBookings)
    );

    // ==========================================
    // Sang trang thành công
    // ==========================================

    navigate("/booking-success", {
      state: {
        booking: updatedBooking,
      },
    });
  };

  return (
    <div className="container py-5">

      {/* ==========================================
          HEADER
      ========================================== */}

      <h2 className="fw-bold text-success mb-4">
        Thanh toán
      </h2>

      <div className="row g-4">

        {/* ==========================================
            THÔNG TIN ĐƠN
        ========================================== */}

        <div className="col-lg-7">

          <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

              <h4 className="fw-bold mb-4">
                🏟️ Thông tin đơn đặt sân
              </h4>

              <div className="row">

                <div className="col-md-4">

                  <img
                    src={field.image}
                    alt={field.fieldName}
                    className="img-fluid rounded"
                    style={{
                      height: "180px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />

                </div>

                <div className="col-md-8">

                  <h3 className="fw-bold">
                    {field.fieldName}
                  </h3>

                  <span className="badge bg-success mb-3">
                    {field.fieldType}
                  </span>

                  <p>
                    <i className="bi bi-grid-fill me-2"></i>
                    {field.subType}
                  </p>

                  <p>
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {field.location}
                  </p>

                  <p>
                    <i className="bi bi-calendar-event me-2"></i>
                    {bookingDate}
                  </p>

                  <p>
                    <i className="bi bi-clock-fill me-2"></i>
                    {bookingTime()}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================
              CHI TIẾT THANH TOÁN
          ========================================== */}

          <div className="card shadow-sm border-0">

            <div className="card-body">

              <h4 className="fw-bold mb-4">
                📄 Chi tiết thanh toán
              </h4>

              <table className="table">

                <tbody>

                  <tr>
                    <th width="220">
                      Mã đặt sân
                    </th>

                    <td>
                      <strong>
                        {bookingCode || "Đang cập nhật"}
                      </strong>
                    </td>
                  </tr>

                  <tr>
                    <th>
                      Đơn giá
                    </th>

                    <td>
                      {formatCurrency(
                        field.pricePerHour
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th>
                      Số giờ thuê
                    </th>

                    <td>
                      {totalHours} giờ
                    </td>
                  </tr>

                  <tr>
                    <th>
                      Phương thức
                    </th>

                    <td>
                      {paymentMethod}
                    </td>
                  </tr>

                  <tr>
                    <th>
                      Ghi chú
                    </th>

                    <td>
                      {note || "Không có"}
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* ==========================================
            QR THANH TOÁN
        ========================================== */}

        <div className="col-lg-5">

          <div className="card shadow-sm border-0">

            <div className="card-body text-center">

              <h4 className="fw-bold mb-3">
                💳 Thanh toán
              </h4>

              <h2 className="text-success fw-bold mb-4">
                {formatCurrency(totalPrice)}
              </h2>

              {/* Countdown */}

              <div className="alert alert-warning">

                ⏳ Thời gian còn lại

                <h3 className="mt-2 mb-0">
                  {minutes}:{seconds}
                </h3>

              </div>

              {/* ==========================================
                  QR
              ========================================== */}

              <div className="border rounded p-4 bg-light mb-4">

                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SPORT-MANAGEMENT-DEMO"
                  alt="QR Payment"
                  className="img-fluid"
                  style={{
                    maxWidth: "250px",
                  }}
                />

              </div>

              <h5 className="fw-bold">
                {paymentMethod}
              </h5>

              <p className="text-muted mb-4">
                Quét mã QR bằng ứng dụng ngân hàng
                hoặc VNPay để thanh toán.
              </p>

              {/* ==========================================
                  THÔNG TIN NGÂN HÀNG
              ========================================== */}

              <div className="text-start border rounded p-3 mb-4">

                <div className="d-flex justify-content-between">

                  <span>
                    Ngân hàng
                  </span>

                  <strong>
                    MB Bank
                  </strong>

                </div>

                <hr />

                <div className="d-flex justify-content-between">

                  <span>
                    Số tài khoản
                  </span>

                  <strong>
                    0123456789
                  </strong>

                </div>

                <hr />

                <div className="d-flex justify-content-between">

                  <span>
                    Chủ tài khoản
                  </span>

                  <strong>
                    SPORT MANAGEMENT
                  </strong>

                </div>

                <hr />

                <div className="d-flex justify-content-between">

                  <span>
                    Nội dung CK
                  </span>

                  <strong>
                    {bookingCode || "SPORT-MANAGEMENT"}
                  </strong>

                </div>

              </div>

              {/* ==========================================
                  BUTTON
              ========================================== */}

              <div className="d-grid gap-3">

                <button
                  className="btn btn-success btn-lg"
                  onClick={handleSuccess}
                >
                  <i className="bi bi-send-check-fill me-2"></i>

                  Tôi đã thanh toán
                </button>

                <small className="text-muted">
                  Sau khi chuyển khoản, hãy bấm nút trên.
                  Nhân viên sẽ kiểm tra và xác nhận
                  thanh toán cho bạn.
                </small>

                <button
                  className="btn btn-outline-danger"
                  onClick={() => navigate(-1)}
                >
                  Hủy thanh toán
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Payment;