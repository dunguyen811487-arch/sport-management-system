import { Badge, Button, Card } from "react-bootstrap";
import {
  Eye,
  XCircle,
} from "react-bootstrap-icons";

import formatCurrency from "../../utils/formatCurrency";

import { useNavigate } from "react-router-dom";

function BookingCard({
  booking,
  onCancel,
}) {
  const {
    bookingCode,
    field,
    bookingDate,
    startTime,
    endTime,
    totalPrice,
    paymentMethod,
    status,
  } = booking;

  const navigate = useNavigate();

  // =============================
  // Trạng thái booking
  // =============================

  const getStatus = () => {
    switch (status) {
      // =============================
      // Chờ xác nhận
      // =============================

      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Chờ xác nhận
          </Badge>
        );

      // =============================
      // Đã xác nhận
      // =============================

      case "confirmed":
        return (
          <Badge bg="success">
            Đã xác nhận
          </Badge>
        );

      // =============================
      // Đang yêu cầu hủy
      // =============================

      case "cancellation_requested":
        return (
          <Badge bg="warning" text="dark">
            Đang chờ xác nhận hủy
          </Badge>
        );

      // =============================
      // Đã hủy
      // =============================

      case "cancelled":
        return (
          <Badge bg="danger">
            Đã hủy
          </Badge>
        );

      // =============================
      // Không xác định
      // =============================

      default:
        return (
          <Badge bg="secondary">
            Không xác định
          </Badge>
        );
    }
  };

  return (
    <Card className="booking-card shadow-sm border-0 mb-4">

      <div className="row g-0">

        {/* =============================
            Ảnh sân
        ============================== */}

        <div className="col-md-3">

          <img
            src={field.image}
            alt={field.fieldName}
            className="booking-history-image"
          />

        </div>

        {/* =============================
            Thông tin booking
        ============================== */}

        <div className="col-md-6">

          <Card.Body>

            {/* Mã booking */}

            <div className="booking-code">
              {bookingCode}
            </div>

            {/* Tên sân */}

            <h4 className="fw-bold mt-2">
              {field.fieldName}
            </h4>

            {/* Ngày */}

            <p>
              📅{" "}
              <strong>
                Ngày:
              </strong>{" "}
              {bookingDate}
            </p>

            {/* Giờ */}

            <p>
              🕒{" "}
              <strong>
                Giờ:
              </strong>{" "}
              {startTime} - {endTime}
            </p>

            {/* Địa điểm */}

            <p>
              📍{" "}
              <strong>
                Địa điểm:
              </strong>{" "}
              {field.location}
            </p>

            {/* Thanh toán */}

            <p>
              💳{" "}
              <strong>
                Thanh toán:
              </strong>{" "}
              {paymentMethod}
            </p>

          </Card.Body>

        </div>

        {/* =============================
            Giá + trạng thái + nút
        ============================== */}

        <div className="col-md-3">

          <Card.Body className="text-md-end">

            {/* Tổng tiền */}

            <small className="text-muted">
              Tổng tiền
            </small>

            <h3 className="text-success fw-bold">
              {formatCurrency(totalPrice)}
            </h3>

            {/* Trạng thái */}

            <div className="my-3">
              {getStatus()}
            </div>

            {/* =============================
                Buttons
            ============================== */}

            <div className="d-grid gap-2">

              {/* =============================
                  Chi tiết
              ============================== */}

              <Button
                variant="outline-success"
                onClick={() =>
                  navigate(
                    `/booking-history/${booking._id}`,
                    {
                      state: booking,
                    }
                  )
                }
              >
                <Eye className="me-2" />

                Chi tiết
              </Button>

              {/* =============================
                  Yêu cầu hủy
                  
                  Chỉ booking pending mới
                  được yêu cầu hủy
              ============================== */}

              {status === "pending" && (
                <Button
                  variant="outline-danger"
                  onClick={() =>
                    onCancel(bookingCode)
                  }
                >
                  <XCircle className="me-2" />

                  Yêu cầu hủy
                </Button>
              )}

              {/* =============================
                  Đang chờ nhân viên xác nhận
              ============================== */}

              {status ===
                "cancellation_requested" && (
                <Button
                  variant="outline-warning"
                  disabled
                >
                  <i className="bi bi-clock me-2"></i>

                  Đang chờ xác nhận
                </Button>
              )}

            </div>

          </Card.Body>

        </div>

      </div>

    </Card>
  );
}

export default BookingCard;