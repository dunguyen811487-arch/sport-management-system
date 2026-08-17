import {
    useEffect,
    useState,
} from "react";

import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";

import {
    updateProfileApi,
} from "../../api/authApi";


function Profile() {

    const {
        user,
        updateUser,
    } = useAuth();


    // ==========================================================
    // FORM
    // ==========================================================

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        dateOfBirth: "",
        gender: "",
        address: "",
    });


    const [loading, setLoading] =
        useState(false);


    // ==========================================================
    // LẤY USER HIỆN TẠI
    // ==========================================================

    useEffect(() => {

        if (!user) {
            return;
        }


        setForm({

            fullName:
                user.fullName ||
                user.name ||
                "",

            phone:
                user.phone ||
                "",

            email:
                user.email ||
                "",

            dateOfBirth:
                user.dateOfBirth ||
                "",

            gender:
                user.gender ||
                "",

            address:
                user.address ||
                "",
        });

    }, [user]);


    // ==========================================================
    // HANDLE CHANGE
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
    // UPDATE PROFILE
    // ==========================================================

    const handleUpdate = async (e) => {

        e.preventDefault();


        // ======================================================
        // KIỂM TRA USER
        // ======================================================

        if (!user) {

            await Swal.fire({
                icon: "error",
                title:
                    "Chưa đăng nhập",
                text:
                    "Vui lòng đăng nhập để cập nhật hồ sơ.",
                confirmButtonColor:
                    "#198754",
            });

            return;
        }


        // ======================================================
        // HỌ VÀ TÊN
        // ======================================================

        const cleanFullName =
            String(
                form.fullName || ""
            ).trim();


        if (!cleanFullName) {

            await Swal.fire({
                icon: "warning",
                title:
                    "Thiếu họ và tên",
                text:
                    "Vui lòng nhập họ và tên.",
                confirmButtonColor:
                    "#198754",
            });

            return;
        }


        // ======================================================
        // EMAIL
        // ======================================================

        const cleanEmail =
            String(
                form.email || ""
            ).trim();


        if (cleanEmail) {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailRegex.test(
                    cleanEmail
                )
            ) {

                await Swal.fire({
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
        }


        // ======================================================
        // PHONE HIỆN TẠI
        // Không cho sửa nhưng vẫn gửi lên backend
        // ======================================================

        const currentPhone =
            String(
                user.phone ||
                form.phone ||
                ""
            ).trim();


        // ======================================================
        // UPDATE BACKEND
        // ======================================================

        try {

            setLoading(true);


            const response =
                await updateProfileApi({

                    fullName:
                        cleanFullName,

                    phone:
                        currentPhone,

                    email:
                        cleanEmail,

                    dateOfBirth:
                        form.dateOfBirth ||
                        "",

                    gender:
                        form.gender ||
                        "",

                    address:
                        String(
                            form.address ||
                            ""
                        ).trim(),
                });


            console.log(
                "UPDATE PROFILE RESPONSE:",
                response
            );


            // ==================================================
            // USER TỪ BACKEND
            // ==================================================

            const savedUser =
                response?.user;


            if (!savedUser) {

                throw new Error(
                    response?.message ||
                    "Backend không trả về thông tin tài khoản."
                );
            }


            // ==================================================
            // GIỮ PHONE CŨ
            // ==================================================

            const finalUser = {

                ...savedUser,

                phone:
                    savedUser.phone ||
                    currentPhone,

            };


            // ==================================================
            // CẬP NHẬT AUTH CONTEXT
            // ==================================================

            updateUser(
                finalUser
            );


            // ==================================================
            // CẬP NHẬT FORM
            // ==================================================

            setForm({

                fullName:
                    finalUser.fullName ||
                    finalUser.name ||
                    "",

                phone:
                    finalUser.phone ||
                    currentPhone,

                email:
                    finalUser.email ||
                    "",

                dateOfBirth:
                    finalUser.dateOfBirth ||
                    "",

                gender:
                    finalUser.gender ||
                    "",

                address:
                    finalUser.address ||
                    "",
            });


            // ==================================================
            // THÔNG BÁO
            // ==================================================

            await Swal.fire({
                icon:
                    "success",
                title:
                    "Cập nhật thành công!",
                text:
                    "Thông tin hồ sơ của bạn đã được lưu.",
                confirmButtonColor:
                    "#198754",
            });


        } catch (error) {

            console.error(
                "Lỗi cập nhật hồ sơ:",
                error
            );


            await Swal.fire({
                icon:
                    "error",
                title:
                    "Có lỗi xảy ra",
                text:
                    error?.data?.message ||
                    error?.message ||
                    "Không thể cập nhật hồ sơ.",
                confirmButtonColor:
                    "#198754",
            });


        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // CHƯA ĐĂNG NHẬP
    // ==========================================================

    if (!user) {

        return (
            <div className="container py-5">

                <div className="alert alert-warning">

                    Vui lòng đăng nhập để xem hồ sơ.

                </div>

            </div>
        );
    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div className="container-fluid py-4">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-4">

                <h2 className="fw-bold text-success">
                    Hồ sơ cá nhân
                </h2>

                <p className="text-muted">
                    Quản lý thông tin tài khoản của bạn.
                </p>

            </div>


            {/* ==================================================
                PROFILE CARD
            ================================================== */}

            <div className="card border-0 shadow-sm">

                <div className="card-body p-4">

                    {/* ==================================================
                        AVATAR + USER
                    ================================================== */}

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

                                {
                                    form.fullName ||
                                    "Người dùng"
                                }

                            </h4>


                            <span className="text-muted">

                                {
                                    String(
                                        user.role ||
                                        ""
                                    ).toLowerCase() ===
                                    "customer"
                                        ? "Khách hàng"
                                        : user.role
                                }

                            </span>

                        </div>

                    </div>


                    <hr />


                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={
                            handleUpdate
                        }
                    >

                        <div className="row">

                            {/* ==========================================
                                HỌ VÀ TÊN
                            ========================================== */}

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


                            {/* ==========================================
                                SỐ ĐIỆN THOẠI
                            ========================================== */}

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
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        disabled
                                        readOnly
                                    />

                                </div>


                                <small className="text-muted">

                                    Số điện thoại không thể thay đổi.

                                </small>

                            </div>


                            {/* ==========================================
                                EMAIL
                            ========================================== */}

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


                            {/* ==========================================
                                NGÀY SINH
                            ========================================== */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-semibold">
                                    Ngày sinh
                                </label>


                                <div className="input-group">

                                    <span className="input-group-text">

                                        <i className="bi bi-calendar-fill"></i>

                                    </span>


                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dateOfBirth"
                                        value={
                                            form.dateOfBirth
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


                            {/* ==========================================
                                GIỚI TÍNH
                            ========================================== */}

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
                                        value={
                                            form.gender
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
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


                            {/* ==========================================
                                ĐỊA CHỈ
                            ========================================== */}

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
                                        value={
                                            form.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Nhập địa chỉ"
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            BUTTON
                        ================================================== */}

                        <div className="d-flex justify-content-end mt-4">

                            <button
                                type="submit"
                                className="btn btn-success px-4"
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

                                        Đang cập nhật...
                                    </>

                                ) : (

                                    <>
                                        <i className="bi bi-check-circle-fill me-2"></i>

                                        Cập nhật hồ sơ
                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}


export default Profile;