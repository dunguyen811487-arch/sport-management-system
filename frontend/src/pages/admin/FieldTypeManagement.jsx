import {
  useEffect,
  useState,
} from "react";

import {
  getFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
} from "../../services/fieldTypeService";

function FieldTypeManagement() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [fieldTypes, setFieldTypes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [backendError, setBackendError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // ==========================================================
  // LOAD
  // ==========================================================

  useEffect(() => {
    loadFieldTypes();
  }, []);

  const loadFieldTypes = async () => {
    try {
      setLoading(true);
      setBackendError("");

      const data = await getFieldTypes();

      setFieldTypes(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Lỗi tải loại sân:",
        error
      );

      /*
       * Backend hiện chưa có.
       *
       * Không dùng alert ở đây vì mỗi lần
       * truy cập trang sẽ bật popup.
       */
      setBackendError(
        "Chưa thể kết nối Backend. Dữ liệu loại sân sẽ được tải từ API khi Backend hoạt động."
      );

      setFieldTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CHANGE FORM
  // ==========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // OPEN CREATE
  // ==========================================================

  const handleOpenCreate = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
    });

    setShowForm(true);
  };

  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const handleOpenEdit = (fieldType) => {
    setEditingId(
      fieldType.id ||
      fieldType._id
    );

    setForm({
      name: fieldType.name || "",
      description:
        fieldType.description || "",
    });

    setShowForm(true);
  };

  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  const handleCloseForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm({
      name: "",
      description: "",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert(
        "Vui lòng nhập tên loại sân!"
      );
      return;
    }

    try {
      setLoading(true);

      setBackendError("");

      // ------------------------------------------------------
      // UPDATE
      // ------------------------------------------------------

      if (editingId) {
        await updateFieldType(
          editingId,
          form
        );

        alert(
          "Cập nhật loại sân thành công!"
        );
      }

      // ------------------------------------------------------
      // CREATE
      // ------------------------------------------------------

      else {
        await createFieldType(form);

        alert(
          "Thêm loại sân thành công!"
        );
      }

      // ------------------------------------------------------
      // RELOAD
      // ------------------------------------------------------

      await loadFieldTypes();

      handleCloseForm();
    } catch (error) {
      console.error(
        "Lỗi xử lý loại sân:",
        error
      );

      setBackendError(
        error.message ||
        "Không thể kết nối Backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (fieldType) => {
    const fieldTypeId =
      fieldType.id ||
      fieldType._id;

    if (!fieldTypeId) {
      alert(
        "Không xác định được ID loại sân!"
      );
      return;
    }

    const confirmDelete =
      window.confirm(
        `Bạn có chắc muốn xóa loại sân "${fieldType.name}" không?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      setBackendError("");

      await deleteFieldType(
        fieldTypeId
      );

      await loadFieldTypes();

      alert(
        "Xóa loại sân thành công!"
      );
    } catch (error) {
      console.error(
        "Lỗi xóa loại sân:",
        error
      );

      setBackendError(
        error.message ||
        "Không thể xóa loại sân!"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div>

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h1 className="mb-1">
            Quản lý loại sân
          </h1>

          <p className="text-muted mb-0">
            Quản lý danh mục các loại sân
            thể thao
          </p>
        </div>

        <button
          className="btn btn-success"
          onClick={handleOpenCreate}
          disabled={loading}
        >
          <i className="bi bi-plus-lg me-2"></i>

          Thêm loại sân
        </button>

      </div>

      {/* ====================================================
          BACKEND STATUS
      ==================================================== */}

      {backendError && (
        <div className="alert alert-warning d-flex align-items-start">

          <i className="bi bi-exclamation-triangle-fill me-2 mt-1"></i>

          <div>
            <strong>
              Backend chưa kết nối
            </strong>

            <div className="small mt-1">
              {backendError}
            </div>
          </div>

        </div>
      )}

      {/* ====================================================
          FORM
      ==================================================== */}

      {showForm && (
        <div className="card shadow-sm mb-4">

          <div className="card-header">

            <h5 className="mb-0">
              {editingId
                ? "Cập nhật loại sân"
                : "Thêm loại sân"}
            </h5>

          </div>

          <div className="card-body">

            <form
              onSubmit={handleSubmit}
            >

              <div className="mb-3">

                <label className="form-label">
                  Tên loại sân *
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Ví dụ: Sân bóng đá 7 người"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Mô tả
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Mô tả loại sân..."
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                ></textarea>

              </div>

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>

                      {editingId
                        ? "Cập nhật"
                        : "Thêm mới"}
                    </>
                  )}

                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseForm}
                  disabled={loading}
                >
                  Hủy
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="row mb-4">

        <div className="col-md-4">

          <div className="card shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Tổng loại sân
              </h6>

              <h2>
                {fieldTypes.length}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================================
          TABLE
      ==================================================== */}

      <div className="card shadow-sm">

        <div className="card-header">

          <h5 className="mb-0">
            Danh sách loại sân
          </h5>

        </div>

        <div className="card-body p-0">

          {loading && fieldTypes.length === 0 ? (

            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              ></div>

              <p className="text-muted mt-3 mb-0">
                Đang tải dữ liệu...
              </p>

            </div>

          ) : fieldTypes.length === 0 ? (

            <div className="text-center py-5">

              <i className="bi bi-grid fs-1 text-muted"></i>

              <p className="text-muted mt-3 mb-1">
                Chưa có dữ liệu loại sân
              </p>

              <small className="text-muted">
                Dữ liệu sẽ được lấy từ MongoDB
                thông qua Backend API.
              </small>

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
                      Tên loại sân
                    </th>

                    <th>
                      Mô tả
                    </th>

                    <th className="text-center">
                      Thao tác
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {fieldTypes.map(
                    (fieldType, index) => {

                      const id =
                        fieldType.id ||
                        fieldType._id;

                      return (
                        <tr
                          key={
                            id || index
                          }
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            <strong>
                              {fieldType.name ||
                                "Không có tên"}
                            </strong>
                          </td>

                          <td>
                            {fieldType.description ||
                              "-"}
                          </td>

                          <td className="text-center">

                            <div className="d-flex justify-content-center gap-2">

                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  handleOpenEdit(
                                    fieldType
                                  )
                                }
                                disabled={loading}
                              >
                                <i className="bi bi-pencil-fill me-1"></i>

                                Sửa
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDelete(
                                    fieldType
                                  )
                                }
                                disabled={loading}
                              >
                                <i className="bi bi-trash-fill me-1"></i>

                                Xóa
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
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

export default FieldTypeManagement;