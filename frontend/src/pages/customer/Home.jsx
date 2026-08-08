import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import FieldDetail from "./FieldDetail";

import formatCurrency from "../../utils/formatCurrency";

import "../../assets/styles/home.css";
const featuredFields = [
  {
    _id: "1",
    fieldName: "Sân bóng đá A",
    fieldType: "Bóng đá",
    subType: "Sân 7 người",
    location: "Khu A",
    pricePerHour: 250000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=900",
    description: "Sân cỏ nhân tạo đạt chuẩn FIFA.",
    status: "active",
  },

  {
    _id: "2",
    fieldName: "Sân bóng đá B",
    fieldType: "Bóng đá",
    subType: "Sân 5 người",
    location: "Khu A",
    pricePerHour: 180000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900",
    description: "Có đèn LED ban đêm.",
    status: "active",
  },

  {
    _id: "3",
    fieldName: "Sân cầu lông 01",
    fieldType: "Cầu lông",
    subType: "2 sân tiêu chuẩn",
    location: "Khu B",
    pricePerHour: 80000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900",
    description: "Sàn PVC chống trượt.",
    status: "active",
  },

  {
    _id: "4",
    fieldName: "Sân Pickleball 01",
    fieldType: "Pickleball",
    subType: "Ngoài trời",
    location: "Khu C",
    pricePerHour: 120000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1666811094885-9eb97d0dbb75?w=900",
    description: "Mặt sân Acrylic đạt chuẩn.",
    status: "active",
  },

  {
    _id: "5",
    fieldName: "Sân bóng chuyền 01",
    fieldType: "Bóng chuyền",
    subType: "Trong nhà",
    location: "Khu D",
    pricePerHour: 150000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900",
    description: "Sân thi đấu tiêu chuẩn.",
    status: "active",
  },
];

