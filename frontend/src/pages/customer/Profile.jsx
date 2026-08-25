import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";

function Profile() {
  const { user, updateUser } = useAuth();

  // =====================================
  // Form
  // =====================================

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================
  // Lấy thông tin user hiện tại
  // =====================================

  useEffect(() => {
    if (!user) return;

    setForm({
      fullName: user.fullName || user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "",
      address: user.address || "",
    });
  }, [user]);

  // =====================================
  // Handle change
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // Cập nhật hồ sơ
  // =====================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Chưa đăng nhập",
        text: "Vui lòng đăng nhập để cập nhật hồ sơ.",
        confirmButtonColor: "#198754",
      });

      return;
    }

    // =============================
    // Kiểm tra họ tên
    // =============================

    if (!form.fullName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu họ và tên",
        text: "Vui lòng nhập họ và tên.",
        confirmButtonColor: "#198754",
      });

      return;
    }

    // =============================
    // Kiểm tra email
    // =============================

    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        Swal.fire({
          icon: "error",
          title: "Email không hợp lệ",
          text: "Vui lòng nhập đúng định dạng email.",
          confirmButtonColor: "#198754",
        });

        return;
      }
    }

    try {
      setLoading(true);

      // =====================================
      // User mới
      // =====================================

      const updatedUser = {
        ...user,

        fullName: form.fullName.trim(),

        // Giữ name để những component cũ
        // đang dùng user.name vẫn hoạt động
        name: form.fullName.trim(),

        phone: form.phone,

        email: form.email.trim(),

        dateOfBirth: form.dateOfBirth,

        gender: form.gender,

        address: form.address.trim(),
      };

      // =====================================
      // Cập nhật users
      // =====================================

      const savedUsers = localStorage.getItem("users");

      const users = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      const updatedUsers = users.map((item) => {
        if (String(item.id) === String(user.id)) {
          return {
            ...item,
            ...updatedUser,
          };
        }

        return item;
      });

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      // =====================================
      // Cập nhật AuthContext
      // =====================================

      updateUser(updatedUser);

      // =====================================
      // Thông báo
      // =====================================

      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Thông tin hồ sơ của bạn đã được cập nhật.",
        confirmButtonColor: "#198754",
      });

    } catch (error) {
      console.error(
        "Lỗi cập nhật hồ sơ:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: "Không thể cập nhật hồ sơ.",
        confirmButtonColor: "#198754",
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Chưa đăng nhập
  // =====================================

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Vui lòng đăng nhập để xem hồ sơ.
        </div>
      </div>
    );
  }

  // =====================================
  // Giao diện
  // =====================================

  return (
    <div className="container-fluid py-4">

      {/* ================================
          Header
      ================================= */}

      <div className="mb-4">

        <h2 className="fw-bold text-success">
          Hồ sơ cá nhân
        </h2>

        <p className="text-muted">
          Quản lý thông tin tài khoản của bạn.
        </p>

      </div>

      {/* ================================
          Profile Card
      ================================= */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          {/* ==============================
              Avatar + thông tin cơ bản
          =============================== */}

          <div className="d-flex align-items-center mb-4">

            <div
              className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "80px",
                height: "80px",
                fontSize: "32px",
              }}
            >
              {(
                form.fullName ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="ms-3">

              <h4 className="fw-bold mb-1">
                {form.fullName || "Người dùng"}
              </h4>

              <span className="text-muted">
                {user.role === "CUSTOMER" ||
                user.role === "customer"
                  ? "Khách hàng"
                  : user.role}
              </span>

            </div>

          </div>

          <hr />

          {/* ==============================
              Form
          =============================== */}

          <form onSubmit={handleUpdate}>

            <div className="row">

              {/* Họ tên */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
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
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                  />

                </div>

              </div>

              {/* Số điện thoại */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Số điện thoại
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <i className="bi bi-telephone-fill"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    value={form.phone}
                    disabled
                  />

                </div>

                <small className="text-muted">
                  Số điện thoại không thể thay đổi.
                </small>

              </div>

              {/* Email */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
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
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                  />

                </div>

              </div>

              {/* Ngày sinh */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Ngày sinh
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <i className="bi bi-calendar-event-fill"></i>
                  </span>

                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* Giới tính */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Giới tính
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <i className="bi bi-gender-ambiguous"></i>
                  </span>

                  <select
                    className="form-select"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >

                    <option value="">
                      -- Chọn giới tính --
                    </option>

                    <option value="Nam">
                      Nam
                    </option>

                    <option value="Nữ">
                      Nữ
                    </option>

                    <option value="Khác">
                      Khác
                    </option>

                  </select>

                </div>

              </div>

              {/* Địa chỉ */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Địa chỉ
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <i className="bi bi-geo-alt-fill"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                  />

                </div>

              </div>

            </div>

            {/* ==============================
                Button
            =============================== */}

            <div className="d-flex justify-content-end mt-4">

              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={loading}
              >

                <i className="bi bi-check-circle-fill me-2"></i>

                {loading
                  ? "Đang cập nhật..."
                  : "Cập nhật hồ sơ"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Profile;