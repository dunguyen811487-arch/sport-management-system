import { NavLink, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../assets/styles/sidebar.css";
import { useState } from "react";
import ComingSoonToast from "../common/ComingSoonToast";

function CustomerSidebar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showToast, setShowToast] = useState(false);

  const handleComingSoon = (e) => {
    e.preventDefault();
    setShowToast(true);
  };

  return (
    <aside className="customer-sidebar">

      {/* ===== Logo ===== */}

      <div className="sidebar-header">
        <i className="bi bi-trophy-fill"></i>
        <h4>Sport Management</h4>
      </div>

      {/* ===== Menu ===== */}

      <nav className="sidebar-menu">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="bi bi-house-door-fill"></i>
          Trang chủ
        </NavLink>

        <NavLink
          to="/fields"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="bi bi-grid-fill"></i>
          Danh sách sân
        </NavLink>

        <button
          type="button"
          className="sidebar-link border-0 bg-transparent w-100 text-start"
          onClick={handleComingSoon}
        >
          <i className="bi bi-geo-alt-fill"></i>
          <span>Bản đồ</span>

          <span className="badge bg-warning text-dark ms-auto">
            Soon
          </span>
        </button>

        <button
          type="button"
          className="sidebar-link border-0 bg-transparent w-100 text-start"
          onClick={handleComingSoon}
        >
          <i className="bi bi-heart-fill"></i>
          <span>Yêu thích</span>

          <span className="badge bg-warning text-dark ms-auto">
            Soon
          </span>
        </button>

        <button
          type="button"
          className="sidebar-link border-0 bg-transparent w-100 text-start"
          onClick={handleComingSoon}
        >
          <i className="bi bi-newspaper"></i>
          <span>Tin tức</span>

          <span className="badge bg-warning text-dark ms-auto">
            Soon
          </span>
        </button>

      </nav>

      {!isAuthenticated ? (
        <>

          <hr />

          <div className="sidebar-title">
            TÀI KHOẢN
          </div>

          <Link
            to="/login"
            className="btn btn-success w-100 mb-2"
          >
            Đăng nhập
          </Link>

          <Link
            to="/register"
            className="btn btn-outline-success w-100"
          >
            Đăng ký
          </Link>

        </>
      ) : (
        <>

          {/* ===== Menu Customer ===== */}

          <hr />

          <NavLink
            to="/booking-history"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="bi bi-clock-history"></i>
            Lịch sử đặt
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="bi bi-person-fill"></i>
            Hồ sơ
          </NavLink>

          {/* ===== Đẩy xuống cuối ===== */}

          <div className="sidebar-bottom">

            <hr />

            <div className="sidebar-user">

              <div className="avatar">
                {user?.fullName?.charAt(0) || "U"}
              </div>

              <div>

                <strong>
                  {user?.fullName}
                </strong>

                <p className="mb-0">
                  Customer
                </p>

              </div>

            </div>

            <button
              className="btn btn-danger w-100 mt-3"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>

              Đăng xuất
            </button>

          </div>

        </>
      )}

      <ComingSoonToast
        show={showToast}
        onClose={() => setShowToast(false)}
      />

    </aside>
  );
}

export default CustomerSidebar;