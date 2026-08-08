import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    user,
    logout,
  } = useAuth();

  // =============================
  // Đăng xuất
  // =============================

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // =============================
  // Role
  // Backend sử dụng chữ thường:
  // admin / staff / customer
  // =============================

  const role = user?.role?.toLowerCase();

  // =============================
  // Tên người dùng
  // =============================

  const displayName =
    user?.fullName ||
    user?.name ||
    "Người dùng";

  // =============================
  // Navbar theo role
  // =============================

  const renderUserMenu = () => {
    // =====================================
    // ADMIN
    // =====================================

    if (role === "admin") {
      return (
        <div className="dropdown">

          <button
            className="btn btn-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle me-2"></i>

            {displayName}
          </button>

          <ul className="dropdown-menu dropdown-menu-end">

            {/* Dashboard */}

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
              >
                <i className="bi bi-speedometer2 me-2"></i>

                Trang quản trị
              </button>
            </li>

            {/* Quản lý người dùng */}

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  navigate("/admin/users")
                }
              >
                <i className="bi bi-people-fill me-2"></i>

                Quản lý người dùng
              </button>
            </li>

            {/* Báo cáo */}

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  navigate("/admin/report")
                }
              >
                <i className="bi bi-bar-chart-fill me-2"></i>

                Báo cáo
              </button>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            {/* Đăng xuất */}

            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>

                Đăng xuất
              </button>
            </li>

          </ul>
        </div>
      );
    }

    // =====================================
    // STAFF
    // =====================================

    if (role === "staff") {
      return (
        <div className="dropdown">

          <button
            className="btn btn-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle me-2"></i>

            {displayName}
          </button>

          <ul className="dropdown-menu dropdown-menu-end">

            {/* Dashboard */}

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  navigate("/staff/dashboard")
                }
              >
                <i className="bi bi-speedometer2 me-2"></i>

                Trang quản lý
              </button>
            </li>

            {/* Quản lý sân */}

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  navigate("/staff/field-management")
                }
              >
                <i className="bi bi-grid-fill me-2"></i>

                Quản lý sân
              </button>
            </li>

            {/* Quản lý đặt sân */}

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  navigate("/staff/booking-management")
                }
              >
                <i className="bi bi-calendar-check-fill me-2"></i>

                Quản lý đặt sân
              </button>
            </li>

            {/* Thanh toán */}

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  navigate("/staff/payment-management")
                }
              >
                <i className="bi bi-credit-card-fill me-2"></i>

                Thanh toán
              </button>
            </li>

            {/* Thống kê */}

            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  navigate("/staff/statistics")
                }
              >
                <i className="bi bi-bar-chart-fill me-2"></i>

                Thống kê
              </button>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            {/* Đăng xuất */}

            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>

                Đăng xuất
              </button>
            </li>

          </ul>
        </div>
      );
    }

    // =====================================
    // CUSTOMER
    // =====================================

    return (
      <div className="dropdown">

        <button
          className="btn btn-light dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-person-circle me-2"></i>

          {displayName}
        </button>

        <ul className="dropdown-menu dropdown-menu-end">

          {/* Hồ sơ */}

          <li>
            <button
              className="dropdown-item"
              onClick={() =>
                navigate("/profile")
              }
            >
              <i className="bi bi-person me-2"></i>

              Hồ sơ
            </button>
          </li>

          {/* Lịch sử đặt sân */}

          <li>
            <button
              className="dropdown-item"
              onClick={() =>
                navigate("/booking-history")
              }
            >
              <i className="bi bi-clock-history me-2"></i>

              Lịch sử đặt sân
            </button>
          </li>

          <li>
            <hr className="dropdown-divider" />
          </li>

          {/* Đăng xuất */}

          <li>
            <button
              className="dropdown-item text-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>

              Đăng xuất
            </button>
          </li>

        </ul>
      </div>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">

      {/* =========================
          Logo
      ========================== */}

      <Link
        className="navbar-brand fw-bold text-success fs-4"
        to={
          role === "admin"
            ? "/admin/dashboard"
            : role === "staff"
            ? "/staff/dashboard"
            : "/"
        }
      >
        <i className="bi bi-trophy-fill me-2"></i>

        Sport Management
      </Link>

      {/* =========================
          User
      ========================== */}

      <div className="ms-auto">

        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="btn btn-outline-success me-2"
            >
              Đăng nhập
            </Link>

            <Link
              to="/register"
              className="btn btn-success"
            >
              Đăng ký
            </Link>
          </>
        ) : (
          renderUserMenu()
        )}

      </div>

    </nav>
  );
}

export default Navbar;