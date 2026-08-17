import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../assets/styles/auth.css";
import "../../assets/styles/login.css";
import useAuth from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();

  // ==========================================================
  // AUTH CONTEXT
  // ==========================================================

  const { loginWithApi } = useAuth();

  // ==========================================================
  // STATE
  // ==========================================================

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // ĐĂNG NHẬP
  // ==========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ========================================================
    // KIỂM TRA SỐ ĐIỆN THOẠI
    // ========================================================

    const cleanPhone = phone.trim();

    if (!cleanPhone) {
      setError("Vui lòng nhập số điện thoại.");
      return;
    }

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setError("Số điện thoại phải gồm đúng 10 chữ số.");
      return;
    }

    // ========================================================
    // KIỂM TRA MẬT KHẨU
    // ========================================================

    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      // ======================================================
      // GỌI BACKEND THÔNG QUA AUTH CONTEXT
      //
      // loginWithApi()
      //      ↓
      // loginApi()
      //      ↓
      // apiClient()
      //      ↓
      // Axios
      //      ↓
      // POST /api/auth/login
      // ======================================================

      console.log(
        "Login.jsx - Đang gọi API login:",
        cleanPhone
      );

      const result = await loginWithApi(
    cleanPhone,
    password
);

console.log(
    "Login result:",
    result
);

