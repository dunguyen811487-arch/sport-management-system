import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Badge,
} from "react-bootstrap";

import apiClient
    from "../../api/apiClient";

import paymentService
    from "../../services/paymentService";

import useAuth
    from "../../hooks/useAuth";

import formatCurrency
    from "../../utils/formatCurrency";

import "../../assets/styles/booking-detail.css";


function BookingDetail() {

    const navigate =
        useNavigate();


    const {
        id,
    } = useParams();


    const {
        user,
    } = useAuth();


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        booking,
        setBooking,
    ] = useState(null);


    const [
        payment,
        setPayment,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const [
        cancelling,
        setCancelling,
    ] = useState(false);


    // ==========================================================
    // LOAD BOOKING DETAIL
    // GET /api/bookings/:id
    // ==========================================================

    const loadBookingDetail =
        async () => {

            if (!id) {

                setError(
                    "Không xác định được ID booking."
                );

                setLoading(false);

                return;
            }


            try {

                setLoading(true);
                setError("");


                // ==================================================
                // BOOKING
                // ==================================================

                const bookingResponse =
                    await apiClient(
                        `/bookings/${id}`,
                        {
                            method:
                                "GET",
                        }
                    );


                console.log(
                    "BOOKING DETAIL RESPONSE:",
                    bookingResponse
                );


                const bookingData =
                    bookingResponse?.data ||
                    bookingResponse;


                if (!bookingData) {

                    throw new Error(
                        "Không tìm thấy thông tin booking."
                    );
                }


                setBooking(
                    bookingData
                );


                // ==================================================
                // PAYMENT
                // ==================================================
                //
                // Payment có thể chưa tồn tại.
                // Ví dụ VNPay: booking vừa tạo nhưng
                // user chưa gửi ảnh xác nhận.
                //
                // Vì vậy lỗi payment không được làm
                // lỗi toàn bộ trang chi tiết booking.
                //
                // ==================================================

                try {

                    const paymentResponse =
                        await paymentService.getMy();


                    const payments =
                        Array.isArray(
                            paymentResponse?.data
                        )
                            ? paymentResponse.data
                            : [];


                    const matchedPayment =
                        payments.find(
                            (item) => {

                                const paymentBooking =
                                    item?.bookingId;


                                const paymentBookingId =
                                    typeof paymentBooking ===
                                        "object"
                                        ? paymentBooking?._id
                                        : paymentBooking;


                                return (
                                    paymentBookingId &&
                                    String(
                                        paymentBookingId
                                    ) ===
                                    String(
                                        bookingData._id
                                    )
                                );
                            }
                        );


                    setPayment(
                        matchedPayment ||
                        null
                    );


                    console.log(
                        "MATCHED PAYMENT:",
                        matchedPayment
                    );

                } catch (
                    paymentError
                ) {

                    console.warn(
                        "Không tải được payment của booking:",
                        paymentError
                    );


                    setPayment(
                        null
                    );
                }

            } catch (err) {

                console.error(
                    "Load booking detail error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tải chi tiết booking."
                );

            } finally {

                setLoading(false);
            }
        };


    // ==========================================================
    // LOAD WHEN OPEN
    // ==========================================================

    useEffect(() => {

        loadBookingDetail();

    }, [id]);


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
    // STATUS BADGE
    // ==========================================================

    const renderStatus =
        () => {

            const status =
                String(
                    booking?.status ||
                    ""
                ).toLowerCase();


            switch (status) {

                case "pending":

                    return (
                        <Badge
                            bg="warning"
                            text="dark"
                        >
                            Chờ xác nhận
                        </Badge>
                    );


                case "confirmed":

                    return (
                        <Badge
                            bg="success"
                        >
                            Đã xác nhận
                        </Badge>
                    );


                case "cancelled":

                    return (
                        <Badge
                            bg="danger"
                        >
                            Đã hủy
                        </Badge>
                    );


                default:

                    return (
                        <Badge
                            bg="secondary"
                        >
                            Không xác định
                        </Badge>
                    );
            }
        };


    // ==========================================================
    // DATE
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
    // DATETIME
    // ==========================================================

    const formatDateTime =
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


            return date.toLocaleString(
                "vi-VN"
            );
        };


    // ==========================================================
    // BOOKING CODE
    // ==========================================================

    const getBookingCode =
        () => {

            if (
                booking?.bookingCode
            ) {

                return booking.bookingCode;
            }


            if (
                booking?._id
            ) {

                return (
                    `BK${String(
                        booking._id
                    )
                        .slice(
                            -6
                        )
                        .toUpperCase()}`
                );
            }


            return "-";
        };


    // ==========================================================
    // FIELD
    // ==========================================================

    const field =
        booking?.fieldId &&
        typeof booking.fieldId ===
            "object"
            ? booking.fieldId
            : null;


    // ==========================================================
    // CUSTOMER
    // ==========================================================

    const customer =
        booking?.customerId &&
        typeof booking.customerId ===
            "object"
            ? booking.customerId
            : null;


    // ==========================================================
    // CUSTOMER NAME
    // ==========================================================

    const customerName =
        customer?.fullName ||
        customer?.name ||
        user?.fullName ||
        user?.name ||
        "Khách hàng";


    // ==========================================================
    // CUSTOMER PHONE
    // ==========================================================

    const customerPhone =
        customer?.phone ||
        user?.phone ||
        "---";


    // ==========================================================
    // CUSTOMER EMAIL
    // ==========================================================

    const customerEmail =
        customer?.email ||
        user?.email ||
        "---";


    // ==========================================================
    // PAYMENT METHOD
    // ==========================================================

    const getPaymentMethod =
        () => {

            if (!payment) {

                return "Chưa có giao dịch";
            }


            switch (
                String(
                    payment?.paymentMethod ||
                    ""
                ).toLowerCase()
            ) {

                case "cash":

                    return "Tiền mặt";


                case "bank_transfer":

                    return "Chuyển khoản";


                case "vnpay":

                    return "VNPay";


                default:

                    return (
                        payment?.paymentMethod ||
                        "Không xác định"
                    );
            }
        };


    // ==========================================================
    // PAYMENT STATUS
    // ==========================================================

    const getPaymentStatus =
        () => {

            if (!payment) {

                return "Chưa có giao dịch";
            }


            switch (
                String(
                    payment?.status ||
                    ""
                ).toLowerCase()
            ) {

                case "pending":

                    return "Chờ xác nhận";


                case "paid":

                    return "Đã thanh toán";


                case "failed":

                    return "Thanh toán thất bại";


                case "refunded":

                    return "Đã hoàn tiền";


                default:

                    return (
                        payment?.status ||
                        "Không xác định"
                    );
            }
        };


    // ==========================================================
    // PAYMENT STATUS BADGE
    // ==========================================================

    const renderPaymentStatus =
        () => {

            if (!payment) {

                return (
                    <Badge
                        bg="secondary"
                    >
                        Chưa có giao dịch
                    </Badge>
                );
            }


            switch (
                String(
                    payment?.status ||
                    ""
                ).toLowerCase()
            ) {

                case "pending":

                    return (
                        <Badge
                            bg="warning"
                            text="dark"
                        >
                            Chờ xác nhận
                        </Badge>
                    );


                case "paid":

                    return (
                        <Badge
                            bg="success"
                        >
                            Đã thanh toán
                        </Badge>
                    );


                case "failed":

                    return (
                        <Badge
                            bg="danger"
                        >
                            Thất bại
                        </Badge>
                    );


                case "refunded":

                    return (
                        <Badge
                            bg="info"
                        >
                            Đã hoàn tiền
                        </Badge>
                    );


                default:

                    return (
                        <Badge
                            bg="secondary"
                        >
                            {
                                getPaymentStatus()
                            }
                        </Badge>
                    );
            }
        };


    // ==========================================================
    // PROGRESS STATUS
    // ==========================================================

    const bookingStatus =
        String(
            booking?.status ||
            ""
        ).toLowerCase();


    const isPending =
        bookingStatus ===
        "pending";


    const isConfirmed =
        bookingStatus ===
        "confirmed";


    const isCancelled =
        bookingStatus ===
        "cancelled";


    // ==========================================================
    // CANCEL BOOKING
    // ==========================================================

    const handleCancel =
        async () => {

            if (
                !booking?._id ||
                cancelling
            ) {

                return;
            }


            const confirmed =
                window.confirm(
                    "Bạn có chắc muốn hủy đặt sân này không?"
                );


            if (!confirmed) {

                return;
            }


            try {

                setCancelling(
                    true
                );


                setError("");


                await apiClient(
                    `/bookings/${booking._id}/cancel`,
                    {
                        method:
                            "PUT",
                    }
                );


                alert(
                    "Hủy booking thành công."
                );


                await loadBookingDetail();

            } catch (err) {

                console.error(
                    "Cancel booking error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể hủy booking."
                );

            } finally {

                setCancelling(
                    false
                );
            }
        };


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-success"
                    role="status"
                />

                <p className="mt-3">
                    Đang tải chi tiết đơn đặt sân...
                </p>

            </div>
        );
    }


    // ==========================================================
    // ERROR
    // ==========================================================

    if (
        error &&
        !booking
    ) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    {error}

                </div>


                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() =>
                        navigate(
                            "/booking-history"
                        )
                    }
                >

                    ← Quay lại lịch sử đặt sân

                </button>

            </div>
        );
    }


    // ==========================================================
    // NO BOOKING
    // ==========================================================

    if (!booking) {

        return (

            <div className="container py-5 text-center">

                <h3>
                    Không tìm thấy đơn đặt sân
                </h3>


                <button
                    type="button"
                    className="btn btn-success mt-3"
                    onClick={() =>
                        navigate(
                            "/booking-history"
                        )
                    }
                >

                    Quay lại

                </button>

            </div>
        );
    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div className="container py-4">

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="alert alert-danger">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    {error}

                </div>
            )}


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="fw-bold text-success mb-0">

                    Chi tiết đặt sân

                </h2>


                {renderStatus()}

            </div>


            {/* ==================================================
                PROGRESS
            ================================================== */}

            <div className="booking-progress mb-5">

                <div className="step active">

                    ✓

                    <span>
                        Đặt lịch
                    </span>

                </div>


                <div className="line active"></div>


                <div className="step active">

                    ✓

                    <span>
                        Thanh toán
                    </span>

                </div>


                <div
                    className={
                        `line ${
                            isConfirmed
                                ? "active"
                                : ""
                        }`
                    }
                ></div>


                <div
                    className={
                        `step ${
                            isConfirmed ||
                            isCancelled
                                ? "active"
                                : ""
                        }`
                    }
                >

                    {
                        isConfirmed
                            ? "✓"
                            : isCancelled
                                ? "✕"
                                : "⏳"
                    }


                    <span>

                        {
                            isConfirmed
                                ? "Đã xác nhận"
                                : isCancelled
                                    ? "Đã hủy"
                                    : "Chờ xác nhận"
                        }

                    </span>

                </div>

            </div>


            {/* ==================================================
                FIELD
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-4">

                            {
                                field?.image ? (

                                    <img
                                        src={
                                            field.image
                                        }
                                        alt={
                                            field?.fieldName ||
                                            "Sân thể thao"
                                        }
                                        className="detail-image"
                                        onError={(
                                            e
                                        ) => {

                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                ) : (

                                    <div
                                        className="bg-light rounded d-flex align-items-center justify-content-center"
                                        style={{
                                            height:
                                                "250px",
                                        }}
                                    >

                                        <i
                                            className="bi bi-image text-muted"
                                            style={{
                                                fontSize:
                                                    "55px",
                                            }}
                                        />

                                    </div>
                                )
                            }

                        </div>


                        <div className="col-md-8">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <h3 className="fw-bold">

                                        {
                                            field?.fieldName ||
                                            "Sân không xác định"
                                        }

                                    </h3>


                                    <p className="text-muted mt-3">

                                        <i className="bi bi-geo-alt-fill me-2"></i>

                                        {
                                            field?.location ||
                                            "Chưa cập nhật"
                                        }

                                    </p>

                                </div>


                                {renderStatus()}

                            </div>


                            <h2 className="text-success fw-bold mt-4">

                                {
                                    formatCurrency(
                                        booking.totalPrice ||
                                        0
                                    )
                                }

                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                BOOKING INFO
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-3">

                        📅 Thông tin đặt sân

                    </h4>


                    <table className="table">

                        <tbody>

                            <tr>

                                <th width="220">
                                    Mã đặt sân
                                </th>

                                <td>

                                    {
                                        getBookingCode()
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Ngày đặt
                                </th>

                                <td>

                                    {
                                        formatDate(
                                            booking.bookingDate
                                        )
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Khung giờ
                                </th>

                                <td>

                                    {
                                        booking.startTime ||
                                        "-"
                                    }

                                    {" - "}

                                    {
                                        booking.endTime ||
                                        "-"
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Tổng tiền
                                </th>

                                <td className="fw-bold text-success">

                                    {
                                        formatCurrency(
                                            booking.totalPrice ||
                                            0
                                        )
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Trạng thái
                                </th>

                                <td>

                                    {
                                        renderStatus()
                                    }

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                CUSTOMER
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-3">

                        👤 Người đặt

                    </h4>


                    <table className="table">

                        <tbody>

                            <tr>

                                <th width="220">
                                    Họ và tên
                                </th>

                                <td>

                                    {
                                        customerName
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Số điện thoại
                                </th>

                                <td>

                                    {
                                        customerPhone
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Email
                                </th>

                                <td>

                                    {
                                        customerEmail
                                    }

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                PAYMENT
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-3">

                        💳 Thanh toán

                    </h4>


                    <table className="table">

                        <tbody>

                            <tr>

                                <th width="220">
                                    Phương thức
                                </th>

                                <td>

                                    {
                                        getPaymentMethod()
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Trạng thái
                                </th>

                                <td>

                                    {
                                        renderPaymentStatus()
                                    }

                                </td>

                            </tr>


                            {
                                payment?.transactionId && (

                                    <tr>

                                        <th>
                                            Mã giao dịch
                                        </th>

                                        <td>
                                            <strong>
                                                {
                                                    payment.transactionId
                                                }
                                            </strong>
                                        </td>

                                    </tr>
                                )
                            }


                            {
                                payment?.paymentProof && (

                                    <tr>

                                        <th>
                                            Ảnh xác nhận
                                        </th>

                                        <td>

                                            <a
                                                href={
                                                    payment.paymentProof
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Xem ảnh xác nhận
                                            </a>

                                        </td>

                                    </tr>
                                )
                            }


                            {
                                payment?.createdAt && (

                                    <tr>

                                        <th>
                                            Thời gian tạo thanh toán
                                        </th>

                                        <td>
                                            {
                                                formatDateTime(
                                                    payment.createdAt
                                                )
                                            }
                                        </td>

                                    </tr>
                                )
                            }

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                NOTE
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-3">

                        📝 Ghi chú

                    </h4>


                    <p className="text-muted mb-0">

                        {
                            booking.note ||
                            "Không có ghi chú."
                        }

                    </p>

                </div>

            </div>


            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="d-flex justify-content-between">

                <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() =>
                        navigate(
                            "/booking-history"
                        )
                    }
                >

                    ← Quay lại

                </button>


                {
                    (
                        isPending ||
                        isConfirmed
                    ) &&
                    !isCancelled && (

                        <button
                            type="button"
                            className="btn btn-danger btn-lg"
                            onClick={
                                handleCancel
                            }
                            disabled={
                                cancelling
                            }
                        >

                            {
                                cancelling ? (

                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                        />

                                        Đang hủy...

                                    </>

                                ) : (

                                    <>
                                        <i className="bi bi-x-circle me-2"></i>

                                        Hủy booking
                                    </>
                                )
                            }

                        </button>
                    )
                }

            </div>

        </div>
    );
}


export default BookingDetail;