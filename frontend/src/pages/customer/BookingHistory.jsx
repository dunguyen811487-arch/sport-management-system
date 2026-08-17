import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import apiClient
    from "../../api/apiClient";

import paymentService
    from "../../services/paymentService";

import formatCurrency
    from "../../utils/formatCurrency";


function BookingHistory() {

    const navigate =
        useNavigate();


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        bookings,
        setBookings,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ==========================================================
    // LOAD BOOKINGS + PAYMENTS
    // ==========================================================

    const loadBookings =
        async () => {

            try {

                setLoading(true);
                setError("");


                // ==================================================
                // LẤY BOOKING + PAYMENT
                // ==================================================

                const [
                    bookingResponse,
                    paymentResponse,
                ] = await Promise.all([
                    apiClient(
                        "/bookings/my",
                        {
                            method:
                                "GET",
                        }
                    ),

                    paymentService.getMy(),
                ]);


                console.log(
                    "CUSTOMER BOOKINGS:",
                    bookingResponse
                );


                console.log(
                    "CUSTOMER PAYMENTS:",
                    paymentResponse
                );


                // ==================================================
                // BOOKING DATA
                // ==================================================

                const allBookings =
                    Array.isArray(
                        bookingResponse?.data
                    )
                        ? bookingResponse.data
                        : Array.isArray(
                            bookingResponse
                        )
                            ? bookingResponse
                            : [];


                // ==================================================
                // PAYMENT DATA
                // ==================================================

                const allPayments =
                    Array.isArray(
                        paymentResponse?.data
                    )
                        ? paymentResponse.data
                        : Array.isArray(
                            paymentResponse
                        )
                            ? paymentResponse
                            : [];


                // ==================================================
                // BOOKING ĐÃ CÓ PAYMENT
                // ==================================================

                const paymentBookingIds =
                    new Set();


                allPayments.forEach(
                    (
                        payment
                    ) => {

                        const booking =
                            payment?.bookingId;


                        const bookingId =
                            booking &&
                            typeof booking ===
                                "object"
                                ? booking?._id
                                : booking;


                        if (
                            bookingId
                        ) {

                            paymentBookingIds.add(
                                String(
                                    bookingId
                                )
                            );
                        }
                    }
                );


                // ==================================================
                // CHỈ HIỆN BOOKING ĐÃ CÓ PAYMENT
                // ==================================================

                const visibleBookings =
                    allBookings.filter(
                        (
                            booking
                        ) => {

                            if (
                                !booking?._id
                            ) {

                                return false;
                            }


                            return paymentBookingIds.has(
                                String(
                                    booking._id
                                )
                            );
                        }
                    );


                setBookings(
                    visibleBookings
                );

            } catch (err) {

                console.error(
                    "Load booking history error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tải lịch sử đặt sân."
                );


                setBookings([]);

            } finally {

                setLoading(false);

            }
        };


    // ==========================================================
    // LOAD WHEN PAGE OPEN
    // ==========================================================

    useEffect(() => {

        loadBookings();

    }, []);


    // ==========================================================
    // STATUS TEXT
    // ==========================================================

    const getStatusText =
        (
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


                case "confirmed":

                    return "Đã xác nhận";


                case "cancelled":

                    return "Đã hủy";


                default:

                    return "Không xác định";
            }
        };


    // ==========================================================
    // STATUS CLASS
    // ==========================================================

    const getStatusClass =
        (
            status
        ) => {

            switch (
                String(
                    status ||
                    ""
                ).toLowerCase()
            ) {

                case "pending":

                    return "bg-warning text-dark";


                case "confirmed":

                    return "bg-primary";


                case "cancelled":

                    return "bg-danger";


                default:

                    return "bg-secondary";
            }
        };


    // ==========================================================
    // FORMAT DATE
    // ==========================================================

    const formatDate =
        (
            value
        ) => {

            if (!value) {
                return "-";
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

                return "-";
            }


            return date.toLocaleDateString(
                "vi-VN"
            );
        };


    // ==========================================================
    // DATE KEY
    //
    // Dùng bookingDate để group.
    // Dùng local date để tránh lệch ngày do timezone.
    // ==========================================================

    const getBookingDateKey =
        (
            value
        ) => {

            if (!value) {
                return "";
            }


            // --------------------------------------------------
            // Nếu backend trả trực tiếp YYYY-MM-DD
            // --------------------------------------------------

            if (
                typeof value ===
                    "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(
                    value
                )
            ) {

                return value;
            }


            // --------------------------------------------------
            // Nếu backend trả Date / ISO
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

                return "";
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
                `${year}-${month}-${day}`
            );
        };


    // ==========================================================
    // GROUP BY BOOKING DATE
    // ==========================================================

    const groupedBookings =
        useMemo(() => {

            const groups = {};


            bookings.forEach(
                (
                    booking
                ) => {

                    const dateKey =
                        getBookingDateKey(
                            booking?.bookingDate
                        );


                    if (!dateKey) {

                        return;
                    }


                    if (
                        !groups[dateKey]
                    ) {

                        groups[dateKey] = [];
                    }


                    groups[dateKey].push(
                        booking
                    );
                }
            );


            // --------------------------------------------------
            // Sắp xếp booking trong cùng ngày theo giờ
            // --------------------------------------------------

            Object.values(
                groups
            ).forEach(
                (
                    dayBookings
                ) => {

                    dayBookings.sort(
                        (
                            a,
                            b
                        ) => {

                            const timeA =
                                String(
                                    a?.startTime ||
                                    ""
                                );


                            const timeB =
                                String(
                                    b?.startTime ||
                                    ""
                                );


                            return timeA.localeCompare(
                                timeB
                            );
                        }
                    );
                }
            );


            // --------------------------------------------------
            // Ngày mới nhất lên trước
            // --------------------------------------------------

            return Object.entries(
                groups
            ).sort(
                (
                    [
                        dateA
                    ],
                    [
                        dateB
                    ]
                ) =>
                    dateB.localeCompare(
                        dateA
                    )
            );

        }, [
            bookings,
        ]);


    // ==========================================================
    // CANCEL BOOKING
    // ==========================================================

    const handleCancelBooking =
        async (
            booking
        ) => {

            if (
                !booking?._id
            ) {

                return;
            }


            const confirmCancel =
                window.confirm(
                    "Bạn có chắc muốn hủy booking này không?"
                );


            if (!confirmCancel) {

                return;
            }


            try {

                await apiClient(
                    `/bookings/${booking._id}/cancel`,
                    {
                        method:
                            "PUT",
                    }
                );


                alert(
                    "Hủy booking thành công!"
                );


                await loadBookings();

            } catch (err) {

                console.error(
                    "Cancel booking error:",
                    err
                );


                alert(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể hủy booking."
                );
            }
        };


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div className="container-fluid py-5 text-center">

                <div
                    className="spinner-border text-success"
                    role="status"
                >

                    <span className="visually-hidden">
                        Đang tải...
                    </span>

                </div>


                <p className="text-muted mt-3">
                    Đang tải lịch sử đặt sân...
                </p>

            </div>
        );
    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div className="container-fluid">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Lịch sử đặt sân
                    </h2>


                    <p className="text-muted mb-0">
                        Danh sách các booking đã gửi yêu cầu thanh toán.
                    </p>

                </div>


                <Link
                    to="/booking"
                    className="btn btn-success"
                >

                    <i className="bi bi-plus-lg me-2"></i>

                    Đặt sân mới

                </Link>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {
                error && (

                    <div className="alert alert-danger">

                        <i className="bi bi-exclamation-triangle-fill me-2"></i>

                        {error}


                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-3"
                            onClick={
                                loadBookings
                            }
                        >

                            Thử lại

                        </button>

                    </div>
                )
            }


            {/* ==================================================
                EMPTY
            ================================================== */}

            {
                !error &&
                groupedBookings.length ===
                    0 && (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <i
                                className="bi bi-calendar-x text-muted"
                                style={{
                                    fontSize:
                                        "55px",
                                }}
                            ></i>


                            <h5 className="mt-3">
                                Chưa có lịch sử đặt sân
                            </h5>


                            <p className="text-muted">

                                Các booking chưa gửi yêu cầu thanh toán
                                sẽ chưa xuất hiện ở đây.

                            </p>


                            <Link
                                to="/booking"
                                className="btn btn-success"
                            >
                                Đặt sân ngay
                            </Link>

                        </div>

                    </div>
                )
            }


            {/* ==================================================
                GROUPED BOOKING LIST
            ================================================== */}

            {
                !error &&
                groupedBookings.length > 0 && (

                    <div>

                        {
                            groupedBookings.map(
                                (
                                    [
                                        dateKey,
                                        dayBookings
                                    ]
                                ) => (

                                    <div
                                        key={
                                            dateKey
                                        }
                                        className="mb-5"
                                    >

                                        {/* ==================================================
                                            DATE HEADER
                                        ================================================== */}

                                        <div className="d-flex justify-content-between align-items-center mb-3">

                                            <div>

                                                <h4 className="fw-bold mb-1">

                                                    <i className="bi bi-calendar3 me-2 text-success"></i>

                                                    Ngày{" "}

                                                    {
                                                        formatDate(
                                                            `${dateKey}T00:00:00`
                                                        )
                                                    }

                                                </h4>


                                                <p className="text-muted mb-0">

                                                    {
                                                        dayBookings.length
                                                    }{" "}

                                                    {
                                                        dayBookings.length ===
                                                        1
                                                            ? "lượt đặt sân"
                                                            : "lượt đặt sân"
                                                    }

                                                </p>

                                            </div>


                                            <span className="badge bg-success fs-6">

                                                {
                                                    dayBookings.length
                                                }{" "}
                                                sân

                                            </span>

                                        </div>


                                        {/* ==================================================
                                            CARD LIST
                                            GIỮ NGUYÊN FORM CŨ
                                        ================================================== */}

                                        <div className="row">

                                            {
                                                dayBookings.map(
                                                    (
                                                        booking
                                                    ) => {

                                                        const field =
                                                            booking?.fieldId;


                                                        return (

                                                            <div
                                                                key={
                                                                    booking._id
                                                                }
                                                                className="col-lg-6 mb-4"
                                                            >

                                                                <div className="card border-0 shadow-sm h-100">

                                                                    <div className="card-body">

                                                                        {/* ==================================================
                                                                            HEADER
                                                                        ================================================== */}

                                                                        <div className="d-flex justify-content-between align-items-start mb-3">

                                                                            <div>

                                                                                <h5 className="fw-bold mb-1">

                                                                                    {
                                                                                        field?.fieldName ||
                                                                                        "Sân không xác định"
                                                                                    }

                                                                                </h5>


                                                                                <p className="text-muted mb-0">

                                                                                    <i className="bi bi-geo-alt-fill me-2"></i>

                                                                                    {
                                                                                        field?.location ||
                                                                                        "Chưa cập nhật"
                                                                                    }

                                                                                </p>

                                                                            </div>


                                                                            <span
                                                                                className={
                                                                                    `badge ${getStatusClass(
                                                                                        booking.status
                                                                                    )}`
                                                                                }
                                                                            >

                                                                                {
                                                                                    getStatusText(
                                                                                        booking.status
                                                                                    )
                                                                                }

                                                                            </span>

                                                                        </div>


                                                                        <hr />


                                                                        {/* ==================================================
                                                                            INFO
                                                                        ================================================== */}

                                                                        <div className="row">

                                                                            {/* DATE */}

                                                                            <div className="col-md-6 mb-3">

                                                                                <small className="text-muted d-block">

                                                                                    Ngày đặt

                                                                                </small>


                                                                                <strong>

                                                                                    <i className="bi bi-calendar3 me-2 text-success"></i>

                                                                                    {
                                                                                        formatDate(
                                                                                            booking.bookingDate
                                                                                        )
                                                                                    }

                                                                                </strong>

                                                                            </div>


                                                                            {/* TIME */}

                                                                            <div className="col-md-6 mb-3">

                                                                                <small className="text-muted d-block">

                                                                                    Thời gian

                                                                                </small>


                                                                                <strong>

                                                                                    <i className="bi bi-clock me-2 text-success"></i>

                                                                                    {
                                                                                        booking.startTime
                                                                                    }

                                                                                    {" - "}

                                                                                    {
                                                                                        booking.endTime
                                                                                    }

                                                                                </strong>

                                                                            </div>


                                                                            {/* PRICE */}

                                                                            <div className="col-md-6 mb-3">

                                                                                <small className="text-muted d-block">

                                                                                    Tổng tiền

                                                                                </small>


                                                                                <strong className="text-success">

                                                                                    {
                                                                                        formatCurrency(
                                                                                            booking.totalPrice ||
                                                                                            0
                                                                                        )
                                                                                    }

                                                                                </strong>

                                                                            </div>


                                                                            {/* BOOKING ID */}

                                                                            <div className="col-md-6 mb-3">

                                                                                <small className="text-muted d-block">

                                                                                    Mã booking

                                                                                </small>


                                                                                <strong>

                                                                                    #

                                                                                    {
                                                                                        booking._id
                                                                                            ?.slice(
                                                                                                -8
                                                                                            )
                                                                                            ?.toUpperCase()
                                                                                    }

                                                                                </strong>

                                                                            </div>

                                                                        </div>


                                                                        {/* ==================================================
                                                                            NOTE
                                                                        ================================================== */}

                                                                        {
                                                                            booking.note && (

                                                                                <div className="alert alert-light mb-3">

                                                                                    <strong>
                                                                                        Ghi chú:
                                                                                    </strong>{" "}

                                                                                    {
                                                                                        booking.note
                                                                                    }

                                                                                </div>
                                                                            )
                                                                        }


                                                                        {/* ==================================================
                                                                            ACTIONS
                                                                        ================================================== */}

                                                                        <div className="d-flex gap-2">

                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-outline-success"
                                                                                onClick={() =>
                                                                                    navigate(
                                                                                        `/booking/${booking._id}`
                                                                                    )
                                                                                }
                                                                            >

                                                                                <i className="bi bi-eye me-2"></i>

                                                                                Chi tiết

                                                                            </button>


                                                                            {
                                                                                (
                                                                                    booking.status ===
                                                                                        "pending" ||
                                                                                    booking.status ===
                                                                                        "confirmed"
                                                                                ) && (

                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-outline-danger"
                                                                                        onClick={() =>
                                                                                            handleCancelBooking(
                                                                                                booking
                                                                                            )
                                                                                        }
                                                                                    >

                                                                                        <i className="bi bi-x-circle me-2"></i>

                                                                                        Hủy booking

                                                                                    </button>
                                                                                )
                                                                            }

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>
                                                        );
                                                    }
                                                )
                                            }

                                        </div>

                                    </div>
                                )
                            )
                        }

                    </div>
                )
            }

        </div>
    );
}


export default BookingHistory;