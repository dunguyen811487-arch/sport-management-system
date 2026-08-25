import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-trophy-fill me-2"></i>
          Sport Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >

          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/fields">
                Danh sách sân
              </Link>
            </li>

          </ul>

          {!isAuthenticated ? (

            <div className="d-flex">

              <Link
                to="/login"
                className="btn btn-outline-light me-2"
              >
                Đăng nhập
              </Link>

              <Link
                to="/register"
                className="btn btn-light"
              >
                Đăng ký
              </Link>

            </div>

          ) : (

            <div className="dropdown">

              <button
                className="btn btn-success dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-2"></i>

                {user?.fullName}
              </button>

              <ul className="dropdown-menu dropdown-menu-end">

                <li>

                  <Link
                    className="dropdown-item"
                    to="/profile"
                  >
                    Hồ sơ
                  </Link>

                </li>

                <li>

                  <Link
                    className="dropdown-item"
                    to="/booking-history"
                  >
                    Lịch sử đặt sân
                  </Link>

                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>

                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>

                </li>

              </ul>

            </div>

          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;