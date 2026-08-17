import {
    useEffect,
    useState,
} from "react";

import apiClient
    from "../../api/apiClient";


function Dashboard() {

    // ==========================================================
    // TODAY
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


    // ==========================================================
    // SELECTED DATE
    // ==========================================================

    const [
        selectedDate,
        setSelectedDate,
    ] = useState(
        getToday()
    );


    // ==========================================================
    // DATA
    // ==========================================================

    const [
        data,
        setData,
    ] = useState({

        totalFields:
            0,

        activeFields:
            0,

        // Booking theo ngày
        totalBookings:
            0,

        pendingBookings:
            0,

        confirmedBookings:
            0,

        cancelledBookings:
            0,

        // Payment toàn hệ thống
        totalPayments:
            0,

        pendingPayments:
            0,

        // Payment trong ngày
        paidPayments:
            0,

        totalRevenue:
            0,

    });


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ==========================================================
    // CHECK SAME DATE
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
        // Backend trả trực tiếp YYYY-MM-DD
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
    // FORMAT DATE
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
    // FORMAT MONEY
    // ==========================================================

    const formatMoney =
        (
            value
        ) => {

            return (
                Number(
                    value || 0
                ).toLocaleString(
                    "vi-VN"
                ) +
                " đ"
            );
        };


    // ==========================================================
    // LOAD DASHBOARD
    // ==========================================================

    const loadDashboard =
        async () => {

            try {

                setLoading(true);
                setError("");


                // ==================================================
                // LOAD DATA
                // ==================================================

                const [
                    fieldsResponse,
                    bookingsResponse,
                    paymentsResponse,
                ] = await Promise.all([

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

                const fields =
                    Array.isArray(
                        fieldsResponse?.data
                    )
                        ? fieldsResponse.data
                        : Array.isArray(
                            fieldsResponse
                        )
                            ? fieldsResponse
                            : [];


                const bookings =
                    Array.isArray(
                        bookingsResponse?.data
                    )
                        ? bookingsResponse.data
                        : Array.isArray(
                            bookingsResponse
                        )
                            ? bookingsResponse
                            : [];


                const payments =
                    Array.isArray(
                        paymentsResponse?.data
                    )
                        ? paymentsResponse.data
                        : Array.isArray(
                            paymentsResponse
                        )
                            ? paymentsResponse
                            : [];


                // ==================================================
                // FIELD
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
                // BOOKING THEO NGÀY ĐANG CHỌN
                // ==================================================

                const selectedBookings =
                    bookings.filter(
                        booking =>
                            isSameDate(
                                booking?.bookingDate,
                                selectedDate
                            )
                    );


                // ==================================================
                // BOOKING STATUS
                // ==================================================

                const totalBookings =
                    selectedBookings.length;


                const pendingBookings =
                    selectedBookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "pending"
                    ).length;


                const confirmedBookings =
                    selectedBookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "confirmed"
                    ).length;


                const cancelledBookings =
                    selectedBookings.filter(
                        booking =>
                            String(
                                booking?.status ||
                                ""
                            ).toLowerCase() ===
                            "cancelled"
                    ).length;


                // ==================================================
                // PAYMENT TOÀN HỆ THỐNG
                // ==================================================

                const totalPayments =
                    payments.length;


                const pendingPayments =
                    payments.filter(
                        payment =>
                            String(
                                payment?.status ||
                                ""
                            ).toLowerCase() ===
                            "pending"
                    ).length;


                // ==================================================
                // PAYMENT ĐÃ PAID TRONG NGÀY ĐANG CHỌN
                // ==================================================

                const selectedPaidPayments =
                    payments.filter(
                        payment => {

                            const status =
                                String(
                                    payment?.status ||
                                    ""
                                ).toLowerCase();


                            if (
                                status !==
                                "paid"
                            ) {

                                return false;
                            }


                            const paymentDate =
                                payment?.paidAt ||
                                payment?.createdAt;


                            return isSameDate(
                                paymentDate,
                                selectedDate
                            );
                        }
                    );


                // ==================================================
                // DOANH THU
                // ==================================================

                const totalRevenue =
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
                // SAVE DATA
                // ==================================================

                setData({

                    totalFields,

                    activeFields,

                    totalBookings,

                    pendingBookings,

                    confirmedBookings,

                    cancelledBookings,

                    totalPayments,

                    pendingPayments,

                    paidPayments:
                        selectedPaidPayments.length,

                    totalRevenue,

                });

            } catch (err) {

                console.error(
                    "Staff dashboard error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tải Dashboard."
                );

            } finally {

                setLoading(false);
            }
        };


    // ==========================================================
    // LOAD WHEN DATE CHANGES
    // ==========================================================

    useEffect(() => {

        loadDashboard();

    }, [
        selectedDate,
    ]);


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-success"
                    role="status"
                />

                <p className="text-muted mt-3">
                    Đang tải Dashboard...
                </p>

            </div>
        );
    }


    // ==========================================================
    // ERROR
    // ==========================================================

    if (error) {

        return (

            <div>

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h1 className="mb-1">
                            Dashboard
                        </h1>

                        <p className="text-muted mb-0">
                            Tổng quan hoạt động sân thể thao
                        </p>

                    </div>

                </div>


                <div className="alert alert-danger">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    {error}


                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={
                            loadDashboard
                        }
                    >

                        Thử lại

                    </button>

                </div>

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

            <div className="d-flex justify-content-between align-items-end mb-4">

                <div>

                    <h1 className="mb-1">
                        Dashboard
                    </h1>


                    <p className="text-muted mb-0">
                        Tổng quan hoạt động sân thể thao
                    </p>

                </div>


                {/* NGÀY THỐNG KÊ */}

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
                                loadDashboard
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
                SUMMARY
            ================================================== */}

            <div className="row g-4 mb-4">

                {/* TỔNG SỐ SÂN */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <small className="text-muted">
                                Tổng số sân
                            </small>


                            <h2 className="mb-1">

                                {
                                    data.totalFields
                                }

                            </h2>


                            <small className="text-success">

                                {
                                    data.activeFields
                                }{" "}
                                sân hoạt động

                            </small>

                        </div>

                    </div>

                </div>


                {/* LƯỢT ĐẶT TRONG NGÀY */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <small className="text-muted">
                                Lượt đặt trong ngày
                            </small>


                            <h2 className="mb-1">

                                {
                                    data.totalBookings
                                }

                            </h2>


                            <small className="text-warning">

                                {
                                    data.pendingBookings
                                }{" "}
                                chờ xử lý

                            </small>

                        </div>

                    </div>

                </div>


                {/* TỔNG GIAO DỊCH */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <small className="text-muted">
                                Tổng giao dịch
                            </small>


                            <h2 className="mb-1">

                                {
                                    data.totalPayments
                                }

                            </h2>


                            <small className="text-warning">

                                {
                                    data.pendingPayments
                                }{" "}
                                chờ xác nhận

                            </small>

                        </div>

                    </div>

                </div>


                {/* DOANH THU */}

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <small className="text-muted">
                                Doanh thu trong ngày
                            </small>


                            <h3 className="text-success mb-1">

                                {
                                    formatMoney(
                                        data.totalRevenue
                                    )
                                }

                            </h3>


                            <small className="text-muted">

                                {
                                    data.paidPayments
                                }{" "}
                                payment đã thanh toán

                            </small>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                BOOKING STATUS THEO NGÀY
            ================================================== */}

            <div className="row g-4">

                {/* ==================================================
                    TÌNH HÌNH ĐẶT SÂN
                ================================================== */}

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

                                {/* CHỜ XỬ LÝ */}

                                <div className="col-4">

                                    <h3 className="text-warning">

                                        {
                                            data.pendingBookings
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Chờ xử lý
                                    </small>

                                </div>


                                {/* ĐÃ XÁC NHẬN */}

                                <div className="col-4">

                                    <h3 className="text-success">

                                        {
                                            data.confirmedBookings
                                        }

                                    </h3>


                                    <small className="text-muted">
                                        Đã xác nhận
                                    </small>

                                </div>


                                {/* ĐÃ HỦY */}

                                <div className="col-4">

                                    <h3 className="text-danger">

                                        {
                                            data.cancelledBookings
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
                                        data.totalBookings
                                    }

                                </h4>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    DOANH THU
                ================================================== */}

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
                                    formatMoney(
                                        data.totalRevenue
                                    )
                                }

                            </h2>


                            <p className="text-muted mb-0">

                                Doanh thu từ các giao dịch đã thanh toán.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Dashboard;