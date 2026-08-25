import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import formatCurrency from "../../utils/formatCurrency";

import PaymentModal from "../../components/customer/PaymentModal";

import "../../assets/styles/booking-confirm.css";

function BookingConfirm() {

  const navigate = useNavigate();

  const { state } = useLocation();

  const { user } = useAuth();

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

  } = state;

  const [note, setNote] = useState("");

  const [showPayment, setShowPayment] = useState(false);

  // =============================
  // Hiển thị khung giờ
  // =============================

  const bookingTime = () => {

    if (selectedSlots.length === 0) {

      return "Chưa chọn";

    }

    const sorted = [...selectedSlots].sort();

    const first = sorted[0];

    const lastHour =
      parseInt(sorted[sorted.length - 1].split(":")[0]) + 1;

    const last = `${lastHour.toString().padStart(2, "0")}:00`;

    return `${first} - ${last}`;

  };

  return (

    <div className="container py-4">

      <h2 className="fw-bold text-success mb-4">

        Xác nhận đặt sân

      </h2>
            {/* ================= Thông tin sân ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="row">

            <div className="col-md-4">

              <img
                src={field.image}
                alt={field.fieldName}
                className="confirm-image"
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

              <h3 className="text-success fw-bold">

                {formatCurrency(field.pricePerHour)}

                <small className="text-muted">

                  / giờ

                </small>

              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Thông tin lịch ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <h4 className="fw-bold mb-3">

            📅 Thông tin lịch đặt

          </h4>

          <table className="table align-middle">

            <tbody>

              <tr>

                <th width="180">

                  Ngày đặt

                </th>

                <td>

                  {bookingDate}

                </td>

              </tr>

              <tr>

                <th>

                  Khung giờ

                </th>

                <td>

                  {bookingTime()}

                </td>

              </tr>

              <tr>

                <th>

                  Số giờ

                </th>

                <td>

                  {totalHours} giờ

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= Người đặt ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <h4 className="fw-bold mb-3">

            👤 Người đặt

          </h4>

          <table className="table align-middle">

            <tbody>

              <tr>

                <th width="180">

                  Họ và tên

                </th>

                <td>

                  {user?.fullName}

                </td>

              </tr>

              <tr>

                <th>

                  Số điện thoại

                </th>

                <td>

                  {user?.phone}

                </td>

              </tr>

              <tr>

                <th>

                  Email

                </th>

                <td>

                  {user?.email}

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= Ghi chú ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <h4 className="fw-bold mb-3">

            📝 Ghi chú

          </h4>

          <textarea

            rows="4"

            className="form-control"

            placeholder="Nhập ghi chú (nếu có)..."

            value={note}

            onChange={(e) =>
              setNote(e.target.value)
            }

          />

        </div>

      </div>
            {/* ================= Tổng thanh toán ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <h4 className="fw-bold mb-4">

            💰 Tổng thanh toán

          </h4>

          <div className="row">

            <div className="col-md-8">

              <table className="table">

                <tbody>

                  <tr>

                    <th width="220">

                      Đơn giá

                    </th>

                    <td>

                      {formatCurrency(field.pricePerHour)}

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

                      Khung giờ

                    </th>

                    <td>

                      {bookingTime()}

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            <div className="col-md-4">

              <div className="payment-summary">

                <small className="text-muted">

                  Thành tiền

                </small>

                <h2 className="text-success fw-bold mt-2">

                  {formatCurrency(totalPrice)}

                </h2>

                <span className="badge bg-warning text-dark mt-2">

                  Chưa thanh toán

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Button ================= */}

      <div className="d-flex justify-content-between align-items-center">

        <button
          className="btn btn-outline-secondary btn-lg"
          onClick={() => navigate(-1)}
        >

          <i className="bi bi-arrow-left me-2"></i>

          Quay lại

        </button>

        <button
          className="btn btn-success btn-lg"
          onClick={() => setShowPayment(true)}
        >

          <i className="bi bi-credit-card me-2"></i>

          Thanh toán

        </button>

      </div>

      {/* ================= Modal ================= */}

      <PaymentModal

        show={showPayment}

        onClose={() => setShowPayment(false)}

        booking={{

          field,

          bookingDate,

          selectedSlots,

          totalHours,

          totalPrice,

          note,

        }}

      />
          </div>

  );

}

export default BookingConfirm;