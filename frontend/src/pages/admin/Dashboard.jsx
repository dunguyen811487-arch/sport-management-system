import {
    useEffect,
    useState,
} from "react";

import AdminStatCard
    from "../../components/admin/AdminStatCard";

import Loading
    from "../../components/common/Loading";

import ErrorMessage
    from "../../components/common/ErrorMessage";

import apiClient
    from "../../api/apiClient";


function Dashboard() {

    // ==========================================================
    // NGÀY ĐƯỢC CHỌN
    // Mặc định = ngày hiện tại
    // ==========================================================

    const getToday = () => {

        const date =
            new Date();

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        return `${year}-${month}-${day}`;
    };


    const [
        selectedDate,
        setSelectedDate,
    ] = useState(
        getToday()
    );


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        dashboardData,
        setDashboardData,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ==========================================================
    // FORMAT MONEY
    // ==========================================================

    const formatCurrency = (
        value
    ) => {

        return (
            new Intl.NumberFormat(
                "vi-VN"
            ).format(
                Number(
                    value || 0
                )
            ) + " đ"
        );
    };


    // ==========================================================
    // FORMAT DATE TIME
    // ==========================================================

    const formatDateTime = (
        value
    ) => {

        if (!value) {
            return "--";
        }


        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "--";
        }


        return date.toLocaleString(
            "vi-VN"
        );
    };


    // ==========================================================
    // FORMAT SELECTED DATE
    // ==========================================================

    const formatSelectedDate = (
        value
    ) => {

        if (!value) {
            return "--";
        }


        const date =
            new Date(
                `${value}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }


        return date.toLocaleDateString(
            "vi-VN"
        );
    };


    // ==========================================================
    // GET ARRAY DATA
    // ==========================================================

    const getArrayData = (
        response
    ) => {

        if (
            Array.isArray(
                response
            )
        ) {

            return response;
        }


        if (
            Array.isArray(
                response?.data
            )
        ) {

            return response.data;
        }


        return [];
    };


    // ==========================================================
    // CHECK SAME DAY
    //
    // Không dùng toISOString()
    // để tránh lệch ngày do UTC.
    // ==========================================================

    const isSameDate = (
        value,
        selected
    ) => {

        if (
            !value ||
            !selected
        ) {

            return false;
        }


        // --------------------------------------------------
        // Backend trả YYYY-MM-DD
        // --------------------------------------------------

        if (
            typeof value ===
                "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(
                value
            )
        ) {

            return (
                value ===
                selected
            );
        }


        // --------------------------------------------------
        // Backend trả ISO / Date
        // --------------------------------------------------

        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return false;
        }


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            `${year}-${month}-${day}` ===
            selected
        );
    };


    // ==========================================================
    // USER NAME
    // ==========================================================

    const getUserName = (
        user
    ) => {

        if (!user) {
            return "Người dùng";
        }


        return (
            user?.fullName ||
            user?.name ||
            user?.phone ||
            user?.email ||
            "Người dùng"
        );
    };


    // ==========================================================
    // BOOKING CUSTOMER NAME
    // ==========================================================

    const getBookingCustomerName = (
        booking
    ) => {

        const customer =
            booking?.customerId;


        if (
            customer &&
            typeof customer ===
                "object"
        ) {

            return (
                customer.fullName ||
                customer.name ||
                customer.phone ||
                "Khách hàng"
            );
        }


        return (
            booking?.customerName ||
            booking?.fullName ||
            "Khách hàng"
        );
    };


    // ==========================================================
    // BOOKING FIELD NAME
    // ==========================================================

    const getBookingFieldName = (
        booking
    ) => {

        const field =
            booking?.fieldId;


        if (
            field &&
            typeof field ===
                "object"
        ) {

            return (
                field.fieldName ||
                field.name ||
                "Sân thể thao"
            );
        }


        return (
            booking?.fieldName ||
            "Sân thể thao"
        );
    };


    // ==========================================================
    // TIMESTAMP
    // ==========================================================

    const getTimestamp = (
        item
    ) => {

        const value =
            item?.createdAt ||
            item?.updatedAt;


        if (!value) {
            return 0;
        }


        const timestamp =
            new Date(
                value
            ).getTime();


        return Number.isNaN(
            timestamp
        )
            ? 0
            : timestamp;
    };


    // ==========================================================
    // PAYMENT STATUS TEXT
    // ==========================================================

    const getPaymentStatusText = (
        status
    ) => {

        switch (
            String(
                status ||
                ""
            ).toLowerCase()
        ) {

            case "pending":

                return "Chờ xác nhận";


            case "paid":

                return "Đã thanh toán";


            case "failed":

                return "Thanh toán thất bại";


            case "cancelled":

                return "Đã hủy";


            case "refunded":

                return "Đã hoàn tiền";


            default:

                return "Không xác định";
        }
    };


    // ==========================================================
    // LOAD DASHBOARD
    // ==========================================================

    const loadDashboardData =
        async () => {

            try {

                setLoading(true);
                setError("");


                const [
                    usersResponse,
                    fieldsResponse,
                    bookingsResponse,
                    paymentsResponse,
                ] = await Promise.all([

                    apiClient(
                        "/users",
                        {
                            method:
                                "GET",
                        }
                    ),

                    apiClient(
                        "/fields",
                        {
                            method:
                                "GET",
                        }
                    ),

                    apiClient(
                        "/bookings",
                        {
                            method:
                                "GET",
                        }
                    ),

                    apiClient(
                        "/payments",
                        {
                            method:
                                "GET",
                        }
                    ),

                ]);


                // ==================================================
                // ARRAY DATA
                // ==================================================

                const users =
                    getArrayData(
                        usersResponse
                    );


                const fields =
                    getArrayData(
                        fieldsResponse
                    );


                const bookings =
                    getArrayData(
                        bookingsResponse
                    );


                const payments =
                    getArrayData(
                        paymentsResponse
                    );


                // ==================================================
                // USER
                //
                // Tổng toàn hệ thống
                // ==================================================

                const totalUsers =
                    users.length;


                const totalCustomers =
                    users.filter(
                        user =>
                            String(
                                user?.role ||
                                ""
                            ).toLowerCase() ===
                            "customer"
                    ).length;


                const totalStaff =
                    users.filter(
                        user =>
                            String(
                                user?.role ||
                                ""
                            ).toLowerCase() ===
                            "staff"
                    ).length;


                // ==================================================
                // FIELD
                //
                // Tổng toàn hệ thống
                // ==================================================

                const totalFields =
                    fields.length;


                const activeFields =
                    fields.filter(
                        field =>
                            field?.status ===
                            "active"
                    ).length;


                // ==================================================
                // BOOKING - TỔNG TOÀN HỆ THỐNG
                // ==================================================

                const totalBookings =
                    bookings.length;


                const totalPendingBookings =
                    bookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "pending"
                    ).length;


                const totalConfirmedBookings =
                    bookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "confirmed"
                    ).length;


                const totalCancelledBookings =
                    bookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "cancelled"
                    ).length;


                // ==================================================
                // BOOKING - THEO NGÀY
                // ==================================================

                const selectedBookings =
                    bookings.filter(
                        booking =>
                            isSameDate(
                                booking?.bookingDate,
                                selectedDate
                            )
                    );


                const selectedTotalBookings =
                    selectedBookings.length;


                const selectedPendingBookings =
                    selectedBookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "pending"
                    ).length;


                const selectedConfirmedBookings =
                    selectedBookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "confirmed"
                    ).length;


                const selectedCancelledBookings =
                    selectedBookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "cancelled"
                    ).length;


                // ==================================================
                // PAYMENT - TỔNG TOÀN HỆ THỐNG
                // ==================================================

                const totalPayments =
                    payments.length;


                const totalPendingPayments =
                    payments.filter(
                        payment =>
                            String(
                                payment?.status ||
                                ""
                            ).toLowerCase() ===
                            "pending"
                    ).length;


                const totalPaidPayments =
                    payments.filter(
                        payment =>
                            String(
                                payment?.status ||
                                ""
                            ).toLowerCase() ===
                            "paid"
                    ).length;


                const totalRevenue =
                    payments
                        .filter(
                            payment =>
                                String(
                                    payment?.status ||
                                    ""
                                ).toLowerCase() ===
                                "paid"
                        )
                        .reduce(
                            (
                                total,
                                payment
                            ) => {

                                return (
                                    total +
                                    Number(
                                        payment?.amount ||
                                        0
                                    )
                                );

                            },
                            0
                        );


                // ==================================================
                // PAYMENT - THEO NGÀY
                //
                // Nếu paid:
                // → ưu tiên paidAt
                //
                // ==================================================

                const selectedPayments =
                    payments.filter(
                        payment => {

                            const paymentDate =
                                payment?.paidAt ||
                                payment?.createdAt;


                            return isSameDate(
                                paymentDate,
                                selectedDate
                            );
                        }
                    );


                const selectedPendingPayments =
                    selectedPayments.filter(
                        payment =>
                            String(
                                payment?.status ||
                                ""
                            ).toLowerCase() ===
                            "pending"
                    ).length;


                const selectedPaidPayments =
                    selectedPayments.filter(
                        payment =>
                            String(
                                payment?.status ||
                                ""
                            ).toLowerCase() ===
                            "paid"
                    );


                const selectedRevenue =
                    selectedPaidPayments.reduce(
                        (
                            total,
                            payment
                        ) => {

                            return (
                                total +
                                Number(
                                    payment?.amount ||
                                    0
                                )
                            );

                        },
                        0
                    );


                // ==================================================
                // RECENT ACTIVITIES
                // ==================================================

                const activities = [];


                // ==================================================
                // CUSTOMER MỚI
                //
                // Không lọc theo selectedDate
                // để giữ lịch sử hoạt động gần đây
                // ==================================================

                users
                    .filter(
                        user =>
                            String(
                                user?.role ||
                                ""
                            ).toLowerCase() ===
                            "customer"
                    )
                    .forEach(
                        user => {

                            if (
                                !user?.createdAt
                            ) {
                                return;
                            }


                            activities.push({

                                type:
                                    "customer",

                                createdAt:
                                    user.createdAt,

                                icon:
                                    "bi-person-plus-fill",

                                color:
                                    "success",

                                title:
                                    "Người dùng mới đăng ký",

                                description:
                                    `${getUserName(
                                        user
                                    )} • Role: Customer`,
                            });
                        }
                    );


                // ==================================================
                // STAFF MỚI
                // ==================================================

                users
                    .filter(
                        user =>
                            String(
                                user?.role ||
                                ""
                            ).toLowerCase() ===
                            "staff"
                    )
                    .forEach(
                        user => {

                            if (
                                !user?.createdAt
                            ) {
                                return;
                            }


                            activities.push({

                                type:
                                    "staff",

                                createdAt:
                                    user.createdAt,

                                icon:
                                    "bi-person-badge-fill",

                                color:
                                    "info",

                                title:
                                    "Nhân viên mới",

                                description:
                                    `${getUserName(
                                        user
                                    )} • Staff`,
                            });
                        }
                    );


                // ==================================================
                // BOOKING MỚI
                // ==================================================

                bookings.forEach(
                    booking => {

                        if (
                            !booking?.createdAt
                        ) {
                            return;
                        }


                        activities.push({

                            type:
                                "booking",

                            createdAt:
                                booking.createdAt,

                            icon:
                                "bi-calendar-check-fill",

                            color:
                                "primary",

                            title:
                                "Đặt sân mới",

                            description:
                                `${getBookingCustomerName(
                                    booking
                                )} đặt ${getBookingFieldName(
                                    booking
                                )} • ${
                                    booking?.startTime ||
                                    "--"
                                } - ${
                                    booking?.endTime ||
                                    "--"
                                }`,
                        });
                    }
                );


                // ==================================================
                // PAYMENT MỚI
                // ==================================================

                payments.forEach(
                    payment => {

                        const activityDate =
                            payment?.paidAt ||
                            payment?.createdAt ||
                            payment?.updatedAt;


                        if (
                            !activityDate
                        ) {
                            return;
                        }


                        const methodText =
                            payment?.paymentMethod ===
                            "cash"
                                ? "Tiền mặt"
                                : "Chuyển khoản / VNPay";


                        activities.push({

                            type:
                                "payment",

                            createdAt:
                                activityDate,

                            icon:
                                "bi-credit-card-fill",

                            color:
                                "warning",

                            title:
                                "Thanh toán",

                            description:
                                `${methodText} • ${formatCurrency(
                                    payment?.amount ||
                                    0
                                )} • ${getPaymentStatusText(
                                    payment?.status
                                )}`,
                        });
                    }
                );


                activities.sort(
                    (
                        a,
                        b
                    ) =>
                        getTimestamp(b) -
                        getTimestamp(a)
                );


                setDashboardData({

                    // ==============================
                    // USER
                    // ==============================

                    totalUsers,

                    totalCustomers,

                    totalStaff,


                    // ==============================
                    // FIELD
                    // ==============================

                    totalFields,

                    activeFields,


                    // ==============================
                    // BOOKING - TỔNG
                    // ==============================

                    totalBookings,

                    totalPendingBookings,

                    totalConfirmedBookings,

                    totalCancelledBookings,


                    // ==============================
                    // BOOKING - NGÀY
                    // ==============================

                    selectedTotalBookings,

                    selectedPendingBookings,

                    selectedConfirmedBookings,

                    selectedCancelledBookings,


                    // ==============================
                    // PAYMENT - TỔNG
                    // ==============================

                    totalPayments,

                    totalPendingPayments,

                    totalPaidPayments,

                    totalRevenue,


                    // ==============================
                    // PAYMENT - NGÀY
                    // ==============================

                    selectedPayments:
                        selectedPayments.length,

                    selectedPendingPayments,

                    selectedPaidPayments:
                        selectedPaidPayments.length,

                    selectedRevenue,


                    // ==============================
                    // ACTIVITY
                    // ==============================

                    latestActivities:
                        activities.slice(
                            0,
                            4
                        ),

                });

            } catch (err) {

                console.error(
                    "Lỗi tải Dashboard:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tải dữ liệu Dashboard."
                );

            } finally {

                setLoading(false);
            }
        };


    // ==========================================================
    // LOAD WHEN DATE CHANGES
    // ==========================================================

    useEffect(() => {

        loadDashboardData();

    }, [
        selectedDate,
    ]);


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return <Loading />;
    }


    // ==========================================================
    // ERROR
    // ==========================================================

    if (error) {

        return (

            <div>

                <div className="mb-4">

                    <h1 className="mb-1">
                        Dashboard
                    </h1>


                    <p className="text-muted">
                        Tổng quan hệ thống quản lý sân thể thao
                    </p>

                </div>


                <ErrorMessage
                    message={error}
                />

            </div>
        );
    }


    // ==========================================================
    // SAFETY
    // ==========================================================

    if (!dashboardData) {

        return null;
    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="d-flex justify-content-between align-items-end mb-4">

                <div>

                    <h1 className="mb-1">
                        Dashboard
                    </h1>


                    <p className="text-muted mb-0">
                        Tổng quan hệ thống quản lý sân thể thao
                    </p>

                </div>


                <div>

                    <label className="form-label mb-1">
                        Ngày thống kê
                    </label>


                    <div className="d-flex gap-2">

                        <input
                            type="date"
                            className="form-control"
                            value={
                                selectedDate
                            }
                            onChange={
                                e =>
                                    setSelectedDate(
                                        e.target.value
                                    )
                            }
                        />


                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={
                                loadDashboardData
                            }
                            disabled={
                                loading
                            }
                        >

                            <i className="bi bi-arrow-clockwise"></i>

                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                SELECTED DATE
            ================================================== */}

            <div className="alert alert-light border mb-4">

                <i className="bi bi-calendar3 me-2"></i>

                Thống kê ngày{" "}

                <strong>

                    {
                        formatSelectedDate(
                            selectedDate
                        )
                    }

                </strong>

            </div>


            {/* ==================================================
                USER STATISTICS
                Tổng toàn hệ thống
            ================================================== */}

            <div className="row g-4 mb-4">

                <div className="col-md-4">

                    <AdminStatCard
                        title="Tổng người dùng"
                        value={
                            dashboardData.totalUsers
                        }
                        icon="bi-people-fill"
                        description="Tổng tài khoản trong hệ thống"
                    />

                </div>


                <div className="col-md-4">

                    <AdminStatCard
                        title="Khách hàng"
                        value={
                            dashboardData.totalCustomers
                        }
                        icon="bi-person-fill"
                        description="Tổng tài khoản Customer"
                    />

                </div>


                <div className="col-md-4">

                    <AdminStatCard
                        title="Nhân viên"
                        value={
                            dashboardData.totalStaff
                        }
                        icon="bi-person-badge-fill"
                        description="Tổng tài khoản Staff"
                    />

                </div>

            </div>


            {/* ==================================================
                FIELD
                Tổng toàn hệ thống
            ================================================== */}

            <div className="row g-4 mb-4">

                <div className="col-md-4">

                    <AdminStatCard
                        title="Tổng số sân"
                        value={
                            dashboardData.totalFields
                        }
                        icon="bi-grid-3x3-gap-fill"
                        description={`Đang hoạt động: ${dashboardData.activeFields}`}
                    />

                </div>


                {/* ==================================================
                    BOOKING TRONG NGÀY
                ================================================== */}

                <div className="col-md-4">

                    <AdminStatCard
                        title="Lượt đặt trong ngày"
                        value={
                            dashboardData.selectedTotalBookings
                        }
                        icon="bi-calendar-check-fill"
                        description={`Ngày ${formatSelectedDate(
                            selectedDate
                        )}`}
                    />

                </div>


                {/* ==================================================
                    BOOKING TỔNG
                ================================================== */}

                <div className="col-md-4">

                    <AdminStatCard
                        title="Tổng lượt đặt sân"
                        value={
                            dashboardData.totalBookings
                        }
                        icon="bi-calendar-check"
                        description={`Tổng hệ thống • Chờ xử lý: ${dashboardData.totalPendingBookings}`}
                    />

                </div>

            </div>


            {/* ==================================================
                BOOKING STATUS
            ================================================== */}

            <div className="row g-4 mb-4">

                {/* NGÀY */}

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-header bg-white">

                            <h5 className="mb-1">
                                Tình hình đặt sân
                            </h5>


                            <small className="text-muted">

                                Ngày{" "}

                                {
                                    formatSelectedDate(
                                        selectedDate
                                    )
                                }

                            </small>

                        </div>


                        <div className="card-body">

                            <div className="row text-center">

                                <div className="col-4">

                                    <h3 className="text-warning">

                                        {
                                            dashboardData.selectedPendingBookings
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Chờ xử lý
                                    </small>

                                </div>


                                <div className="col-4">

                                    <h3 className="text-success">

                                        {
                                            dashboardData.selectedConfirmedBookings
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Đã xác nhận
                                    </small>

                                </div>


                                <div className="col-4">

                                    <h3 className="text-danger">

                                        {
                                            dashboardData.selectedCancelledBookings
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Đã hủy
                                    </small>

                                </div>

                            </div>


                            <hr />


                            <div className="text-center">

                                <small className="text-muted">
                                    Tổng lượt đặt trong ngày
                                </small>


                                <h4 className="mb-0">

                                    {
                                        dashboardData.selectedTotalBookings
                                    }

                                </h4>

                            </div>

                        </div>

                    </div>

                </div>


                {/* TỔNG */}

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-header bg-white">

                            <h5 className="mb-1">
                                Tổng tình hình đặt sân
                            </h5>


                            <small className="text-muted">
                                Toàn hệ thống
                            </small>

                        </div>


                        <div className="card-body">

                            <div className="row text-center">

                                <div className="col-4">

                                    <h3 className="text-warning">

                                        {
                                            dashboardData.totalPendingBookings
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Chờ xử lý
                                    </small>

                                </div>


                                <div className="col-4">

                                    <h3 className="text-success">

                                        {
                                            dashboardData.totalConfirmedBookings
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Đã xác nhận
                                    </small>

                                </div>


                                <div className="col-4">

                                    <h3 className="text-danger">

                                        {
                                            dashboardData.totalCancelledBookings
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Đã hủy
                                    </small>

                                </div>

                            </div>


                            <hr />


                            <div className="text-center">

                                <small className="text-muted">
                                    Tổng lượt đặt toàn hệ thống
                                </small>


                                <h4 className="mb-0">

                                    {
                                        dashboardData.totalBookings
                                    }

                                </h4>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                PAYMENT
            ================================================== */}

            <div className="row g-4 mb-4">

                {/* PAYMENT THEO NGÀY */}

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-header bg-white">

                            <h5 className="mb-1">
                                Thanh toán trong ngày
                            </h5>


                            <small className="text-muted">

                                Ngày{" "}

                                {
                                    formatSelectedDate(
                                        selectedDate
                                    )
                                }

                            </small>

                        </div>


                        <div className="card-body">

                            <div className="row text-center">

                                <div className="col-4">

                                    <h3>

                                        {
                                            dashboardData.selectedPayments
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Giao dịch
                                    </small>

                                </div>


                                <div className="col-4">

                                    <h3 className="text-warning">

                                        {
                                            dashboardData.selectedPendingPayments
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Chờ xác nhận
                                    </small>

                                </div>


                                <div className="col-4">

                                    <h3 className="text-success">

                                        {
                                            dashboardData.selectedPaidPayments
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Đã thanh toán
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* PAYMENT TỔNG */}

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-header bg-white">

                            <h5 className="mb-1">
                                Tổng thanh toán
                            </h5>


                            <small className="text-muted">
                                Toàn hệ thống
                            </small>

                        </div>


                        <div className="card-body">

                            <div className="row text-center">

                                <div className="col-4">

                                    <h3>

                                        {
                                            dashboardData.totalPayments
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Giao dịch
                                    </small>

                                </div>


                                <div className="col-4">

                                    <h3 className="text-warning">

                                        {
                                            dashboardData.totalPendingPayments
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Chờ xác nhận
                                    </small>

                                </div>


                                <div className="col-4">

                                    <h3 className="text-success">

                                        {
                                            dashboardData.totalPaidPayments
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Đã thanh toán
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                REVENUE
            ================================================== */}

            <div className="row g-4 mb-4">

                {/* DOANH THU NGÀY */}

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-header bg-white">

                            <h5 className="mb-1">
                                Doanh thu
                            </h5>


                            <small className="text-muted">

                                Ngày{" "}

                                {
                                    formatSelectedDate(
                                        selectedDate
                                    )
                                }

                            </small>

                        </div>


                        <div className="card-body">

                            <h2 className="text-success mb-2">

                                {
                                    formatCurrency(
                                        dashboardData.selectedRevenue
                                    )
                                }

                            </h2>


                            <p className="text-muted mb-0">

                                Doanh thu từ các giao dịch đã thanh toán.

                            </p>

                        </div>

                    </div>

                </div>


                {/* DOANH THU TỔNG */}

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-header bg-white">

                            <h5 className="mb-1">
                                Tổng doanh thu
                            </h5>


                            <small className="text-muted">
                                Toàn hệ thống
                            </small>

                        </div>


                        <div className="card-body">

                            <h2 className="text-success mb-2">

                                {
                                    formatCurrency(
                                        dashboardData.totalRevenue
                                    )
                                }

                            </h2>


                            <p className="text-muted mb-0">

                                Tổng doanh thu từ các giao dịch đã thanh toán.

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ACTIVITY
            ================================================== */}

            <div className="card">

                <div className="card-header bg-white d-flex justify-content-between align-items-center">

                    <div>

                        <h5 className="mb-0">
                            Lịch sử hoạt động
                        </h5>


                        <small className="text-muted">
                            Các hoạt động gần đây trong hệ thống
                        </small>

                    </div>


                    <button
                        className="btn btn-sm btn-outline-primary"
                        type="button"
                        onClick={
                            loadDashboardData
                        }
                        disabled={
                            loading
                        }
                    >

                        <i className="bi bi-arrow-clockwise me-1"></i>

                        Cập nhật

                    </button>

                </div>


                <div className="list-group list-group-flush">

                    {
                        dashboardData.latestActivities.length ===
                        0 ? (

                            <div className="list-group-item py-4 text-center">

                                <i
                                    className="bi bi-clock-history fs-1 text-muted"
                                ></i>


                                <p className="text-muted mt-3 mb-0">
                                    Chưa có hoạt động nào.
                                </p>

                            </div>

                        ) : (

                            dashboardData.latestActivities.map(
                                (
                                    activity,
                                    index
                                ) => (

                                    <div
                                        className="list-group-item py-3"
                                        key={
                                            `${activity.type}-${activity.createdAt}-${index}`
                                        }
                                    >

                                        <div className="d-flex align-items-start">

                                            <div
                                                className={
                                                    `bg-${activity.color} bg-opacity-10 text-${activity.color} rounded-circle d-flex align-items-center justify-content-center me-3`
                                                }
                                                style={{
                                                    width:
                                                        "42px",

                                                    height:
                                                        "42px",

                                                    flexShrink:
                                                        0,
                                                }}
                                            >

                                                <i
                                                    className={
                                                        `bi ${activity.icon}`
                                                    }
                                                ></i>

                                            </div>


                                            <div className="flex-grow-1">

                                                <div className="fw-semibold">

                                                    {
                                                        activity.title
                                                    }

                                                </div>


                                                <small className="text-muted">

                                                    {
                                                        activity.description
                                                    }

                                                </small>

                                            </div>


                                            <small className="text-muted">

                                                {
                                                    formatDateTime(
                                                        activity.createdAt
                                                    )
                                                }

                                            </small>

                                        </div>

                                    </div>
                                )
                            )
                        )
                    }

                </div>

            </div>

        </div>
    );
}


export default Dashboard;