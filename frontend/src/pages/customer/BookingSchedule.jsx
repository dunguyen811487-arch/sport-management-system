import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../../assets/styles/booking-schedule.css";
import formatCurrency from "../../utils/formatCurrency";

import useAuth from "../../hooks/useAuth";

function BookingSchedule() {
  const navigate = useNavigate();

  // =============================
  // User đang đăng nhập
  // =============================

  const { user } = useAuth();

  // =============================
  // Nhận dữ liệu từ FieldDetail
  // =============================

  const { state } = useLocation();

  console.log("==============");
  console.log("BookingSchedule state =", state);
  console.log("field =", state?.field);
  console.log(
    "field JSON =",
    JSON.stringify(state?.field, null, 2)
  );
  console.log("user =", user);
  console.log("==============");

  const field = state?.field;

  // =============================
  // Kiểm tra sân
  // =============================

  if (!field) {
    navigate("/fields");
    return null;
  }

  // =============================
  // Khung giờ hoạt động
  // =============================

  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  // =============================
  // Mock giờ đã được đặt
  // =============================

  const bookedSlots = [
    "08:00",
    "09:00",
    "15:00",
  ];

  // =============================
  // State
  // =============================

  const [bookingDate, setBookingDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [selectedSlots, setSelectedSlots] =
    useState([]);

  // =============================
  // Chọn giờ
  // =============================

  const toggleSlot = (slot) => {
    // Không cho chọn giờ đã đặt
    if (bookedSlots.includes(slot)) {
      return;
    }

    // Nếu đã chọn -> bỏ chọn
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(
        selectedSlots.filter(
          (item) => item !== slot
        )
      );
    } else {
      // Nếu chưa chọn -> thêm vào
      setSelectedSlots([
        ...selectedSlots,
        slot,
      ]);
    }
  };

  // =============================
  // Tổng số giờ
  // =============================

  const totalHours =
    selectedSlots.length;

  // =============================
  // Tổng tiền
  // =============================

  const totalPrice =
    totalHours * field.pricePerHour;

  // =============================
  // Hiển thị khoảng thời gian
  // =============================

  const selectedTime = useMemo(() => {
    if (selectedSlots.length === 0) {
      return "Chưa chọn";
    }

    const sorted = [
      ...selectedSlots,
    ].sort();

    const first = sorted[0];

    const last =
      timeSlots[
        timeSlots.indexOf(
          sorted[sorted.length - 1]
        ) + 1
      ] ||
      sorted[sorted.length - 1];

    return `${first} - ${last}`;
  }, [selectedSlots]);

  // =============================
  // Sang bước xác nhận
  // =============================

  const nextStep = () => {
    // =============================
    // Chưa chọn giờ
    // =============================

    if (selectedSlots.length === 0) {
      alert(
        "Vui lòng chọn ít nhất 1 khung giờ."
      );

      return;
    }

    // =============================
    // Kiểm tra đăng nhập
    // =============================

    if (!user) {
      alert(
        "Vui lòng đăng nhập trước khi đặt sân."
      );

      navigate("/login");

      return;
    }

    // =============================
    // Kiểm tra user.id
    // =============================

    if (!user.id) {
      console.error(
        "Không tìm thấy ID người dùng:",
        user
      );

      alert(
        "Không xác định được tài khoản đang đăng nhập."
      );

      return;
    }

    // =============================
    // Chuyển sang trang xác nhận
    // =============================

    navigate("/booking-confirm", {
      state: {
        field,

        bookingDate,

        selectedSlots,

        totalHours,

        totalPrice,

        // =============================
        // Tài khoản đang đặt sân
        // =============================

        userId: user.id,

        user: user,
      },
    });
  };

  return (
    <div className="container py-4">

      {/* ================= Header ================= */}

      <div className="booking-header shadow-sm">

        <img
          src={field.image}
          alt={field.fieldName}
          className="booking-image"
        />

        <div className="booking-info">

          <h2>
            {field.fieldName}
          </h2>

          <span className="badge bg-success mb-2">
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

            {formatCurrency(
              field.pricePerHour
            )}

            <small className="text-muted">
              / giờ
            </small>

          </h3>

        </div>

      </div>

      {/* ================= Chọn ngày ================= */}

      <div className="card border-0 shadow-sm mt-4">

        <div className="card-body">

          <h4 className="mb-3">
            📅 Chọn ngày đặt sân
          </h4>

          <input
            type="date"
            className="form-control"
            value={bookingDate}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setBookingDate(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* ================= Timeline ================= */}

      <div className="card border-0 shadow-sm mt-4">

        <div className="card-body">

          <h4 className="mb-4">
            🕒 Chọn khung giờ
          </h4>

          <div className="timeline-grid">

            {timeSlots.map(
              (slot) => {

                const booked =
                  bookedSlots.includes(
                    slot
                  );

                const selected =
                  selectedSlots.includes(
                    slot
                  );

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={booked}
                    className={`
                      time-slot
                      ${booked ? "booked" : ""}
                      ${
                        selected
                          ? "selected"
                          : ""
                      }
                    `}
                    onClick={() =>
                      toggleSlot(slot)
                    }
                  >
                    {slot}
                  </button>
                );
              }
            )}

          </div>

          {/* ================= Chú thích ================= */}

          <div className="d-flex gap-4 mt-4">

            <div className="legend-item">

              <span className="legend available"></span>

              Còn trống

            </div>

            <div className="legend-item">

              <span className="legend selected"></span>

              Đang chọn

            </div>

            <div className="legend-item">

              <span className="legend booked"></span>

              Đã đặt

            </div>

          </div>

        </div>

      </div>

      {/* ================= Tóm tắt đặt sân ================= */}

      <div className="card border-0 shadow-sm mt-4">

        <div className="card-body">

          <h4 className="mb-4">
            📋 Thông tin đặt sân
          </h4>

          <div className="row">

            <div className="col-md-6">

              <table className="table">

                <tbody>

                  <tr>
                    <th>
                      Tên sân
                    </th>

                    <td>
                      {field.fieldName}
                    </td>
                  </tr>

                  <tr>
                    <th>
                      Loại sân
                    </th>

                    <td>
                      {field.subType}
                    </td>
                  </tr>

                  <tr>
                    <th>
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
                      {selectedTime}
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

            <div className="col-md-6">

              <div className="price-box">

                <h5 className="mb-3">
                  💰 Chi phí
                </h5>

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Đơn giá
                  </span>

                  <strong>
                    {formatCurrency(
                      field.pricePerHour
                    )}
                  </strong>

                </div>

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Số giờ
                  </span>

                  <strong>
                    {totalHours}
                  </strong>

                </div>

                <hr />

                <div className="d-flex justify-content-between">

                  <h4>
                    Tổng cộng
                  </h4>

                  <h3 className="text-success">

                    {formatCurrency(
                      totalPrice
                    )}

                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Button ================= */}

      <div className="d-flex justify-content-between mt-4">

        <button
          type="button"
          className="btn btn-outline-secondary btn-lg"
          onClick={() =>
            navigate(-1)
          }
        >
          ← Quay lại
        </button>

        <button
          type="button"
          className="btn btn-success btn-lg"
          onClick={nextStep}
        >
          Tiếp tục →
        </button>

      </div>

    </div>
  );
}

export default BookingSchedule;