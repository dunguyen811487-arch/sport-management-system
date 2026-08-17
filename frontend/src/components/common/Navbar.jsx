import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

import "../assets/styles/navbar.css";


function Navbar() {

  const navigate =
    useNavigate();


  const {
    isAuthenticated,
    user,
    logout,
  } = useAuth();


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  // ==========================================================
  // ROLE
  // ==========================================================

  const role =
    String(
      user?.role || ""
    ).toLowerCase();


  // ==========================================================
  // USER NAME
  // ==========================================================

  const displayName =
    user?.fullName ||
    user?.name ||
    "Người dùng";


  // ==========================================================
  // USER MENU
  // ==========================================================

  const renderUserMenu = () => {

    // ========================================================
    // ADMIN
    // ========================================================

    if (
      role === "admin"
    ) {

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

            <li>

              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  navigate(
                    "/admin/dashboard"
                  )
                }
              >

                <i className="bi bi-speedometer2 me-2"></i>

                Trang quản trị

              </button>

            </li>


            <li>

              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  navigate(
                    "/admin/users"
                  )
                }
              >

                <i className="bi bi-people-fill me-2"></i>

                Quản lý người dùng

              </button>

            </li>


            <li>

              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  navigate(
                    "/admin/report"
                  )
                }
              >

                <i className="bi bi-bar-chart-fill me-2"></i>

                Báo cáo

              </button>

            </li>


            <li>
              <hr className="dropdown-divider" />
            </li>


            <li>

              <button
                type="button"
                className="dropdown-item text-danger"
                onClick={
                  handleLogout
                }
              >

                <i className="bi bi-box-arrow-right me-2"></i>

                Đăng xuất

              </button>

            </li>

          </ul>

        </div>
      );
    }


    // ========================================================
    // STAFF
    // ========================================================

    if (
      role === "staff"
    ) {

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

            <li>

              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  navigate(
                    "/staff/dashboard"
                  )
                }
              >

                <i className="bi bi-speedometer2 me-2"></i>

                Trang quản lý

              </button>

            </li>


            <li>

              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  navigate(
                    "/staff/field-management"
                  )
                }
              >

                <i className="bi bi-grid-fill me-2"></i>

                Quản lý sân

              </button>

            </li>


            <li>

              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  navigate(
                    "/staff/booking-management"
                  )
                }
              >

                <i className="bi bi-calendar-check-fill me-2"></i>

                Quản lý đặt sân

              </button>

            </li>


            <li>

              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  navigate(
                    "/staff/payment-management"
                  )
                }
              >

                <i className="bi bi-credit-card-fill me-2"></i>

                Thanh toán

              </button>

            </li>


            <li>

              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  navigate(
                    "/staff/statistics"
                  )
                }
              >

                <i className="bi bi-bar-chart-fill me-2"></i>

                Thống kê

              </button>

            </li>


            <li>
              <hr className="dropdown-divider" />
            </li>


            <li>

              <button
                type="button"
                className="dropdown-item text-danger"
                onClick={
                  handleLogout
                }
              >

                <i className="bi bi-box-arrow-right me-2"></i>

                Đăng xuất

              </button>

            </li>

          </ul>

        </div>
      );
    }


    // ========================================================
    // CUSTOMER
    // ========================================================

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

          <li>

            <button
              type="button"
              className="dropdown-item"
              onClick={() =>
                navigate(
                  "/profile"
                )
              }
            >

              <i className="bi bi-person me-2"></i>

              Hồ sơ

            </button>

          </li>


          <li>

            <button
              type="button"
              className="dropdown-item"
              onClick={() =>
                navigate(
                  "/booking-history"
                )
              }
            >

              <i className="bi bi-clock-history me-2"></i>

              Lịch sử đặt sân

            </button>

          </li>


          <li>
            <hr className="dropdown-divider" />
          </li>


          <li>

            <button
              type="button"
              className="dropdown-item text-danger"
              onClick={
                handleLogout
              }
            >

              <i className="bi bi-box-arrow-right me-2"></i>

              Đăng xuất

            </button>

          </li>

        </ul>

      </div>
    );
  };


  // ==========================================================
  // CUSTOMER CLASS
  // ==========================================================

  const isCustomerNavbar =
    role === "customer" ||
    role === "";


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <nav
      className={
        `navbar navbar-expand-lg bg-white shadow-sm px-4 ${
          isCustomerNavbar
            ? "customer-top-navbar"
            : ""
        }`
      }
    >

      {/* ======================================================
          LOGO
      ====================================================== */}

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


      {/* ======================================================
          RIGHT
      ====================================================== */}

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