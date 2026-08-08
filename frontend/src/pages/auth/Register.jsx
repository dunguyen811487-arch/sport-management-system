import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();

  // =============================
  // Form
  // =============================

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // =============================
  // Handle change
  // =============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================
  // Register
  // =============================

  const handleRegister = async (e) => {
    e.preventDefault();

    // =============================
    // Kiểm tra thông tin
    // =============================

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ thông tin.",
        confirmButtonColor: "#198754",
      });

      return;
    }

    // =============================
    // Kiểm tra số điện thoại
    // =============================

    if (!/^[0-9]{10}$/.test(form.phone)) {
      Swal.fire({
        icon: "error",
        title: "Số điện thoại không hợp lệ",
        text: "Số điện thoại phải gồm đúng 10 chữ số.",
        confirmButtonColor: "#198754",
      });

      return;
    }

    // =============================
    // Kiểm tra email
    // =============================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      Swal.fire({
        icon: "error",
        title: "Email không hợp lệ",
        text: "Vui lòng nhập đúng định dạng email.",
        confirmButtonColor: "#198754",
      });

      return;
    }

    // =============================
    // Kiểm tra mật khẩu
    // =============================

    if (form.password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Mật khẩu quá ngắn",
        text: "Mật khẩu phải có ít nhất 6 ký tự.",
        confirmButtonColor: "#198754",
      });

      return;
    }

    // =============================
    // Kiểm tra xác nhận mật khẩu
    // =============================

    if (
      form.password !==
      form.confirmPassword
    ) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không khớp",
        text: "Vui lòng nhập lại mật khẩu.",
        confirmButtonColor: "#198754",
      });

      return;
    }

    try {
      setLoading(true);

      // =============================
      // Lấy users hiện tại
      // =============================

      const savedUsers =
        localStorage.getItem("users");

      const users = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      // =============================
      // Kiểm tra SĐT đã tồn tại
      // =============================

      const phoneExists = users.some(
        (user) =>
          user.phone === form.phone.trim()
      );

      if (phoneExists) {
        Swal.fire({
          icon: "warning",
          title: "Số điện thoại đã tồn tại",
          text: "Số điện thoại này đã được đăng ký.",
          confirmButtonColor: "#198754",
        });

        return;
      }

      // =============================
      // Kiểm tra email đã tồn tại
      // =============================

      const emailExists = users.some(
        (user) =>
          user.email?.toLowerCase() ===
          form.email.trim().toLowerCase()
      );

      if (emailExists) {
        Swal.fire({
          icon: "warning",
          title: "Email đã tồn tại",
          text: "Email này đã được đăng ký.",
          confirmButtonColor: "#198754",
        });

        return;
      }

      // =============================
      // Tạo user mới
      // =============================

      const newUser = {
        id: Date.now(),

        fullName:
          form.fullName.trim(),

        // Giữ thêm name để tương thích
        // với dữ liệu cũ nếu có
        name:
          form.fullName.trim(),

        phone:
          form.phone.trim(),

        email:
          form.email.trim(),

        password:
          form.password,

        // =============================
        // Thông tin Profile
        // =============================

        dateOfBirth: "",

        gender: "",

        address: "",

        // =============================
        // Quyền
        // =============================

        role: "CUSTOMER",
      };

      // =============================
      // Thêm user vào users
      // =============================

      const updatedUsers = [
        ...users,
        newUser,
      ];

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      // =============================
      // Log để kiểm tra
      // =============================

      console.log(
        "Đăng ký thành công:",
        newUser
      );

      console.log(
        "Danh sách users:",
        updatedUsers
      );

      // =============================
      // Thông báo
      // =============================

      await Swal.fire({
        icon: "success",
        title: "🎉 Đăng ký thành công!",
        html: `
          <p style="font-size:16px;margin-bottom:10px">
            Tài khoản <strong>${newUser.fullName}</strong>
            đã được tạo thành công.
          </p>

          <p style="color:#6c757d;font-size:14px">
            Vui lòng đăng nhập để sử dụng hệ thống.
          </p>
        `,
        confirmButtonText:
          "Đăng nhập ngay",

        confirmButtonColor:
          "#198754",

        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      // =============================
      // Chuyển sang Login
      // =============================

      navigate("/login");

    } catch (error) {
      console.error(
        "Lỗi đăng ký:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: "Có lỗi xảy ra khi tạo tài khoản.",
        confirmButtonColor: "#198754",
      });

    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Render
  // =============================

  return (
    <div
      className="auth-page"
    >

      <div className="auth-card">

        <div className="auth-body">

          {/* =============================
              Logo
          ============================== */}

          <div className="auth-logo">

            <i className="bi bi-person-plus-fill"></i>

            <h3>
              Sport Management System
            </h3>

            <p>
              Tạo tài khoản khách hàng
            </p>

          </div>

          {/* =============================
              Form
          ============================== */}

          <form
            onSubmit={handleRegister}
          >

            {/* Họ tên */}

            <div className="mb-3">

              <label className="form-label">
                Họ và tên
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  <i className="bi bi-person-fill"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={form.fullName}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Số điện thoại */}

            <div className="mb-3">

              <label className="form-label">
                Số điện thoại
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  <i className="bi bi-telephone-fill"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={form.phone}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Email */}

            <div className="mb-3">

              <label className="form-label">
                Email
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  <i className="bi bi-envelope-fill"></i>
                </span>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Nhập email"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={handleChange}
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

            {/* Xác nhận mật khẩu */}

            <div className="mb-4">

              <label className="form-label">
                Xác nhận mật khẩu
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  <i className="bi bi-shield-lock-fill"></i>
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={
                    form.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >

                  <i
                    className={
                      showConfirmPassword
                        ? "bi bi-eye-slash-fill"
                        : "bi bi-eye-fill"
                    }
                  ></i>

                </button>

              </div>

            </div>

            {/* Button */}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                  ></span>

                  Đang đăng ký...
                </>
              ) : (
                <>
                  <i className="bi bi-person-check-fill me-2"></i>

                  Đăng ký
                </>
              )}

            </button>

          </form>

          <hr className="my-4" />

          {/* =============================
              Login
          ============================== */}

          <div className="text-center">

            <span className="text-muted">
              Đã có tài khoản?
            </span>

            <br />

            <Link
              to="/login"
              className="auth-link"
            >
              Đăng nhập ngay
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;