console.log(
    "TOKEN AFTER LOGIN:",
    localStorage.getItem("token")
);

      console.log(
        "Login.jsx - Kết quả login:",
        result
      );

      // ======================================================
      // API LOGIN THẤT BẠI
      // ======================================================

      if (!result?.success) {
        setError(
          result?.message ||
            "Sai số điện thoại hoặc mật khẩu."
        );

        return;
      }

      // ======================================================
      // KIỂM TRA USER
      // ======================================================

      if (!result?.user) {
        console.error(
          "Login.jsx - Backend không trả về user:",
          result
        );

        setError(
          "Đăng nhập thất bại: Không nhận được thông tin người dùng."
        );

        return;
      }

      // ======================================================
      // KIỂM TRA TOKEN
      // ======================================================

      if (!result?.token) {
        console.error(
          "Login.jsx - Backend không trả về token:",
          result
        );

        setError(
          "Đăng nhập thất bại: Không nhận được JWT token."
        );

        return;
      }

      // ======================================================
      // USER ĐÃ ĐƯỢC AUTHCONTEXT CHUẨN HÓA
      // ======================================================

      const user = result.user;

      console.log(
        "Login.jsx - Đăng nhập API thành công:",
        user
      );

      console.log(
        "Login.jsx - Role:",
        user.role
      );

      // ======================================================
      // KIỂM TRA ROLE
      // ======================================================

      const validRoles = [
        "admin",
        "staff",
        "customer",
      ];

      const normalizedRole = user.role
        ? String(user.role).toLowerCase()
        : "";

      if (!validRoles.includes(normalizedRole)) {
        console.error(
          "Login.jsx - Role không hợp lệ:",
          normalizedRole
        );

        setError(
          "Tài khoản không có quyền truy cập hợp lệ."
        );

        return;
      }

      // ======================================================
      // LOGIN THÀNH CÔNG
      // ======================================================

      setSuccess(
        "Đăng nhập thành công. Đang chuyển trang..."
      );

      // ======================================================
      // ĐIỀU HƯỚNG THEO ROLE
      // ======================================================

      if (normalizedRole === "admin") {
        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      if (normalizedRole === "staff") {
        navigate(
          "/staff/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      if (normalizedRole === "customer") {
        navigate(
          "/",
          {
            replace: true,
          }
        );

        return;
      }

    } catch (error) {
      console.error(
        "Login.jsx - Login error:",
        error
      );

      setError(
        error?.message ||
          "Không thể kết nối đến backend. Hãy kiểm tra server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="login-page">

      {/* ====================================================
          LEFT - BRANDING
      ==================================================== */}

      <section className="login-visual">

        <div className="visual-overlay"></div>

        <div className="visual-content">

          <div className="brand-badge">
            <i className="bi bi-trophy-fill"></i>
          </div>

          <h1>
            Sport
            <span>
              Management
            </span>
          </h1>

          <p className="visual-description">
            Quản lý sân thể thao,
            lịch đặt sân và người dùng
            một cách đơn giản,
            nhanh chóng và chuyên nghiệp.
          </p>

          <div className="sport-icons">

            <div className="sport-icon">
              <i className="bi bi-trophy"></i>
              <span>
                Thể thao
              </span>
            </div>

            <div className="sport-icon">
              <i className="bi bi-calendar-check"></i>
              <span>
                Đặt sân
              </span>
            </div>

            <div className="sport-icon">
              <i className="bi bi-people"></i>
              <span>
                Quản lý
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          RIGHT - LOGIN
      ==================================================== */}

      <section className="login-panel">

        <div className="login-card">

          {/* ==================================================
              LOGO MOBILE
          ================================================== */}

          <div className="mobile-brand">

            <div className="mobile-brand-icon">
              <i className="bi bi-trophy-fill"></i>
            </div>

            <div>

              <strong>
                Sport Management
              </strong>

              <span>
                System
              </span>

            </div>

          </div>


          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="login-header">

            <span className="welcome-text">
              CHÀO MỪNG TRỞ LẠI
            </span>

            <h2>
              Đăng nhập
            </h2>

            <p>
              Đăng nhập để tiếp tục
              sử dụng hệ thống.
            </p>

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="login-message error-message">

              <i className="bi bi-exclamation-circle-fill"></i>

              <span>
                {error}
              </span>

            </div>
          )}


          {/* ==================================================
              SUCCESS
          ================================================== */}

          {success && (
            <div className="login-message success-message">

              <i className="bi bi-check-circle-fill"></i>

              <span>
                {success}
              </span>

            </div>
          )}


          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleLogin}
            className="login-form"
          >

            {/* ==================================================
                PHONE
            ================================================== */}

            <div className="form-field">

              <label htmlFor="phone">
                Số điện thoại
              </label>

              <div className="modern-input">

                <i className="bi bi-phone"></i>

                <input
                  id="phone"
                  type="text"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                    setPhone(value);

                    if (error) {
                      setError("");
                    }

                  }}
                  disabled={loading}
                />

              </div>

            </div>


            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div className="form-field">

              <div className="password-label-row">

                <label htmlFor="password">
                  Mật khẩu
                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  Quên mật khẩu?
                </Link>

              </div>

              <div className="modern-input">

                <i className="bi bi-lock"></i>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => {

                    setPassword(
                      e.target.value
                    );

                    if (error) {
                      setError("");
                    }

                  }}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Ẩn mật khẩu"
                      : "Hiện mật khẩu"
                  }
                >

                  <i
                    className={
                      showPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                    }
                  ></i>

                </button>

              </div>

            </div>


            {/* ==================================================
                REMEMBER
            ================================================== */}

            <div className="login-options">

              <label className="remember-option">

                <input
                  type="checkbox"
                  id="remember"
                />

                <span className="custom-checkbox">

                  <i className="bi bi-check"></i>

                </span>

                <span>
                  Ghi nhớ đăng nhập
                </span>

              </label>

            </div>


            {/* ==================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>

                  <span>
                    Đang đăng nhập...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Đăng nhập
                  </span>

                  <i className="bi bi-arrow-right"></i>
                </>
              )}

            </button>

          </form>


          {/* ==================================================
              REGISTER
          ================================================== */}

          <div className="register-section">

            <span>
              Chưa có tài khoản?
            </span>

            <Link
              to="/register"
              className="register-link"
            >
              Đăng ký ngay
            </Link>

          </div>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="login-footer">

            <i className="bi bi-shield-check"></i>

            <span>
              Hệ thống được bảo mật
              và quản lý an toàn
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;