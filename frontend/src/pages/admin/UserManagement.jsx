import { useEffect, useState } from "react";

import apiClient from "../../api/apiClient";

function UserManagement() {

    // ==========================================================
    // STATE
    // ==========================================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showStaffForm, setShowStaffForm] =
        useState(false);

    const [creatingStaff, setCreatingStaff] =
        useState(false);

    const [deletingUserId, setDeletingUserId] =
        useState(null);


    // ==========================================================
    // STAFF FORM
    // ==========================================================

    const [staffForm, setStaffForm] = useState({
        fullName: "",
        phone: "",
        password: "",
        email: "",
        gender: "",
        dateOfBirth: "",
        address: "",
    });


    // ==========================================================
    // GET USER ID
    // ==========================================================

    const getUserId = (user) => {
        return user?._id || user?.id;
    };


    // ==========================================================
    // CURRENT ADMIN
    // ==========================================================

    const getCurrentUser = () => {

        try {

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {
                return null;
            }

            return JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "Không thể đọc user hiện tại:",
                error
            );

            return null;
        }
    };


    // ==========================================================
    // LOAD USERS
    // ==========================================================

    const loadUsers = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await apiClient("/users");

            /*
             * Backend trả:
             *
             * {
             *     success: true,
             *     data: [...]
             * }
             */

            const userData =
                response?.data;

            setUsers(
                Array.isArray(userData)
                    ? userData
                    : []
            );

        } catch (error) {

            console.error(
                "Load users error:",
                error
            );

            setUsers([]);

            setError(
                error?.message ||
                "Không thể tải danh sách người dùng."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // LOAD WHEN PAGE OPEN
    // ==========================================================

    useEffect(() => {

        loadUsers();

    }, []);


    // ==========================================================
    // STAFF FORM CHANGE
    // ==========================================================

    const handleStaffChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setStaffForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // ==========================================================
    // CREATE STAFF
    // ==========================================================

    const handleCreateStaff = async (e) => {

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


        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        if (!fullName.trim()) {

            alert(
                "Vui lòng nhập họ tên nhân viên!"
            );

            return;
        }


        if (!/^[0-9]{10}$/.test(phone)) {

            alert(
                "Số điện thoại phải gồm 10 chữ số!"
            );

            return;
        }


        if (!password.trim()) {

            alert(
                "Vui lòng nhập mật khẩu!"
            );

            return;
        }


        if (password.length < 6) {

            alert(
                "Mật khẩu phải có ít nhất 6 ký tự!"
            );

            return;
        }


        try {

            setCreatingStaff(true);


            // --------------------------------------------------
            // CALL BACKEND
            // --------------------------------------------------

            const response =
                await apiClient(
                    "/users/staff",
                    {
                        method: "POST",

                        body: {
                            fullName:
                                fullName.trim(),

                            phone:
                                phone.trim(),

                            password,

                            email:
                                email.trim(),

                            gender,

                            dateOfBirth,

                            address:
                                address.trim(),
                        },
                    }
                );


            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            alert(
                response?.message ||
                "Tạo tài khoản Staff thành công!"
            );


            // --------------------------------------------------
            // RESET FORM
            // --------------------------------------------------

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


            // --------------------------------------------------
            // LOAD DATA FROM MONGODB AGAIN
            // --------------------------------------------------

            await loadUsers();

        } catch (error) {

            console.error(
                "Create staff error:",
                error
            );


            alert(
                error?.message ||
                "Không thể tạo tài khoản Staff!"
            );

        } finally {

            setCreatingStaff(false);
        }
    };


    // ==========================================================
    // DELETE USER
    // ==========================================================

    const handleDeleteUser = async (user) => {

        const currentUser =
            getCurrentUser();


        const currentUserId =
            getUserId(currentUser);


        const targetUserId =
            getUserId(user);


        // ------------------------------------------------------
        // CHECK ID
        // ------------------------------------------------------

        if (!targetUserId) {

            alert(
                "Không xác định được ID tài khoản!"
            );

            return;
        }


        // ------------------------------------------------------
        // PREVENT DELETE CURRENT ADMIN
        // ------------------------------------------------------

        if (
            currentUserId &&
            String(currentUserId) ===
                String(targetUserId)
        ) {

            alert(
                "Bạn không thể tự xóa tài khoản Admin đang đăng nhập!"
            );

            return;
        }


        // ------------------------------------------------------
        // ADMIN CANNOT DELETE ADMIN
        // ------------------------------------------------------

        if (
            user?.role?.toLowerCase() ===
            "admin"
        ) {

            alert(
                "Không thể xóa tài khoản Admin!"
            );

            return;
        }


        // ------------------------------------------------------
        // CONFIRM
        // ------------------------------------------------------

        const userName =
            user?.fullName ||
            user?.name ||
            "người dùng";


        const confirmDelete =
            window.confirm(
                `Bạn có chắc muốn xóa tài khoản "${userName}" không?`
            );


        if (!confirmDelete) {
            return;
        }


        try {

            setDeletingUserId(
                targetUserId
            );


            // --------------------------------------------------
            // CALL DELETE API
            // --------------------------------------------------

            const response =
                await apiClient(
                    `/users/${targetUserId}`,
                    {
                        method: "DELETE",
                    }
                );


            alert(
                response?.message ||
                "Xóa tài khoản thành công!"
            );


            // --------------------------------------------------
            // RELOAD DATABASE DATA
            // --------------------------------------------------

            await loadUsers();

        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );


            alert(
                error?.message ||
                "Không thể xóa tài khoản!"
            );

        } finally {

            setDeletingUserId(null);
        }
    };


    // ==========================================================
    // ROLE TEXT
    // ==========================================================

    const getRoleText = (role) => {

        switch (
            role?.toLowerCase()
        ) {

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


    // ==========================================================
    // ROLE BADGE
    // ==========================================================

    const getRoleClass = (role) => {

        switch (
            role?.toLowerCase()
        ) {

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


    // ==========================================================
    // STATISTICS
    // ==========================================================

    const totalUsers =
        users.length;


    const totalCustomers =
        users.filter(
            (user) =>
                user?.role?.toLowerCase() ===
                "customer"
        ).length;


    const totalStaff =
        users.filter(
            (user) =>
                user?.role?.toLowerCase() ===
                "staff"
        ).length;


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
                        Quản lý người dùng
                    </h1>

                    <p className="text-muted mb-0">
                        Quản lý tài khoản Customer,
                        Staff và Admin
                    </p>

                </div>


                <button
                    className="btn btn-success"
                    type="button"
                    onClick={() =>
                        setShowStaffForm(
                            !showStaffForm
                        )
                    }
                    disabled={creatingStaff}
                >

                    <i className="bi bi-person-plus-fill me-2"></i>

                    Tạo tài khoản Staff

                </button>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div
                    className="alert alert-danger d-flex justify-content-between align-items-center"
                    role="alert"
                >

                    <div>

                        <i className="bi bi-exclamation-triangle-fill me-2"></i>

                        {error}

                    </div>


                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={loadUsers}
                    >
                        Thử lại
                    </button>

                </div>

            )}


            {/* ==================================================
                FORM STAFF
            ================================================== */}

            {showStaffForm && (

                <div className="card shadow-sm mb-4">

                    <div className="card-header">

                        <h5 className="mb-0">

                            <i className="bi bi-person-badge-fill me-2"></i>

                            Tạo tài khoản nhân viên

                        </h5>

                    </div>


                    <div className="card-body">

                        <form
                            onSubmit={
                                handleCreateStaff
                            }
                        >

                            <div className="row">

                                {/* HỌ TÊN */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Họ và tên *
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        className="form-control"
                                        placeholder="Nguyễn Văn A"
                                        value={
                                            staffForm.fullName
                                        }
                                        onChange={
                                            handleStaffChange
                                        }
                                        disabled={
                                            creatingStaff
                                        }
                                    />

                                </div>


                                {/* PHONE */}

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
                                        value={
                                            staffForm.phone
                                        }
                                        onChange={
                                            handleStaffChange
                                        }
                                        disabled={
                                            creatingStaff
                                        }
                                    />

                                </div>


                                {/* PASSWORD */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Mật khẩu *
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Ít nhất 6 ký tự"
                                        value={
                                            staffForm.password
                                        }
                                        onChange={
                                            handleStaffChange
                                        }
                                        disabled={
                                            creatingStaff
                                        }
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="staff@example.com"
                                        value={
                                            staffForm.email
                                        }
                                        onChange={
                                            handleStaffChange
                                        }
                                        disabled={
                                            creatingStaff
                                        }
                                    />

                                </div>


                                {/* NGÀY SINH */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Ngày sinh
                                    </label>

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        className="form-control"
                                        value={
                                            staffForm.dateOfBirth
                                        }
                                        onChange={
                                            handleStaffChange
                                        }
                                        disabled={
                                            creatingStaff
                                        }
                                    />

                                </div>


                                {/* GIỚI TÍNH */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Giới tính
                                    </label>

                                    <select
                                        name="gender"
                                        className="form-select"
                                        value={
                                            staffForm.gender
                                        }
                                        onChange={
                                            handleStaffChange
                                        }
                                        disabled={
                                            creatingStaff
                                        }
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


                                {/* ADDRESS */}

                                <div className="col-12 mb-3">

                                    <label className="form-label">
                                        Địa chỉ
                                    </label>

                                    <input
                                        type="text"
                                        name="address"
                                        className="form-control"
                                        placeholder="Địa chỉ nhân viên"
                                        value={
                                            staffForm.address
                                        }
                                        onChange={
                                            handleStaffChange
                                        }
                                        disabled={
                                            creatingStaff
                                        }
                                    />

                                </div>

                            </div>


                            {/* BUTTONS */}

                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={
                                        creatingStaff
                                    }
                                >

                                    {creatingStaff ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>

                                            Đang tạo...

                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-check-lg me-2"></i>

                                            Tạo Staff
                                        </>

                                    )}

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    disabled={
                                        creatingStaff
                                    }
                                    onClick={() =>
                                        setShowStaffForm(
                                            false
                                        )
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

                {/* TOTAL */}

                <div className="col-md-4">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Tổng tài khoản
                            </h6>

                            <h2 className="mb-0">
                                {totalUsers}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* CUSTOMER */}

                <div className="col-md-4">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Khách hàng
                            </h6>

                            <h2 className="mb-0">
                                {totalCustomers}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* STAFF */}

                <div className="col-md-4">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Nhân viên
                            </h6>

                            <h2 className="mb-0">
                                {totalStaff}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                USER TABLE
            ================================================== */}

            <div className="card shadow-sm">

                <div className="card-header d-flex justify-content-between align-items-center">

                    <h5 className="mb-0">
                        Danh sách tài khoản
                    </h5>


                    <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={loadUsers}
                        disabled={loading}
                    >

                        <i className="bi bi-arrow-clockwise me-1"></i>

                        Làm mới

                    </button>

                </div>


                <div className="card-body p-0">

                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {loading ? (

                        <div className="text-center p-5">

                            <div
                                className="spinner-border text-success"
                                role="status"
                            >

                                <span className="visually-hidden">
                                    Đang tải...
                                </span>

                            </div>

                            <p className="text-muted mt-3 mb-0">
                                Đang tải dữ liệu người dùng...
                            </p>

                        </div>

                    ) : users.length === 0 ? (

                        /* ==================================================
                           EMPTY
                        ================================================== */

                        <div className="text-center p-5">

                            <i className="bi bi-people fs-1 text-muted"></i>

                            <p className="text-muted mt-2 mb-0">
                                Chưa có tài khoản nào
                            </p>

                        </div>

                    ) : (

                        /* ==================================================
                           TABLE
                        ================================================== */

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
                                        (user, index) => {

                                            const userId =
                                                getUserId(
                                                    user
                                                );


                                            const isDeleting =
                                                String(
                                                    deletingUserId
                                                ) ===
                                                String(
                                                    userId
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        userId ||
                                                        index
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                user?.fullName ||
                                                                user?.name ||
                                                                "Không có tên"
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>
                                                        {
                                                            user?.phone ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            user?.email ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`badge ${getRoleClass(
                                                                user?.role
                                                            )}`}
                                                        >

                                                            {
                                                                getRoleText(
                                                                    user?.role
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    <td className="text-center">

                                                        {user?.role?.toLowerCase() ===
                                                        "admin" ? (

                                                            <span className="text-muted">

                                                                <i className="bi bi-shield-lock-fill me-1"></i>

                                                                Tài khoản hệ thống

                                                            </span>

                                                        ) : (

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                disabled={
                                                                    isDeleting
                                                                }
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        user
                                                                    )
                                                                }
                                                            >

                                                                {isDeleting ? (

                                                                    <>
                                                                        <span
                                                                            className="spinner-border spinner-border-sm me-1"
                                                                            role="status"
                                                                        ></span>

                                                                        Đang xóa...
                                                                    </>

                                                                ) : (

                                                                    <>
                                                                        <i className="bi bi-trash-fill me-1"></i>

                                                                        Xóa
                                                                    </>

                                                                )}

                                                            </button>

                                                        )}

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


export default UserManagement;