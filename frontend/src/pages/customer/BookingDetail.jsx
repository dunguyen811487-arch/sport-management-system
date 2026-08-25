import { Badge } from "react-bootstrap";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../config/api";
import useAuth from "../../hooks/useAuth";
import formatCurrency from "../../utils/formatCurrency";

import "../../assets/styles/booking-detail.css";

function BookingDetail() {
 const navigate = useNavigate();

const { state } = useLocation();

const { id } = useParams();
console.log("==========");
console.log("id =", id);
console.log("state =", state);
console.log("==========");
const { user } = useAuth();

const [booking, setBooking] = useState(state || null);

const [loading, setLoading] = useState(false);
const handleCancel = () => {
  const confirm = window.confirm("Bạn có chắc muốn hủy đặt sân?");

  if (!confirm) return;

  const updatedBooking = {
    ...booking,
    status: "cancelled",
  };

  setBooking(updatedBooking);

  // Cập nhật localStorage
  const bookings =
    JSON.parse(localStorage.getItem("bookings")) || [];

  const updatedBookings = bookings.map((item) =>
    item._id === booking._id ? updatedBooking : item
  );

  localStorage.setItem(
    "bookings",
    JSON.stringify(updatedBookings)
  );

  alert("Đã hủy đặt sân thành công!");
};
useEffect(() => {
  // Nếu đi từ BookingHistory sang thì dùng dữ liệu đã truyền
  if (state) {
    setBooking(state);
    return;
  }

  // Nếu F5 hoặc truy cập trực tiếp thì đọc từ localStorage
  const bookings =
    JSON.parse(localStorage.getItem("bookings")) || [];

  const found = bookings.find(
    (item) => item._id === id
  );

  if (found) {
    setBooking(found);
  } else {
    navigate("/booking-history");
  }

  // =============================
  // Khi backend hoàn thành
  // =============================
  /*
  const fetchBooking = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/bookings/${id}`);

      setBooking(res.data.data);
    } catch (err) {
      console.error(err);
      navigate("/booking-history");
    } finally {
      setLoading(false);
    }
  };

  fetchBooking();
  */
}, [id, state, navigate]);

if (loading) {

  return (

    <div className="container py-5 text-center">

      <div className="spinner-border text-success"></div>

      <p className="mt-3">

        Đang tải...

      </p>

    </div>

  );

}

if (!booking) {

  return (

    <div className="container py-5 text-center">

      <h3>Không tìm thấy đơn đặt sân</h3>

      <button
        className="btn btn-success mt-3"
        onClick={() => navigate("/booking-history")}
      >

        Quay lại

      </button>

    </div>

  );

}

  // =============================
  // Badge trạng thái
  // =============================

  const renderStatus = () => {
    switch (booking.status) {
      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Chờ xác nhận
          </Badge>
        );

      case "confirmed":
        return (
          <Badge bg="success">
            Đã xác nhận
          </Badge>
        );

      case "cancelled":
        return (
          <Badge bg="danger">
            Đã hủy
          </Badge>
        );

      default:
        return (
          <Badge bg="secondary">
            Không xác định
          </Badge>
        );
    }
  };
  const isPending = booking.status === "pending";
const isConfirmed = booking.status === "confirmed";
const isCancelled = booking.status === "cancelled";
  return (
    <div className="container py-4">

      {/* ================= Header ================= */}

      <h2 className="fw-bold text-success mb-4">

        Chi tiết đặt sân

      </h2>

      {/* ================= Progress ================= */}

<div className="booking-progress mb-5">

  <div className="step active">
    ✓
    <span>Đặt lịch</span>
  </div>

  <div className="line active"></div>

  <div className="step active">
    ✓
    <span>Thanh toán</span>
  </div>

  <div className={`line ${isConfirmed ? "active" : ""}`}></div>

  <div className={`step ${isConfirmed ? "active" : ""}`}>
    {isConfirmed ? "✓" : isCancelled ? "✕" : "⏳"}

    <span>
      {isConfirmed
        ? "Hoàn tất"
        : isCancelled
        ? "Đã hủy"
        : "Chờ xác nhận"}
    </span>
  </div>

</div>

      {/* ================= Thông tin sân ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="row">

            <div className="col-md-4">

              <img
                src={booking.field.image}
                alt={booking.field.fieldName}
                className="detail-image"
              />

            </div>

            <div className="col-md-8">

              <div className="d-flex justify-content-between">

                <h3 className="fw-bold">

                  {booking.field.fieldName}

                </h3>

                {renderStatus()}

              </div>

              <p className="text-muted mt-3">

                📍 {booking.field.location}

              </p>

              <h2 className="text-success fw-bold">

                {formatCurrency(booking.totalPrice)}

              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Thông tin đặt sân ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <h4 className="fw-bold mb-3">

            📅 Thông tin đặt sân

          </h4>

          <table className="table">

            <tbody>

              <tr>

                <th width="220">

                  Mã đặt sân

                </th>

                <td>

                  {booking.bookingCode}

                </td>

              </tr>

              <tr>

                <th>

                  Ngày đặt

                </th>

                <td>

                  {booking.bookingDate}

                </td>

              </tr>

              <tr>

                <th>

                  Khung giờ

                </th>

                <td>

                  {booking.startTime} - {booking.endTime}

                </td>

              </tr>

              <tr>

                <th>

                  Tổng tiền

                </th>

                <td className="fw-bold text-success">

                  {formatCurrency(booking.totalPrice)}

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

          <table className="table">

            <tbody>

              <tr>

                <th width="220">

                  Họ và tên

                </th>

                <td>

                  {booking.user?.fullName || user?.fullName || "Khách hàng"}

                </td>

              </tr>

              <tr>

                <th>

                  Số điện thoại

                </th>

                <td>

                  {booking.user?.phone || user?.phone || "---"}

                </td>

              </tr>

              <tr>

                <th>

                  Email

                </th>

                <td>

                  {booking.user?.email || user?.email || "---"}

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= Thanh toán ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <h4 className="fw-bold mb-3">

            💳 Thanh toán

          </h4>

          <table className="table">

            <tbody>

              <tr>

                <th width="220">

                  Phương thức

                </th>

                <td>

                  {booking.paymentMethod}

                </td>

              </tr>

              <tr>

                <th>

                  Trạng thái

                </th>

                <td>

                  {renderStatus()}

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

          <p className="text-muted">

            {booking.note || "Không có ghi chú."}

          </p>

        </div>

      </div>

      {/* ================= Button ================= */}

      <div className="d-flex justify-content-between">

        <button
          className="btn btn-outline-secondary btn-lg"
          onClick={() => navigate(-1)}
        >

          ← Quay lại

        </button>

        {booking.status === "pending" && (

          <button
            className="btn btn-danger btn-lg"
            onClick={handleCancel}
          >
            Hủy đặt sân
          </button>

        )}

      </div>

    </div>
  );
}

export default BookingDetail;