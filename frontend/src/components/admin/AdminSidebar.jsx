
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Bạn có chắc muốn đăng xuất không?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // MENU CLASS
  // ==========================================================

  const getNavClass = ({ isActive }) => {
    return `
      nav-link
      d-flex
      align-items-center
      px-3
      py-2
      mb-1
      rounded
      ${
        isActive
          ? "bg-primary text-white"
          : "text-white"
      }
    `;
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <aside
      className="bg-dark text-white d-flex flex-column"
      style={{
        width: "250px",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center">

          <div
            className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{
              width: "40px",
              height: "40px",
              minWidth: "40px",
            }}
          >
            <i className="bi bi-shield-lock-fill"></i>
          </div>

          <div className="text-truncate">

            <div className="fw-bold">
              Admin Panel
            </div>

            <small className="text-secondary">
              Quản trị hệ thống
            </small>

          </div>

        </div>
      </div>

      {/* =====================================================
          MENU
      ===================================================== */}

      <nav className="p-3 flex-grow-1">

        {/* Dashboard */}

        <NavLink
          to="/admin/dashboard"
          className={getNavClass}
        >
          <i className="bi bi-speedometer2 me-3"></i>

          <span>
            Dashboard
          </span>
        </NavLink>

        {/* Users */}

        <NavLink
          to="/admin/users"
          className={getNavClass}
        >
          <i className="bi bi-people-fill me-3"></i>

          <span>
            Quản lý người dùng
          </span>
        </NavLink>

        {/* Field Types */}

        <NavLink
          to="/admin/field-types"
          className={getNavClass}
        >
          <i className="bi bi-grid-3x3-gap-fill me-3"></i>

          <span>
            Quản lý loại sân
          </span>
        </NavLink>

        {/* Fields */}

        <NavLink
          to="/admin/fields"
          className={getNavClass}
        >
          <i className="bi bi-building-fill me-3"></i>

          <span>
            Quản lý sân
          </span>
        </NavLink>

        {/* Bookings */}

        <NavLink
          to="/admin/bookings"
          className={getNavClass}
        >
          <i className="bi bi-calendar-check-fill me-3"></i>

          <span>
            Quản lý đặt sân
          </span>
        </NavLink>

        {/* Payments */}

        <NavLink
          to="/admin/payments"
          className={getNavClass}
        >
          <i className="bi bi-credit-card-fill me-3"></i>

          <span>
            Quản lý thanh toán
          </span>
        </NavLink>

        {/* Report */}

        <NavLink
          to="/admin/report"
          className={getNavClass}
        >
          <i className="bi bi-bar-chart-fill me-3"></i>

          <span>
            Báo cáo
          </span>
        </NavLink>

      </nav>

      {/* =====================================================
          ADMIN INFO + LOGOUT
      ===================================================== */}

      <div className="p-3 border-top border-secondary">

        {/* Admin */}

        <div className="d-flex align-items-center mb-3">

          <div
            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{
              width: "38px",
              height: "38px",
              minWidth: "38px",
            }}
          >
            <i className="bi bi-person-fill"></i>
          </div>

          <div className="text-truncate">

            <div className="fw-semibold text-truncate">
              Admin
            </div>

            <small className="text-secondary">
              Quản trị viên
            </small>

          </div>

        </div>

        {/* Logout */}

        <button
          type="button"
          className="btn btn-outline-light w-100"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>

          Đăng xuất
        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;