const promotions = [
  {
    id: 1,
    title: "Đặt sớm - Giảm 20%",
    description: "Đặt sân trước 3 ngày để nhận ưu đãi.",
    icon: "bi-calendar2-check",
    color: "success",
  },
  {
    id: 2,
    title: "Khung giờ vàng",
    description: "Giảm giá khi đặt sân từ 08:00 - 10:00.",
    icon: "bi-clock-fill",
    color: "warning",
  },
  {
    id: 3,
    title: "Khách hàng thân thiết",
    description: "Tích điểm sau mỗi lần đặt sân.",
    icon: "bi-stars",
    color: "primary",
  },
];

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [selectedField, setSelectedField] = useState(null);

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleBooking = (field) => {

  if (!isAuthenticated) {

    alert("Vui lòng đăng nhập để đặt sân!");

    navigate("/login");

    return;

  }


  navigate("/booking", {
  state: {
    field,
  },
});

};

  return (
    <div className="container-fluid">

      {/* ================= Hero ================= */}

      {!isAuthenticated ? (

        <div className="hero-banner">

          <div className="hero-left">

            <h2>
              ⚽ Đặt sân chưa bao giờ dễ đến thế
            </h2>

            <p>
              Tìm sân • Đặt lịch • Thanh toán nhanh chóng chỉ trong vài phút.
            </p>

            <div className="mt-4">

              <Link
                to="/fields"
                className="btn btn-light btn-lg me-3"
              >
                Khám phá sân
              </Link>

              <Link
                to="/login"
                className="btn btn-outline-light btn-lg"
              >
                Đăng nhập
              </Link>

            </div>

          </div>

          <div className="hero-right">

            <img
              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900"
              alt="Sport"
            />

          </div>

        </div>

      ) : (

        <div className="welcome-banner">

          <div className="welcome-left">

            <div className="avatar-circle">

              {user?.fullName?.charAt(0)}

            </div>

            <div className="welcome-info">

              <p className="welcome-date">

                {today}

              </p>

              <h2>

                Xin chào, {user?.fullName}

              </h2>

              <span>

                Chúc bạn có một ngày tuyệt vời!

              </span>

            </div>

          </div>

          <button className="notify-btn">

            <i className="bi bi-bell-fill"></i>

          </button>

        </div>

      )}

      {/* ================= Search ================= */}

      <div className="search-panel">

        <div className="search-input">

          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Tìm kiếm sân, địa điểm..."
          />

        </div>

        <div className="shortcut-menu">

          <div className="shortcut-item">

            <i className="bi bi-map-fill"></i>

            <span>Bản đồ</span>

          </div>

          <div className="shortcut-item">

            <i className="bi bi-calendar-check-fill"></i>

            <span>Đã đặt</span>

          </div>

          <div className="shortcut-item">

            <i className="bi bi-heart-fill"></i>

            <span>Yêu thích</span>

          </div>

        </div>

      </div>

      {/* ================= Statistics ================= */}

      <div className="row g-4 mb-5">

        <div className="col-lg-4">

          <div className="stat-card">

            <i className="bi bi-grid-fill"></i>

            <h3>7</h3>

            <p>Sân đang hoạt động</p>

          </div>

        </div>

        <div className="col-lg-4">

          <div className="stat-card">

            <i className="bi bi-calendar-check-fill"></i>

            <h3>10</h3>

            <p>Lượt đặt hôm nay</p>

          </div>

        </div>

        <div className="col-lg-4">

          <div className="stat-card">

            <i className="bi bi-star-fill"></i>

            <h3>4.9</h3>

            <p>Đánh giá trung bình</p>

          </div>

        </div>

      </div>
          {/* ================= Featured Fields ================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h3 className="fw-bold">
          🔥 Sân nổi bật
        </h3>

        <Link
          to="/fields"
          className="btn btn-success"
        >
          Xem tất cả
        </Link>

      </div>

      <div className="row">

        {featuredFields.map((field) => (

          <div
            className="col-lg-4 col-md-6 mb-4"
            key={field._id}
          >

            <div
              className="field-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedField(field)}
            >

              <img
                src={field.image}
                alt={field.fieldName}
              />

              <div className="p-3">

                <h5>{field.fieldName}</h5>
                    <p className="text-muted mb-1">
                      {field.fieldType}
                    </p>
                <p className="text-muted mb-2">

                  <i className="bi bi-geo-alt-fill me-2"></i>

                  {field.location}

                </p>

                <h4 className="text-success">

                  {formatCurrency(field.pricePerHour)}

                </h4>

                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBooking(field);
                  }}
                >
                  Đặt sân
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ================= Promotion ================= */}

      <div className="mt-5">

        <h3 className="fw-bold mb-4">

          🎁 Ưu đãi dành cho bạn

        </h3>

        <div className="row g-4">

          {promotions.map((item) => (

            <div
              className="col-lg-4"
              key={item.id}
            >

              <div className="promotion-card">

                <div className={`promotion-icon bg-${item.color}`}>

                  <i className={`bi ${item.icon}`}></i>

                </div>

                <div>

                  <h5>{item.title}</h5>

                  <p>{item.description}</p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= Review ================= */}

      <div className="mt-5">

        <h3 className="fw-bold mb-4">

          ⭐ Đánh giá khách hàng

        </h3>

        <div className="row g-4">

          <div className="col-lg-4">

            <div className="review-card">

              <div className="mb-3 text-warning">

                ⭐⭐⭐⭐⭐

              </div>

              <p>

                "Đặt sân rất nhanh, giao diện đẹp và dễ sử dụng."

              </p>

              <strong>

                Nguyễn Văn A

              </strong>

            </div>

          </div>

          <div className="col-lg-4">

            <div className="review-card">

              <div className="mb-3 text-warning">

                ⭐⭐⭐⭐⭐

              </div>

              <p>

                "Thanh toán nhanh, sân đúng như hình."

              </p>

              <strong>

                Trần Văn B

              </strong>

            </div>

          </div>

          <div className="col-lg-4">

            <div className="review-card">

              <div className="mb-3 text-warning">

                ⭐⭐⭐⭐⭐

              </div>

              <p>

                "Đặt sân chỉ mất vài phút, rất tiện lợi."

              </p>

              <strong>

                Lê Minh C

              </strong>

            </div>

          </div>

        </div>

      </div>
            {/* ================= Footer ================= */}
      {selectedField && (
        <FieldDetail
            field={selectedField}
            onClose={() => setSelectedField(null)}
            onBooking={() => handleBooking(selectedField)}
        />
      )}
      <footer className="footer mt-5">

        <div className="row">

          <div className="col-lg-4 mb-4">

            <h4 className="fw-bold text-success">

              <i className="bi bi-trophy-fill me-2"></i>

              Sport Management

            </h4>

            <p className="text-muted mt-3">

              Hệ thống hỗ trợ tìm kiếm, đặt sân và thanh toán trực tuyến
              nhanh chóng, an toàn và tiện lợi.

            </p>

          </div>

          <div className="col-lg-4 mb-4">

            <h5 className="fw-bold">

              Liên kết

            </h5>

            <ul className="list-unstyled mt-3">

              <li className="mb-2">

                <Link
                  to="/"
                  className="footer-link"
                >
                  Trang chủ
                </Link>

              </li>

              <li className="mb-2">

                <Link
                  to="/fields"
                  className="footer-link"
                >
                  Danh sách sân
                </Link>

              </li>

              <li className="mb-2">

                <Link
                  to="/booking"
                  className="footer-link"
                >
                  Đặt sân
                </Link>

              </li>

            </ul>

          </div>

          <div className="col-lg-4 mb-4">

            <h5 className="fw-bold">

              Liên hệ

            </h5>

            <p className="mt-3 mb-2">

              <i className="bi bi-telephone-fill me-2 text-success"></i>

              0123 456 789

            </p>

            <p className="mb-2">

              <i className="bi bi-envelope-fill me-2 text-success"></i>

              sport@gmail.com

            </p>

            <p>

              <i className="bi bi-geo-alt-fill me-2 text-success"></i>

              Trà Vinh, Việt Nam

            </p>

          </div>

        </div>

        <hr />

        <div className="text-center text-muted">

          © 2026 Sport Management System. All rights reserved.

        </div>

      </footer>

    </div>
  );
}

export default Home;