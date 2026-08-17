import {
    useEffect,
    useState,
} from "react";

import {
    getFields,
    createField,
    updateField,
    deleteField,
} from "../../services/fieldService";

import {
    getFieldTypes,
} from "../../services/fieldTypeService";


function FieldManagement() {

    // ==========================================================
    // STATE
    // ==========================================================

    const [fields, setFields] =
        useState([]);

    const [fieldTypes, setFieldTypes] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [form, setForm] = useState({
        fieldName: "",
        fieldTypeId: "",
        location: "",
        pricePerHour: "",
        image: null,
        description: "",
        status: "active",
    });


    // ==========================================================
    // LOAD DATA
    // ==========================================================

    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {
        try {

            setLoading(true);

            const [
                fieldsData,
                fieldTypesData,
            ] = await Promise.all([
                getFields(),
                getFieldTypes(),
            ]);

            setFields(
                Array.isArray(fieldsData)
                    ? fieldsData
                    : []
            );

            setFieldTypes(
                Array.isArray(fieldTypesData)
                    ? fieldTypesData
                    : []
            );

        } catch (error) {

            console.error(
                "Lỗi tải dữ liệu:",
                error
            );

            alert(
                error?.message ||
                "Không thể tải dữ liệu quản lý sân!"
            );

        } finally {
            setLoading(false);
        }
    };


    // ==========================================================
    // FORM CHANGE
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
    // IMAGE CHANGE
    // ==========================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0] ||
            null;

        setForm((prev) => ({
            ...prev,
            image: file,
        }));
    };


    // ==========================================================
    // OPEN CREATE
    // ==========================================================

    const handleOpenCreate = () => {

        if (
            fieldTypes.length === 0
        ) {

            alert(
                "Chưa có loại sân nào. Vui lòng tạo loại sân trước!"
            );

            return;
        }

        const firstType =
            fieldTypes[0];

        setEditingId(null);

        setForm({
            fieldName: "",

            fieldTypeId:
                firstType?._id ||
                firstType?.id ||
                "",

            location: "",

            pricePerHour: "",

            image: null,

            description: "",

            status: "active",
        });

        setShowForm(true);
    };


    // ==========================================================
    // OPEN EDIT
    // ==========================================================

    const handleOpenEdit = (
        field
    ) => {

        const fieldId =
            field?._id ||
            field?.id;

        const fieldTypeId =
            typeof field?.fieldTypeId ===
            "object"
                ? (
                    field.fieldTypeId?._id ||
                    field.fieldTypeId?.id ||
                    ""
                )
                : (
                    field?.fieldTypeId ||
                    ""
                );

        setEditingId(fieldId);

        setForm({
            fieldName:
                field?.fieldName ||
                "",

            fieldTypeId,

            location:
                field?.location ||
                "",

            pricePerHour:
                field?.pricePerHour ??
                "",

            // Không đưa URL cũ vào đây
            // để tránh gửi object/chuỗi sai dạng
            image: null,

            description:
                field?.description ||
                "",

            status:
                field?.status ||
                "active",
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
            fieldName: "",
            fieldTypeId: "",
            location: "",
            pricePerHour: "",
            image: null,
            description: "",
            status: "active",
        });
    };


    // ==========================================================
    // SUBMIT
    // ==========================================================

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();

        // ------------------------------------------------------
        // Tên sân
        // ------------------------------------------------------

        if (
            !form.fieldName.trim()
        ) {

            alert(
                "Vui lòng nhập tên sân!"
            );

            return;
        }


        // ------------------------------------------------------
        // Loại sân
        // ------------------------------------------------------

        if (!form.fieldTypeId) {

            alert(
                "Vui lòng chọn loại sân!"
            );

            return;
        }


        // ------------------------------------------------------
        // Địa điểm
        // ------------------------------------------------------

        if (
            !form.location.trim()
        ) {

            alert(
                "Vui lòng nhập địa điểm!"
            );

            return;
        }


        // ------------------------------------------------------
        // Giá
        // ------------------------------------------------------

        const price =
            Number(
                form.pricePerHour
            );

        if (
            Number.isNaN(price) ||
            price <= 0
        ) {

            alert(
                "Giá sân phải lớn hơn 0!"
            );

            return;
        }


        // ------------------------------------------------------
        // Status
        // ------------------------------------------------------

        if (
            ![
                "active",
                "maintenance",
            ].includes(form.status)
        ) {

            alert(
                "Trạng thái sân không hợp lệ!"
            );

            return;
        }


        try {

            setLoading(true);

            const payload = {
                fieldName:
                    form.fieldName.trim(),

                fieldTypeId:
                    form.fieldTypeId,

                location:
                    form.location.trim(),

                pricePerHour:
                    price,

                image:
                    form.image,

                description:
                    form.description.trim(),

                status:
                    form.status,
            };

            console.log(
                "FIELD PAYLOAD:",
                payload
            );


            if (editingId) {

                await updateField(
                    editingId,
                    payload
                );

                alert(
                    "Cập nhật sân thành công!"
                );

            } else {

                await createField(
                    payload
                );

                alert(
                    "Thêm sân thành công!"
                );
            }


            await loadData();

            handleCloseForm();

        } catch (error) {

            console.error(
                "Lỗi xử lý sân:",
                error
            );

            alert(
                error?.data?.message ||
                error?.message ||
                "Có lỗi xảy ra!"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDelete = async (
        field
    ) => {

        const fieldId =
            field?._id ||
            field?.id;

        if (!fieldId) {

            alert(
                "Không xác định được ID sân!"
            );

            return;
        }

        const confirmDelete =
            window.confirm(
                `Bạn có chắc muốn xóa sân "${field.fieldName}" không?`
            );

        if (!confirmDelete) {
            return;
        }


        try {

            setLoading(true);

            await deleteField(
                fieldId
            );

            await loadData();

            alert(
                "Xóa sân thành công!"
            );

        } catch (error) {

            console.error(
                "Lỗi xóa sân:",
                error
            );

            alert(
                error?.data?.message ||
                error?.message ||
                "Không thể xóa sân!"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // GET FIELD TYPE NAME
    // ==========================================================

    const getFieldTypeName = (
        fieldType
    ) => {

        if (
            fieldType &&
            typeof fieldType === "object"
        ) {

            return (
                fieldType.name ||
                "Không xác định"
            );
        }

        const found =
            fieldTypes.find(
                (item) => {

                    const itemId =
                        item?._id ||
                        item?.id;

                    return (
                        String(itemId) ===
                        String(fieldType)
                    );
                }
            );

        return (
            found?.name ||
            "Không xác định"
        );
    };


    // ==========================================================
    // TOGGLE STATUS
    // ==========================================================

    const handleToggleStatus = async (
        field
    ) => {

        const fieldId =
            field?._id ||
            field?.id;

        if (!fieldId) {
            return;
        }

        const nextStatus =
            field.status === "active"
                ? "maintenance"
                : "active";

        const message =
            nextStatus === "maintenance"
                ? `Chuyển "${field.fieldName}" sang bảo trì?`
                : `Mở lại "${field.fieldName}"?`;

        if (!window.confirm(message)) {
            return;
        }

        try {

            setLoading(true);

            await updateField(
                fieldId,
                {
                    fieldName:
                        field.fieldName,

                    fieldTypeId:
                        field.fieldTypeId?._id ||
                        field.fieldTypeId?.id ||
                        field.fieldTypeId,

                    location:
                        field.location ||
                        "",

                    pricePerHour:
                        field.pricePerHour ||
                        0,

                    description:
                        field.description ||
                        "",

                    status:
                        nextStatus,

                    image:
                        null,
                }
            );

            await loadData();

        } catch (error) {

            console.error(
                "Lỗi cập nhật trạng thái:",
                error
            );

            alert(
                error?.data?.message ||
                error?.message ||
                "Không thể cập nhật trạng thái sân!"
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

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="mb-1">
                        Quản lý sân
                    </h1>

                    <p className="text-muted mb-0">
                        Quản lý các sân thể thao trong hệ thống
                    </p>

                </div>

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={
                        handleOpenCreate
                    }
                    disabled={
                        loading ||
                        fieldTypes.length === 0
                    }
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Thêm sân
                </button>

            </div>


            {/* ==================================================
                WARNING
            ================================================== */}

            {fieldTypes.length === 0 && (

                <div className="alert alert-warning">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    <strong>
                        Chưa có loại sân.
                    </strong>

                    {" "}
                    Bạn cần vào
                    <strong>
                        {" Quản lý loại sân "}
                    </strong>
                    để tạo loại sân trước khi thêm sân.

                </div>
            )}


            {/* ==================================================
                FORM
            ================================================== */}

            {showForm && (

                <div className="card shadow-sm mb-4">

                    <div className="card-header">

                        <h5 className="mb-0">
                            {
                                editingId
                                    ? "Cập nhật sân"
                                    : "Thêm sân"
                            }
                        </h5>

                    </div>


                    <div className="card-body">

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="row">

                                {/* Tên sân */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Tên sân *
                                    </label>

                                    <input
                                        type="text"
                                        name="fieldName"
                                        className="form-control"
                                        placeholder="Ví dụ: Sân A"
                                        value={
                                            form.fieldName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>


                                {/* Loại sân */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Loại sân *
                                    </label>

                                    <select
                                        name="fieldTypeId"
                                        className="form-select"
                                        value={
                                            form.fieldTypeId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading ||
                                            fieldTypes.length === 0
                                        }
                                    >

                                        <option value="">
                                            -- Chọn loại sân --
                                        </option>

                                        {fieldTypes.map(
                                            (fieldType) => {

                                                const typeId =
                                                    fieldType?._id ||
                                                    fieldType?.id;

                                                return (
                                                    <option
                                                        key={
                                                            typeId
                                                        }
                                                        value={
                                                            typeId
                                                        }
                                                    >
                                                        {
                                                            fieldType?.name
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}

                                    </select>

                                </div>


                                {/* Địa điểm */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Địa điểm *
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        className="form-control"
                                        placeholder="Trà Vinh"
                                        value={
                                            form.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>


                                {/* Giá */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Giá / giờ *
                                    </label>

                                    <div className="input-group">

                                        <input
                                            type="number"
                                            name="pricePerHour"
                                            className="form-control"
                                            placeholder="200000"
                                            min="0"
                                            value={
                                                form.pricePerHour
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                loading
                                            }
                                        />

                                        <span className="input-group-text">
                                            VNĐ
                                        </span>

                                    </div>

                                </div>


                                {/* Hình ảnh */}

                                <div className="col-12 mb-3">

                                    <label className="form-label">
                                        Hình ảnh
                                    </label>

                                    <input
                                        type="file"
                                        name="image"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={
                                            handleImageChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    />

                                    {editingId && (
                                        <small className="text-muted">
                                            Để trống nếu muốn giữ ảnh hiện tại.
                                        </small>
                                    )}

                                </div>


                                {/* Description */}

                                <div className="col-12 mb-3">

                                    <label className="form-label">
                                        Mô tả
                                    </label>

                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        placeholder="Mô tả sân..."
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>


                                {/* Status */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Trạng thái
                                    </label>

                                    <select
                                        name="status"
                                        className="form-select"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    >

                                        <option value="active">
                                            Đang hoạt động
                                        </option>

                                        <option value="maintenance">
                                            Bảo trì
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={
                                        loading
                                    }
                                >

                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg me-2"></i>

                                            {
                                                editingId
                                                    ? "Cập nhật"
                                                    : "Thêm sân"
                                            }
                                        </>
                                    )}

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        handleCloseForm
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    Hủy
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="row mb-4">

                <div className="col-md-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Tổng số sân
                            </h6>

                            <h2 className="mb-0">
                                {fields.length}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Đang hoạt động
                            </h6>

                            <h2 className="mb-0">

                                {
                                    fields.filter(
                                        (field) =>
                                            field.status ===
                                            "active"
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
                                Đang bảo trì
                            </h6>

                            <h2 className="mb-0">

                                {
                                    fields.filter(
                                        (field) =>
                                            field.status ===
                                            "maintenance"
                                    ).length
                                }

                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                TABLE
            ================================================== */}

            <div className="card shadow-sm">

                <div className="card-header">

                    <h5 className="mb-0">
                        Danh sách sân
                    </h5>

                </div>


                <div className="card-body p-0">

                    {loading &&
                    fields.length === 0 ? (

                        <div className="text-center py-5">

                            <div
                                className="spinner-border"
                                role="status"
                            />

                            <p className="text-muted mt-3 mb-0">
                                Đang tải dữ liệu...
                            </p>

                        </div>

                    ) : fields.length === 0 ? (

                        <div className="text-center py-5">

                            <i className="bi bi-building fs-1 text-muted"></i>

                            <p className="text-muted mt-3 mb-0">
                                Chưa có sân nào
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>
                                        <th>#</th>
                                        <th>Tên sân</th>
                                        <th>Loại sân</th>
                                        <th>Địa điểm</th>
                                        <th>Giá / giờ</th>
                                        <th>Trạng thái</th>
                                        <th className="text-center">
                                            Thao tác
                                        </th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {fields.map(
                                        (
                                            field,
                                            index
                                        ) => {

                                            const fieldId =
                                                field?._id ||
                                                field?.id;

                                            return (
                                                <tr
                                                    key={
                                                        fieldId ||
                                                        index
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>


                                                    <td>
                                                        <strong>
                                                            {
                                                                field?.fieldName
                                                            }
                                                        </strong>
                                                    </td>


                                                    <td>
                                                        {
                                                            getFieldTypeName(
                                                                field?.fieldTypeId
                                                            )
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            field?.location ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            Number(
                                                                field?.pricePerHour ||
                                                                0
                                                            ).toLocaleString(
                                                                "vi-VN"
                                                            )
                                                        }{" "}
                                                        VNĐ
                                                    </td>


                                                    <td>

                                                        {
                                                            field?.status ===
                                                            "active" ? (

                                                                <span className="badge bg-success">
                                                                    Đang hoạt động
                                                                </span>

                                                            ) : (

                                                                <span className="badge bg-warning text-dark">
                                                                    Bảo trì
                                                                </span>

                                                            )
                                                        }

                                                    </td>


                                                    <td className="text-center">

                                                        <div className="d-flex justify-content-center gap-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() =>
                                                                    handleOpenEdit(
                                                                        field
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                <i className="bi bi-pencil-fill me-1"></i>
                                                                Sửa
                                                            </button>


                                                            <button
                                                                type="button"
                                                                className={
                                                                    field?.status ===
                                                                    "active"
                                                                        ? "btn btn-sm btn-outline-warning"
                                                                        : "btn btn-sm btn-outline-success"
                                                                }
                                                                onClick={() =>
                                                                    handleToggleStatus(
                                                                        field
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            >

                                                                <i
                                                                    className={
                                                                        field?.status ===
                                                                        "active"
                                                                            ? "bi bi-tools me-1"
                                                                            : "bi bi-play-fill me-1"
                                                                    }
                                                                ></i>

                                                                {
                                                                    field?.status ===
                                                                    "active"
                                                                        ? "Bảo trì"
                                                                        : "Mở lại"
                                                                }

                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        field
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
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

export default FieldManagement;