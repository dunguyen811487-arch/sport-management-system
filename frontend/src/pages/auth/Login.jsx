import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/auth.css";

import useAuth from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // =============================
  // Đăng nhập
  // =============================

  const handleLogin = async (e) => {
    e.preventDefault();

    // =============================
    // Kiểm tra số điện thoại
    // =============================

    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại!");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Số điện thoại không hợp lệ!");
      return;
    }

    // =============================
    // Kiểm tra mật khẩu
    // =============================

    if (!password.trim()) {
      alert("Vui lòng nhập mật khẩu!");
      return;
    }

    try {
      setLoading(true);

      // =============================
      // Lấy danh sách user
      // =============================

      const savedUsers =
        localStorage.getItem("users");

      const users = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      // =============================
      // Tìm user
      // =============================

      // =============================
// Tìm user
// =============================

// Tài khoản Admin tạm thời
const ADMIN_ACCOUNT = {
  id: "admin-001",
  fullName: "Quản trị viên",
  name: "Quản trị viên",
  phone: "0900000000",
  email: "admin@sportmanagement.com",
  password: "admin123",
  role: "admin",
};

let foundUser = null;

// =============================
// Kiểm tra tài khoản Admin
// =============================

if (
  phone === ADMIN_ACCOUNT.phone &&
  password === ADMIN_ACCOUNT.password
) {
  foundUser = ADMIN_ACCOUNT;
} else {
  // =============================
  // Kiểm tra user trong localStorage
  // =============================

  foundUser = users.find(
    (item) =>
      item.phone === phone &&
      item.password === password
  );
}

      // =============================
      // Không tìm thấy
      // =============================

      if (!foundUser) {
        alert(
          "Sai số điện thoại hoặc mật khẩu!"
        );

        return;
      }

      // =============================
      // Tạo user dùng cho AuthContext
      // =============================

      const user = {
        id: foundUser.id,

        fullName:
          foundUser.fullName ||
          foundUser.name ||
          "",

        name:
          foundUser.name ||
          foundUser.fullName ||
          "",

        phone: foundUser.phone,

        email: foundUser.email,

        dateOfBirth:
          foundUser.dateOfBirth || "",

        gender:
          foundUser.gender || "",

        address:
          foundUser.address || "",

        role:
          foundUser.role || "customer",
      };

      // =============================
      // Fake token
      // =============================

      const token = "fake-token";

      // =============================
      // Lưu vào AuthContext
      // =============================

      login(user, token);

      console.log(
        "Đăng nhập thành công:",
        user
      );

      // =============================
      // Phân quyền
      // =============================

      switch (user.role) {
  case "admin":
    navigate("/admin/dashboard");
    break;

  case "staff":
    navigate("/staff/dashboard");
    break;

  case "customer":
  default:
    navigate("/");
    break;
}

    } catch (error) {
      console.error(error);

      alert(
        "Có lỗi xảy ra khi đăng nhập!"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">

      <div className="auth-body">

        {/* =============================
            Logo
        ============================== */}

        <div className="auth-logo">

          <i className="bi bi-trophy-fill"></i>

          <h3>
            Sport Management System
          </h3>

          <p>
            Đăng nhập vào hệ thống
          </p>

        </div>

        {/* =============================
            Form
        ============================== */}

        <form onSubmit={handleLogin}>

          {/* Số điện thoại */}

          <div className="mb-3">

            <label className="form-label">
              Số điện thoại
            </label>

            <div className="input-group">

              <span className="input-group-text">

                <i className="bi bi-phone-fill"></i>

              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

            </div>

          </div>

          {/* Mật khẩu */}

          <div className="mb-3">

            <label className="form-label">
              Mật khẩu
            </label>

            <div className="input-group">

              <span className="input-group-text">

                <i className="bi bi-lock-fill"></i>

              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                <i
                  className={
                    showPassword
                      ? "bi bi-eye-slash-fill"
                      : "bi bi-eye-fill"
                  }
                ></i>

              </button>

            </div>

          </div>

          {/* Ghi nhớ + quên mật khẩu */}

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div className="form-check">

              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
              />

              <label
                className="form-check-label"
                htmlFor="remember"
              >
                Ghi nhớ đăng nhập
              </label>

            </div>

            <Link
              to="/forgot-password"
              className="auth-link"
            >
              Quên mật khẩu?
            </Link>

          </div>

          {/* Button */}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >

            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}

          </button>

        </form>
              
        {/* Đăng ký */}

        <div className="text-center mt-4">

          Chưa có tài khoản?{" "}

          <Link
            to="/register"
            className="auth-link"
          >
            Đăng ký
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;