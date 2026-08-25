import {
    useEffect,
    useState,
} from "react";

import {
    createFieldApi,
    deleteFieldApi,
    getFieldsApi,
    updateFieldApi,
} from "../../api/fieldApi";

import {
    getFieldTypesApi,
} from "../../api/fieldTypeApi";


function FieldManagement() {

    const [
        fields,
        setFields,
    ] = useState([]);


    const [
        fieldTypes,
        setFieldTypes,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        saving,
        setSaving,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        showForm,
        setShowForm,
    ] = useState(false);


    const [
        editingField,
        setEditingField,
    ] = useState(null);


    const [
        form,
        setForm,
    ] = useState({
        fieldName: "",
        fieldTypeId: "",
        location: "",
        pricePerHour: "",
        description: "",
        status: "active",
        image: null,
    });


    // ==========================================================
    // LOAD
    // ==========================================================

    const loadData =
        async () => {

            try {

                setLoading(true);
                setError("");


                const [
                    fieldsData,
                    typesData,
                ] = await Promise.all([

                    getFieldsApi(),

                    getFieldTypesApi(),
                ]);


                setFields(
                    Array.isArray(
                        fieldsData
                    )
                        ? fieldsData
                        : []
                );


                setFieldTypes(
                    Array.isArray(
                        typesData
                    )
                        ? typesData
                        : []
                );

            } catch (err) {

                console.error(
                    "Load staff field data error:",
                    err
                );


                setError(
                    err?.message ||
                    "Không thể tải dữ liệu sân."
                );

            } finally {

                setLoading(false);
            }
        };


    useEffect(() => {

        loadData();

    }, []);


    // ==========================================================
    // FORM
    // ==========================================================

    const resetForm =
        () => {

            setForm({
                fieldName: "",
                fieldTypeId: "",
                location: "",
                pricePerHour: "",
                description: "",
                status: "active",
                image: null,
            });

            setEditingField(
                null
            );

            setShowForm(
                false
            );
        };


    const handleChange =
        (
            e
        ) => {

            const {
                name,
                value,
                files,
            } = e.target;


            setForm(
                previous => ({
                    ...previous,

                    [name]:
                        name ===
                        "image"
                            ? (
                                files?.[0] ||
                                null
                            )
                            : value,
                })
            );
        };


    // ==========================================================
    // EDIT
    // ==========================================================

    const handleEdit =
        field => {

            setEditingField(
                field
            );


            setForm({

                fieldName:
                    field?.fieldName ||
                    "",

                fieldTypeId:
                    typeof field?.fieldTypeId ===
                    "object"
                        ? field.fieldTypeId?._id
                        : field?.fieldTypeId ||
                            "",

                location:
                    field?.location ||
                    "",

                pricePerHour:
                    field?.pricePerHour ??
                    "",

                description:
                    field?.description ||
                    "",

                status:
                    field?.status ||
                    "active",

                image:
                    null,
            });


            setShowForm(
                true
            );
        };


    // ==========================================================
    // SAVE
    // ==========================================================

    const handleSubmit =
        async (
            e
        ) => {

            e.preventDefault();


            try {

                setSaving(
                    true
                );

                setError("");


                if (!form.fieldName.trim()) {

                    throw new Error(
                        "Vui lòng nhập tên sân."
                    );
                }


                if (!form.fieldTypeId) {

                    throw new Error(
                        "Vui lòng chọn loại sân."
                    );
                }


                if (
                    editingField
                ) {

                    await updateFieldApi(
                        editingField._id,
                        form
                    );

                } else {

                    await createFieldApi(
                        form
                    );
                }


                await loadData();


                resetForm();


            } catch (err) {

                console.error(
                    "Save field error:",
                    err
                );


                setError(
                    err?.message ||
                    "Không thể lưu sân."
                );

            } finally {

                setSaving(
                    false
                );
            }
        };


    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDelete =
        async (
            field
        ) => {

            if (!field?._id) {
                return;
            }


            const confirmed =
                window.confirm(
                    `Bạn có chắc muốn xóa sân "${field.fieldName}" không?`
                );


            if (!confirmed) {
                return;
            }


            try {

                setError("");


                await deleteFieldApi(
                    field._id
                );


                await loadData();

            } catch (err) {

                console.error(
                    "Delete field error:",
                    err
                );


                setError(
                    err?.message ||
                    "Không thể xóa sân."
                );
            }
        };


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div className="spinner-border text-success" />

                <p className="text-muted mt-3">
                    Đang tải danh sách sân...
                </p>

            </div>
        );
    }


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
                        Thêm, sửa, xóa và quản lý trạng thái sân
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {

                        setEditingField(
                            null
                        );

                        setForm({
                            fieldName: "",
                            fieldTypeId: "",
                            location: "",
                            pricePerHour: "",
                            description: "",
                            status: "active",
                            image: null,
                        });

                        setShowForm(
                            true
                        );
                    }}
                >

                    <i className="bi bi-plus-lg me-2"></i>

                    Thêm sân

                </button>

            </div>


            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>
            )}


            {/* ==================================================
                FORM
            ================================================== */}

            {showForm && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white">

                        <h5 className="mb-0">

                            {
                                editingField
                                    ? "Chỉnh sửa sân"
                                    : "Thêm sân mới"
                            }

                        </h5>

                    </div>


                    <div className="card-body">

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="row g-3">

                                <div className="col-md-6">

                                    <label className="form-label">
                                        Tên sân
                                    </label>

                                    <input
                                        type="text"
                                        name="fieldName"
                                        className="form-control"
                                        value={
                                            form.fieldName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="col-md-6">

                                    <label className="form-label">
                                        Loại sân
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
                                    >

                                        <option value="">
                                            Chọn loại sân
                                        </option>

                                        {
                                            fieldTypes.map(
                                                type => (

                                                    <option
                                                        key={
                                                            type._id
                                                        }
                                                        value={
                                                            type._id
                                                        }
                                                    >
                                                        {
                                                            type.name
                                                        }
                                                    </option>
                                                )
                                            )
                                        }

                                    </select>

                                </div>


                                <div className="col-md-6">

                                    <label className="form-label">
                                        Địa điểm
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        className="form-control"
                                        value={
                                            form.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="col-md-6">

                                    <label className="form-label">
                                        Giá / giờ
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="pricePerHour"
                                        className="form-control"
                                        value={
                                            form.pricePerHour
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="col-md-6">

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
                                    >

                                        <option value="active">
                                            Đang hoạt động
                                        </option>

                                        <option value="maintenance">
                                            Bảo trì
                                        </option>

                                    </select>

                                </div>


                                <div className="col-md-6">

                                    <label className="form-label">
                                        Ảnh sân
                                    </label>

                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/jpeg,image/png,image/webp,image/jpg"
                                        className="form-control"
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <small className="text-muted">
                                        JPG, JPEG, PNG, WEBP
                                    </small>

                                </div>


                                <div className="col-12">

                                    <label className="form-label">
                                        Mô tả
                                    </label>

                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                            </div>


                            <div className="d-flex gap-2 mt-4">

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={
                                        saving
                                    }
                                >

                                    {
                                        saving
                                            ? "Đang lưu..."
                                            : "Lưu sân"
                                    }

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={
                                        resetForm
                                    }
                                    disabled={
                                        saving
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
                TABLE
            ================================================== */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white">

                    <h5 className="mb-0">
                        Danh sách sân
                    </h5>

                </div>


                <div className="card-body p-0">

                    {
                        fields.length ===
                        0 ? (

                            <div className="text-center py-5">

                                <i className="bi bi-building fs-1 text-muted"></i>

                                <p className="text-muted mt-3">
                                    Chưa có sân.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th>
                                                Ảnh
                                            </th>

                                            <th>
                                                Tên sân
                                            </th>

                                            <th>
                                                Loại sân
                                            </th>

                                            <th>
                                                Địa điểm
                                            </th>

                                            <th>
                                                Giá/giờ
                                            </th>

                                            <th>
                                                Trạng thái
                                            </th>

                                            <th>
                                                Thao tác
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            fields.map(
                                                field => {

                                                    const type =
                                                        typeof field.fieldTypeId ===
                                                        "object"
                                                            ? field.fieldTypeId?.name
                                                            : "-";


                                                    return (

                                                        <tr
                                                            key={
                                                                field._id
                                                            }
                                                        >

                                                            <td>

                                                                {
                                                                    field.image ? (

                                                                        <img
                                                                            src={
                                                                                field.image
                                                                            }
                                                                            alt={
                                                                                field.fieldName
                                                                            }
                                                                            style={{
                                                                                width:
                                                                                    "70px",
                                                                                height:
                                                                                    "50px",
                                                                                objectFit:
                                                                                    "cover",
                                                                                borderRadius:
                                                                                    "8px",
                                                                            }}
                                                                        />

                                                                    ) : (

                                                                        <div className="text-muted">
                                                                            Không có ảnh
                                                                        </div>
                                                                    )
                                                                }

                                                            </td>


                                                            <td>

                                                                <strong>
                                                                    {
                                                                        field.fieldName
                                                                    }
                                                                </strong>

                                                            </td>


                                                            <td>
                                                                {
                                                                    type
                                                                }
                                                            </td>


                                                            <td>
                                                                {
                                                                    field.location ||
                                                                    "-"
                                                                }
                                                            </td>


                                                            <td>

                                                                {
                                                                    Number(
                                                                        field.pricePerHour ||
                                                                        0
                                                                    ).toLocaleString(
                                                                        "vi-VN"
                                                                    )
                                                                }{" "}
                                                                đ

                                                            </td>


                                                            <td>

                                                                <span
                                                                    className={
                                                                        field.status ===
                                                                        "active"
                                                                            ? "badge bg-success"
                                                                            : "badge bg-secondary"
                                                                    }
                                                                >

                                                                    {
                                                                        field.status ===
                                                                        "active"
                                                                            ? "Hoạt động"
                                                                            : "Bảo trì"
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <div className="d-flex gap-2">

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                field
                                                                            )
                                                                        }
                                                                    >

                                                                        <i className="bi bi-pencil"></i>

                                                                    </button>


                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                field
                                                                            )
                                                                        }
                                                                    >

                                                                        <i className="bi bi-trash"></i>

                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    );
                                                }
                                            )
                                        }

                                    </tbody>

                                </table>

                            </div>
                        )
                    }

                </div>

            </div>

        </div>
    );
}


export default FieldManagement;