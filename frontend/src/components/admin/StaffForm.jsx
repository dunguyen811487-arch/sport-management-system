function StaffForm({
  form,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="card shadow-sm mb-4">

      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-person-badge-fill me-2"></i>
          Tạo tài khoản nhân viên
        </h5>
      </div>

      <div className="card-body">

        <form onSubmit={onSubmit}>

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
                value={form.fullName}
                onChange={onChange}
              />

            </div>

            {/* Số điện thoại */}
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
                value={form.phone}
                onChange={onChange}
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
                value={form.password}
                onChange={onChange}
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
                value={form.email}
                onChange={onChange}
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
                value={form.dateOfBirth}
                onChange={onChange}
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
                value={form.gender}
                onChange={onChange}
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
                value={form.address}
                onChange={onChange}
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
              onClick={onCancel}
            >
              Hủy
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default StaffForm;