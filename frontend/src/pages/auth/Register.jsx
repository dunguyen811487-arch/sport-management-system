import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import { registerApi } from "../../api/authApi";

import "../../assets/styles/auth.css";
import "../../assets/styles/register.css";
function Register() {

  const navigate =
    useNavigate();

  // ==========================================================
  // FORM
  // ==========================================================

  const [form, setForm] =
    useState({
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

  const [loading, setLoading] =
    useState(false);

  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // ==========================================================
  // REGISTER
  // ==========================================================

  const handleRegister =
    async (e) => {

      e.preventDefault();

      const cleanFullName =
        form.fullName.trim();

      const cleanPhone =
        form.phone.trim();

      const cleanEmail =
        form.email.trim();

      // ======================================================
      // KIỂM TRA THÔNG TIN
      // ======================================================

      if (
        !cleanFullName ||
        !cleanPhone ||
        !cleanEmail ||
        !form.password.trim() ||
        !form.confirmPassword.trim()
      ) {

        Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin",
          text:
            "Vui lòng nhập đầy đủ thông tin.",
          confirmButtonColor:
            "#198754",
        });

        return;
      }

      // ======================================================
      // KIỂM TRA SỐ ĐIỆN THOẠI
      // ======================================================

      if (
        !/^[0-9]{10}$/.test(
          cleanPhone
        )
      ) {

        Swal.fire({
          icon: "error",
          title:
            "Số điện thoại không hợp lệ",
          text:
            "Số điện thoại phải gồm đúng 10 chữ số.",
          confirmButtonColor:
            "#198754",
        });

        return;
      }

      // ======================================================
      // KIỂM TRA EMAIL
      // ======================================================

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          cleanEmail
        )
      ) {

        Swal.fire({
          icon: "error",
          title:
            "Email không hợp lệ",
          text:
            "Vui lòng nhập đúng định dạng email.",
          confirmButtonColor:
            "#198754",
        });

        return;
      }

      // ======================================================
      // KIỂM TRA PASSWORD
      // ======================================================

      if (
        form.password.length <
        6
      ) {

        Swal.fire({
          icon: "warning",
          title:
            "Mật khẩu quá ngắn",
          text:
            "Mật khẩu phải có ít nhất 6 ký tự.",
          confirmButtonColor:
            "#198754",
        });

        return;
      }

      // ======================================================
      // CONFIRM PASSWORD
      // ======================================================

      if (
        form.password !==
        form.confirmPassword
      ) {

        Swal.fire({
          icon: "error",
          title:
            "Mật khẩu không khớp",
          text:
            "Vui lòng nhập lại mật khẩu.",
          confirmButtonColor:
            "#198754",
        });

        return;
      }

      // ======================================================
      // GỌI API BACKEND
      // ======================================================

      try {

        setLoading(true);

        console.log(
          "Register.jsx - Sending:",
          {
            fullName:
              cleanFullName,

            phone:
              cleanPhone,

            email:
              cleanEmail,
          }
        );

        const response =
          await registerApi({
            fullName:
              cleanFullName,

            phone:
              cleanPhone,

            email:
              cleanEmail,

            password:
              form.password,
          });

        console.log(
          "Register.jsx - Backend response:",
          response
        );

        // ====================================================
        // THÔNG BÁO THÀNH CÔNG
        // ====================================================

        await Swal.fire({
          icon: "success",
          title:
            "🎉 Đăng ký thành công!",

          html: `
            <p style="font-size:16px;margin-bottom:10px">
              Tài khoản <strong>${cleanFullName}</strong>
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

          allowOutsideClick:
            false,

          allowEscapeKey:
            false,
        });

        // ====================================================
        // ĐI LOGIN
        // ====================================================

        navigate(
          "/login",
          {
            replace: true,
          }
        );

      } catch (error) {

        console.error(
          "Register API error:",
          error
        );

        // ====================================================
        // LẤY MESSAGE TỪ API
        // ====================================================

        let message =
          "Có lỗi xảy ra khi tạo tài khoản.";

        if (
          error?.data?.message
        ) {

          message =
            error.data.message;

        } else if (
          error?.message
        ) {

          message =
            error.message;
        }

        Swal.fire({
          icon: "error",
          title:
            "Đăng ký thất bại",
          text:
            message,
          confirmButtonColor:
            "#198754",
        });

      } finally {

        setLoading(false);

      }
    };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-body">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="auth-logo">

            <i className="bi bi-person-plus-fill"></i>

            <h3>
              Sport Management System
            </h3>

            <p>
              Tạo tài khoản khách hàng
            </p>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              handleRegister
            }
          >

            {/* =================================================
                HỌ TÊN
            ================================================= */}

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
                  value={
                    form.fullName
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    loading
                  }
                />

              </div>

            </div>

            {/* =================================================
                SỐ ĐIỆN THOẠI
            ================================================= */}

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
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    loading
                  }
                />

              </div>

            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

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
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    loading
                  }
                />

              </div>

            </div>

            {/* =================================================
                MẬT KHẨU
            ================================================= */}

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
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    loading
                  }
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(
                      (prev) =>
                        !prev
                    )
                  }
                  disabled={
                    loading
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

            {/* =================================================
                XÁC NHẬN MẬT KHẨU
            ================================================= */}

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
                  disabled={
                    loading
                  }
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) =>
                        !prev
                    )
                  }
                  disabled={
                    loading
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

            {/* =================================================
                BUTTON
            ================================================= */}

            <button
              type="submit"
              className="auth-btn"
              disabled={
                loading
              }
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />

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

          {/* =================================================
              LOGIN
          ================================================= */}

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