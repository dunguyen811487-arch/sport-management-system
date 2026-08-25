import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import formatCurrency from "../../utils/formatCurrency";

function PaymentModal({
  show,
  onClose,
  booking,
}) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [method, setMethod] = useState("cash");

  // =============================
  // Tiếp tục thanh toán
  // =============================

  const handleContinue = () => {
    // =============================
    // Kiểm tra booking
    // =============================

    if (!booking || !booking.field) {
      alert("Không tìm thấy thông tin đặt sân.");
      return;
    }

    if (
      !booking.selectedSlots ||
      booking.selectedSlots.length === 0
    ) {
      alert("Không tìm thấy khung giờ đặt sân.");
      return;
    }

    // =============================
    // Tạo mã đặt sân
    // =============================

    const bookingCode =
      "BK" +
      Date.now().toString().slice(-6);

    // =============================
    // Tính giờ bắt đầu - kết thúc
    // =============================

    const sortedSlots = [
      ...booking.selectedSlots,
    ].sort();

    const startTime = sortedSlots[0];

    const endHour =
      parseInt(
        sortedSlots[
          sortedSlots.length - 1
        ].split(":")[0],
        10
      ) + 1;

    const endTime =
      `${String(endHour).padStart(2, "0")}:00`;

    // =============================
    // Xác định phương thức
    // =============================

    const paymentMethod =
      method === "cash"
        ? "Tiền mặt"
        : method === "vnpay"
        ? "VNPay"
        : "MoMo";

    // =============================
    // Trạng thái thanh toán
    // =============================

    let paymentStatus = "pending";

    /*
      cash:
      → Chưa thanh toán
      → Nhân viên xác nhận sau

      vnpay:
      → Chưa xác nhận
      → Khách chuyển khoản rồi gửi yêu cầu
      → Nhân viên xác nhận

      momo:
      → Chưa triển khai
    */

    // =============================
    // Booking object
    // =============================

    const bookingData = {
      _id: Date.now().toString(),

      bookingCode,

      userId: user?.id,

      field: booking.field,

      bookingDate: booking.bookingDate,

      startTime,

      endTime,

      selectedSlots: booking.selectedSlots,

      totalHours: booking.totalHours,

      totalPrice: booking.totalPrice,

      paymentMethod,

      paymentStatus,

      status: "pending",

      note: booking.note || "",

      /*
        Dùng để đánh dấu khách đã gửi
        yêu cầu xác nhận thanh toán.
      */
      paymentConfirmationRequested: false,

      user: {
        fullName: user?.fullName,
        phone: user?.phone,
        email: user?.email,
      },
    };

    // =============================
    // Lưu LocalStorage
    // =============================

    const oldBookings = JSON.parse(
      localStorage.getItem("bookings") || "[]"
    );

    oldBookings.unshift(bookingData);

    localStorage.setItem(
      "bookings",
      JSON.stringify(oldBookings)
    );

    // =============================
    // TIỀN MẶT
    // =============================

    if (method === "cash") {
      onClose();

      navigate("/booking-success", {
        state: bookingData,
      });

      return;
    }

    // =============================
    // VNPAY
    // =============================

    if (method === "vnpay") {
      onClose();

      navigate("/payment", {
        state: bookingData,
      });

      return;
    }

    // =============================
    // MOMO
    // =============================

    if (method === "momo") {
      alert(
        "MoMo sẽ được cập nhật trong phiên bản tiếp theo."
      );

      return;
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          💳 Chọn phương thức thanh toán
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* =============================
            Tổng thanh toán
        ============================== */}

        <div className="alert alert-success">
          <div className="d-flex justify-content-between">
            <span>
              Tổng thanh toán
            </span>

            <strong>
              {formatCurrency(
                booking?.totalPrice || 0
              )}
            </strong>
          </div>
        </div>

        <Form>

          {/* =============================
              Tiền mặt
          ============================== */}

          <div className="payment-method mb-3">

            <Form.Check
              type="radio"
              id="cash"
              name="payment"
              checked={method === "cash"}
              onChange={() =>
                setMethod("cash")
              }
              label={
                <div>
                  <h6 className="mb-1">
                    💵 Thanh toán tại quầy
                  </h6>

                  <small className="text-muted">
                    Thanh toán trực tiếp khi đến sân.
                    Nhân viên sẽ xác nhận thanh toán.
                  </small>
                </div>
              }
            />

          </div>

          {/* =============================
              VNPay
          ============================== */}

          <div className="payment-method mb-3">

            <Form.Check
              type="radio"
              id="vnpay"
              name="payment"
              checked={method === "vnpay"}
              onChange={() =>
                setMethod("vnpay")
              }
              label={
                <div>
                  <h6 className="mb-1">
                    💳 VNPay
                  </h6>

                  <small className="text-muted">
                    Thanh toán online bằng VNPay.
                    Sau khi chuyển khoản, nhân viên
                    sẽ kiểm tra và xác nhận.
                  </small>
                </div>
              }
            />

          </div>

          {/* =============================
              MoMo
          ============================== */}

          <div className="payment-method">

            <Form.Check
              type="radio"
              id="momo"
              name="payment"
              checked={method === "momo"}
              onChange={() =>
                setMethod("momo")
              }
              label={
                <div className="d-flex justify-content-between align-items-center w-100">

                  <div>

                    <h6 className="mb-1">
                      📱 MoMo
                    </h6>

                    <small className="text-muted">
                      Sẽ được cập nhật trong
                      phiên bản tiếp theo.
                    </small>

                  </div>

                  <span className="badge bg-warning text-dark">
                    Soon
                  </span>

                </div>
              }
            />

          </div>

        </Form>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={onClose}
        >
          Hủy
        </Button>

        <Button
          variant="success"
          onClick={handleContinue}
        >
          Tiếp tục
        </Button>

      </Modal.Footer>

    </Modal>
  );
}

export default PaymentModal;