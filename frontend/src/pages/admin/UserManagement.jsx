import { useEffect, useState } from "react";

function UserManagement() {
  const [users, setUsers] = useState([]);

  // Form tạo Staff
  const [showStaffForm, setShowStaffForm] = useState(false);

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    phone: "",
    password: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const savedUsers = localStorage.getItem("users");

      const parsedUsers = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      setUsers(Array.isArray(parsedUsers) ? parsedUsers : []);
    } catch (error) {
      console.error("Lỗi đọc danh sách user:", error);
      setUsers([]);
    }
  };

  // ==========================================
  // XÓA USER
  // ==========================================

  const handleDeleteUser = (user) => {
    // Không cho Admin tự xóa chính mình
    const currentUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (
      currentUser &&
      user.id === currentUser.id
    ) {
      alert("Bạn không thể tự xóa tài khoản Admin đang đăng nhập!");
      return;
    }

    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa tài khoản "${user.fullName || user.name}" không?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const savedUsers = localStorage.getItem("users");

      const currentUsers = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      const newUsers = currentUsers.filter(
        (item) => item.id !== user.id
      );

      localStorage.setItem(
        "users",
        JSON.stringify(newUsers)
      );

      setUsers(newUsers);

      alert("Đã xóa tài khoản thành công!");
    } catch (error) {
      console.error("Lỗi xóa user:", error);

      alert("Không thể xóa tài khoản!");
    }
  };

  // ==========================================
  // FORM STAFF
  // ==========================================

  const handleStaffChange = (e) => {
    const { name, value } = e.target;

    setStaffForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // TẠO STAFF
  // ==========================================

  const handleCreateStaff = (e) => {
    e.preventDefault();

    const {
      fullName,
      phone,
      password,
      email,
      gender,
      dateOfBirth,
      address,
    } = staffForm;

    // ------------------------------------------
    // Kiểm tra
    // ------------------------------------------

    if (!fullName.trim()) {
      alert("Vui lòng nhập họ tên nhân viên!");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Số điện thoại phải gồm 10 chữ số!");
      return;
    }

    if (!password.trim()) {
      alert("Vui lòng nhập mật khẩu!");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const savedUsers = localStorage.getItem("users");

      const currentUsers = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      // ------------------------------------------
      // Kiểm tra SĐT đã tồn tại
      // ------------------------------------------

      const existingUser = currentUsers.find(
        (item) => item.phone === phone
      );

      if (existingUser) {
        alert(
          "Số điện thoại này đã được sử dụng!"
        );
        return;
      }

      // ------------------------------------------
      // Tạo Staff
      // ------------------------------------------

      const newStaff = {
        id: `staff_${Date.now()}`,

        fullName: fullName.trim(),

        name: fullName.trim(),

        phone: phone,

        password: password,

        email: email.trim(),

        gender: gender,

        dateOfBirth: dateOfBirth,

        address: address.trim(),

        role: "staff",
      };

      // ------------------------------------------
      // Lưu
      // ------------------------------------------

      const newUsers = [
        ...currentUsers,
        newStaff,
      ];

      localStorage.setItem(
        "users",
        JSON.stringify(newUsers)
      );

      setUsers(newUsers);

      // Reset form
      setStaffForm({
        fullName: "",
        phone: "",
        password: "",
        email: "",
        gender: "",
        dateOfBirth: "",
        address: "",
      });

      setShowStaffForm(false);

      alert(
        `Tạo tài khoản Staff thành công!\n\nSố điện thoại: ${phone}\nMật khẩu: ${password}`
      );
    } catch (error) {
      console.error(
        "Lỗi tạo tài khoản Staff:",
        error
      );

      alert(
        "Có lỗi xảy ra khi tạo tài khoản Staff!"
      );
    }
  };

  // ==========================================
  // ROLE TEXT
  // ==========================================

  const getRoleText = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "Admin";

      case "staff":
        return "Nhân viên";

      case "customer":
        return "Khách hàng";

      default:
        return "Không xác định";
    }
  };

  // ==========================================
  // ROLE BADGE
  // ==========================================

  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-danger";

      case "staff":
        return "bg-warning text-dark";

      case "customer":
        return "bg-success";

      default:
        return "bg-secondary";
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="container-fluid">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h1 className="mb-1">
            Quản lý người dùng
          </h1>

          <p className="text-muted mb-0">
            Quản lý tài khoản Customer, Staff và Admin
          </p>
        </div>

        <button
          className="btn btn-success"
          onClick={() =>
            setShowStaffForm(!showStaffForm)
          }
        >
          <i className="bi bi-person-plus-fill me-2"></i>

          Tạo tài khoản Staff
        </button>

      </div>

      {/* ======================================
          FORM TẠO STAFF
      ======================================= */}

      {showStaffForm && (
        <div className="card shadow-sm mb-4">

          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-person-badge-fill me-2"></i>
              Tạo tài khoản nhân viên
            </h5>
          </div>

          <div className="card-body">

            <form onSubmit={handleCreateStaff}>

              <div className="row">

                {/* Họ tên */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Họ và tên *
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="Nguyễn Văn A"
                    value={staffForm.fullName}
                    onChange={handleStaffChange}
                  />

                </div>

                {/* SĐT */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Số điện thoại *
                  </label>

                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="0987654321"
                    maxLength="10"
                    value={staffForm.phone}
                    onChange={handleStaffChange}
                  />

                </div>

                {/* Mật khẩu */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Mật khẩu *
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Ít nhất 6 ký tự"
                    value={staffForm.password}
                    onChange={handleStaffChange}
                  />

                </div>

                {/* Email */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="staff@example.com"
                    value={staffForm.email}
                    onChange={handleStaffChange}
                  />

                </div>

                {/* Ngày sinh */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Ngày sinh
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={staffForm.dateOfBirth}
                    onChange={handleStaffChange}
                  />

                </div>

                {/* Giới tính */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Giới tính
                  </label>

                  <select
                    name="gender"
                    className="form-select"
                    value={staffForm.gender}
                    onChange={handleStaffChange}
                  >
                    <option value="">
                      Chọn giới tính
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

                {/* Địa chỉ */}

                <div className="col-12 mb-3">

                  <label className="form-label">
                    Địa chỉ
                  </label>

                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="Địa chỉ nhân viên"
                    value={staffForm.address}
                    onChange={handleStaffChange}
                  />

                </div>

              </div>

              {/* Buttons */}

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-success"
                >
                  <i className="bi bi-check-lg me-2"></i>

                  Tạo Staff
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setShowStaffForm(false)
                  }
                >
                  Hủy
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ======================================
          THỐNG KÊ
      ======================================= */}

      <div className="row mb-4">

        <div className="col-md-4">

          <div className="card shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Tổng tài khoản
              </h6>

              <h2>
                {users.length}
              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Khách hàng
              </h6>

              <h2>
                {
                  users.filter(
                    (user) =>
                      user.role?.toLowerCase() ===
                      "customer"
                  ).length
                }
              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Nhân viên
              </h6>

              <h2>
                {
                  users.filter(
                    (user) =>
                      user.role?.toLowerCase() ===
                      "staff"
                  ).length
                }
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          USER TABLE
      ======================================= */}

      <div className="card shadow-sm">

        <div className="card-header">

          <h5 className="mb-0">
            Danh sách tài khoản
          </h5>

        </div>

        <div className="card-body p-0">

          {users.length === 0 ? (

            <div className="text-center p-5">

              <i className="bi bi-people fs-1 text-muted"></i>

              <p className="text-muted mt-2 mb-0">
                Chưa có tài khoản nào
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Họ tên
                    </th>

                    <th>
                      Số điện thoại
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th className="text-center">
                      Thao tác
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map(
                    (user, index) => (

                      <tr key={user.id || index}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {
                              user.fullName ||
                              user.name ||
                              "Không có tên"
                            }
                          </strong>
                        </td>

                        <td>
                          {user.phone || "-"}
                        </td>

                        <td>
                          {user.email || "-"}
                        </td>

                        <td>

                          <span
                            className={`badge ${getRoleClass(
                              user.role
                            )}`}
                          >
                            {getRoleText(
                              user.role
                            )}
                          </span>

                        </td>

                        <td className="text-center">

                          {user.role?.toLowerCase() ===
                          "admin" ? (

                            <span className="text-muted">
                              Tài khoản hệ thống
                            </span>

                          ) : (

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteUser(
                                  user
                                )
                              }
                            >
                              <i className="bi bi-trash-fill me-1"></i>

                              Xóa
                            </button>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default UserManagement;