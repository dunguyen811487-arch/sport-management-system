import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import formatCurrency
    from "../../utils/formatCurrency";

import paymentService
    from "../../services/paymentService";

import apiClient
    from "../../api/apiClient";

import "../../assets/styles/payment.css";


function Payment() {

    const navigate =
        useNavigate();

    const {
        state
    } = useLocation();


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        timeLeft,
        setTimeLeft
    ] = useState(
        15 * 60
    );


    const [
        paymentProof,
        setPaymentProof
    ] = useState(null);


    const [
        previewUrl,
        setPreviewUrl
    ] = useState("");


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    // ==========================================================
    // REF
    // ==========================================================

    const paymentSubmittedRef =
        useRef(false);


    const cancelInProgressRef =
        useRef(false);


    const cleanupGenerationRef =
        useRef(0);


    // ==========================================================
    // STATE KHÔNG TỒN TẠI
    // ==========================================================

    useEffect(() => {

        if (!state) {

            navigate(
                "/fields",
                {
                    replace: true
                }
            );
        }

    }, [
        state,
        navigate
    ]);


    if (!state) {

        return (

            <div className="container py-5">

                <div className="alert alert-warning">
                    Đang chuyển hướng...
                </div>

            </div>
        );
    }


    // ==========================================================
    // DATA
    // ==========================================================

    const {
        field,
        bookingDate,
        selectedSlots,
        totalHours,
        totalPrice,
        paymentMethod,
        note,
        bookingCode,
        bookingId
    } = state;


    // ==========================================================
    // CANCEL PENDING BOOKING
    // ==========================================================

    const cancelPendingBooking =
        async () => {

            if (!bookingId) {
                return;
            }


            if (
                paymentSubmittedRef.current
            ) {
                return;
            }


            if (
                cancelInProgressRef.current
            ) {
                return;
            }


            cancelInProgressRef.current =
                true;


            try {

                console.log(
                    "HỦY BOOKING PAYMENT CHƯA HOÀN TẤT:",
                    bookingId
                );


                await apiClient(
                    `/bookings/${bookingId}/cancel`,
                    {
                        method:
                            "PUT"
                    }
                );


                console.log(
                    "Đã hủy booking pending."
                );

            } catch (cancelError) {

                console.error(
                    "Không thể hủy booking pending:",
                    cancelError
                );

            } finally {

                cancelInProgressRef.current =
                    false;
            }
        };


    // ==========================================================
    // RỜI TRANG PAYMENT
    // ==========================================================
    //
    // Dùng generation để tránh React StrictMode
    // hủy booking ngay khi mount trong môi trường dev.
    //
    // Khi thực sự unmount:
    // → nếu chưa gửi payment
    // → sau một khoảng ngắn sẽ hủy booking.
    //
    // ==========================================================

    useEffect(() => {

        cleanupGenerationRef.current += 1;


        const currentGeneration =
            cleanupGenerationRef.current;


        return () => {

            const cleanupTimer =
                setTimeout(
                    () => {

                        const stillSameGeneration =
                            cleanupGenerationRef.current ===
                            currentGeneration;


                        if (
                            stillSameGeneration &&
                            !paymentSubmittedRef.current
                        ) {

                            cancelPendingBooking();
                        }

                    },
                    300
                );


            // Không clear timer ở đây.
            // Timer cần chạy sau khi component thực sự
            // unmount để gửi request hủy booking.
            void cleanupTimer;
        };

    }, [
        bookingId
    ]);


    // ==========================================================
    // COUNTDOWN
    // ==========================================================

    useEffect(() => {

        if (
            timeLeft <= 0
        ) {

            const expireBooking =
                async () => {

                    await cancelPendingBooking();


                    alert(
                        "Phiên thanh toán đã hết hạn."
                    );


                    navigate(
                        "/booking-history",
                        {
                            replace:
                                true
                        }
                    );
                };


            expireBooking();

            return;
        }


        const timer =
            setInterval(
                () => {

                    setTimeLeft(
                        prev =>
                            prev - 1
                    );

                },
                1000
            );


        return () =>
            clearInterval(
                timer
            );

    }, [
        timeLeft,
        navigate,
        bookingId
    ]);


    // ==========================================================
    // TIME
    // ==========================================================

    const minutes =
        String(
            Math.floor(
                timeLeft / 60
            )
        ).padStart(
            2,
            "0"
        );


    const seconds =
        String(
            timeLeft % 60
        ).padStart(
            2,
            "0"
        );


    // ==========================================================
    // BOOKING TIME
    // ==========================================================

    const bookingTime =
        () => {

            if (
                !Array.isArray(
                    selectedSlots
                ) ||
                selectedSlots.length === 0
            ) {

                return "Chưa xác định";
            }


            const sorted =
                [
                    ...selectedSlots
                ].sort();


            const first =
                sorted[0];


            const lastHour =
                parseInt(
                    sorted[
                        sorted.length - 1
                    ].split(":")[0],
                    10
                ) + 1;


            return (
                `${first} - ` +
                `${String(
                    lastHour
                ).padStart(
                    2,
                    "0"
                )}:00`
            );
        };


    // ==========================================================
    // IMAGE CHANGE
    // ==========================================================

    const handleProofChange =
        (event) => {

            const file =
                event.target
                    .files?.[0] ||
                null;


            setError("");


            if (!file) {

                setPaymentProof(
                    null
                );

                setPreviewUrl(
                    ""
                );

                return;
            }


            // --------------------------------------------------
            // IMAGE ONLY
            // --------------------------------------------------

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                setError(
                    "Vui lòng chọn file hình ảnh."
                );

                setPaymentProof(
                    null
                );

                setPreviewUrl(
                    ""
                );

                return;
            }


            // --------------------------------------------------
            // MAX 5MB
            // --------------------------------------------------

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                setError(
                    "Ảnh xác nhận không được lớn hơn 5MB."
                );

                setPaymentProof(
                    null
                );

                setPreviewUrl(
                    ""
                );

                return;
            }


            setPaymentProof(
                file
            );


            setPreviewUrl(
                URL.createObjectURL(
                    file
                )
            );
        };


    // ==========================================================
    // SUBMIT PAYMENT
    // ==========================================================

    const handleSuccess =
        async () => {

            setError("");


            if (!bookingId) {

                setError(
                    "Không tìm thấy ID booking."
                );

                return;
            }


            if (
                !paymentProof
            ) {

                setError(
                    "Vui lòng tải ảnh xác nhận chuyển khoản."
                );

                return;
            }


            if (
                submitting
            ) {

                return;
            }


            try {

                setSubmitting(
                    true
                );


                // ==================================================
                // FORMDATA
                // ==================================================

                const formData =
                    new FormData();


                formData.append(
                    "bookingId",
                    bookingId
                );


                formData.append(
                    "paymentMethod",
                    "bank_transfer"
                );


                formData.append(
                    "paymentProof",
                    paymentProof
                );


                console.log(
                    "ĐANG TẠO PAYMENT:",
                    {
                        bookingId,
                        paymentMethod:
                            "bank_transfer",

                        paymentProof:
                            paymentProof.name
                    }
                );


                // ==================================================
                // CREATE PAYMENT
                // ==================================================

                const response =
                    await paymentService.create(
                        formData
                    );


                console.log(
                    "CREATE PAYMENT RESPONSE:",
                    response
                );


                if (
                    !response?.success
                ) {

                    throw new Error(
                        response?.message ||
                        "Không thể tạo payment."
                    );
                }


                const savedPayment =
                    response.data;


                // ==================================================
                // ĐÃ GỬI PAYMENT THÀNH CÔNG
                //
                // Đặt true TRƯỚC navigate để cleanup
                // không hủy booking.
                // ==================================================

                paymentSubmittedRef.current =
                    true;


                // ==================================================
                // BOOKING SUCCESS
                // ==================================================

                navigate(
                    "/booking-success",
                    {
                        state: {

                            booking: {

                                ...state,

                                paymentId:
                                    savedPayment?._id ||
                                    null,

                                paymentStatus:
                                    savedPayment?.status ||
                                    "pending",

                                paymentProof:
                                    savedPayment?.paymentProof ||
                                    "",

                                status:
                                    "pending"
                            }
                        }
                    }
                );

            } catch (err) {

                console.error(
                    "Create payment error:",
                    err
                );


                setError(
                    err?.message ||
                    "Không thể tạo payment."
                );

            } finally {

                setSubmitting(
                    false
                );
            }
        };


    // ==========================================================
    // CANCEL BUTTON
    // ==========================================================

    const handleCancelPayment =
        async () => {

            if (
                submitting
            ) {
                return;
            }


            await cancelPendingBooking();


            navigate(
                -1
            );
        };


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div className="container py-5">

            <h2 className="fw-bold text-success mb-4">
                Thanh toán
            </h2>


            {error && (

                <div className="alert alert-danger">

                    <i className="bi bi-exclamation-circle-fill me-2"></i>

                    {error}

                </div>
            )}


            <div className="row g-4">

                {/* ==================================================
                    LEFT
                ================================================== */}

                <div className="col-lg-7">

                    {/* ==================================================
                        BOOKING INFO
                    ================================================== */}

                    <div className="card shadow-sm border-0 mb-4">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                🏟️ Thông tin đơn đặt sân
                            </h4>


                            <div className="row">

                                <div className="col-md-4">

                                    {field?.image ? (

                                        <img
                                            src={
                                                field.image
                                            }
                                            alt={
                                                field?.fieldName ||
                                                "Sân thể thao"
                                            }
                                            className="img-fluid rounded"
                                            style={{
                                                height:
                                                    "180px",
                                                width:
                                                    "100%",
                                                objectFit:
                                                    "cover"
                                            }}
                                        />

                                    ) : (

                                        <div
                                            className="bg-light rounded d-flex align-items-center justify-content-center"
                                            style={{
                                                height:
                                                    "180px"
                                            }}
                                        >

                                            <i
                                                className="bi bi-image text-muted"
                                                style={{
                                                    fontSize:
                                                        "50px"
                                                }}
                                            />

                                        </div>
                                    )}

                                </div>


                                <div className="col-md-8">

                                    <h3 className="fw-bold">
                                        {
                                            field?.fieldName ||
                                            "-"
                                        }
                                    </h3>


                                    <p>

                                        <i className="bi bi-geo-alt-fill me-2"></i>

                                        {
                                            field?.location ||
                                            "-"
                                        }

                                    </p>


                                    <p>

                                        <i className="bi bi-calendar-event me-2"></i>

                                        {
                                            bookingDate ||
                                            "-"
                                        }

                                    </p>


                                    <p>

                                        <i className="bi bi-clock-fill me-2"></i>

                                        {
                                            bookingTime()
                                        }

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        PAYMENT DETAIL
                    ================================================== */}

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                📄 Chi tiết thanh toán
                            </h4>


                            <table className="table">

                                <tbody>

                                    <tr>

                                        <th width="220">
                                            Mã đặt sân
                                        </th>

                                        <td>

                                            <strong>

                                                {
                                                    bookingCode ||
                                                    `BK${String(
                                                        bookingId
                                                    )
                                                        .slice(
                                                            -6
                                                        )
                                                        .toUpperCase()}`
                                                }

                                            </strong>

                                        </td>

                                    </tr>


                                    <tr>

                                        <th>
                                            Đơn giá
                                        </th>

                                        <td>

                                            {
                                                formatCurrency(
                                                    field?.pricePerHour ||
                                                    0
                                                )
                                            }

                                        </td>

                                    </tr>


                                    <tr>

                                        <th>
                                            Số giờ thuê
                                        </th>

                                        <td>
                                            {
                                                totalHours ||
                                                0
                                            }{" "}
                                            giờ
                                        </td>

                                    </tr>


                                    <tr>

                                        <th>
                                            Phương thức
                                        </th>

                                        <td>
                                            Chuyển khoản / VNPay
                                        </td>

                                    </tr>


                                    <tr>

                                        <th>
                                            Ghi chú
                                        </th>

                                        <td>

                                            {
                                                note ||
                                                "Không có"
                                            }

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    RIGHT
                ================================================== */}

                <div className="col-lg-5">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h4 className="fw-bold mb-3 text-center">
                                💳 Chuyển khoản
                            </h4>


                            <h2 className="text-success fw-bold mb-4 text-center">

                                {
                                    formatCurrency(
                                        totalPrice ||
                                        0
                                    )
                                }

                            </h2>


                            {/* ==================================================
                                COUNTDOWN
                            ================================================== */}

                            <div className="alert alert-warning text-center">

                                ⏳ Thời gian còn lại

                                <h3 className="mt-2 mb-0">
                                    {minutes}:{seconds}
                                </h3>

                            </div>


                            {/* ==================================================
                                QR
                            ================================================== */}

                            <div className="border rounded p-4 bg-light mb-4 text-center">

                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SPORT-MANAGEMENT-DEMO"
                                    alt="QR Payment"
                                    className="img-fluid"
                                    style={{
                                        maxWidth:
                                            "250px"
                                    }}
                                />

                            </div>


                            {/* ==================================================
                                BANK INFO
                            ================================================== */}

                            <div className="text-start border rounded p-3 mb-4">

                                <div className="d-flex justify-content-between">

                                    <span>
                                        Ngân hàng
                                    </span>

                                    <strong>
                                        MB Bank
                                    </strong>

                                </div>


                                <hr />


                                <div className="d-flex justify-content-between">

                                    <span>
                                        Số tài khoản
                                    </span>

                                    <strong>
                                        0123456789
                                    </strong>

                                </div>


                                <hr />


                                <div className="d-flex justify-content-between">

                                    <span>
                                        Chủ tài khoản
                                    </span>

                                    <strong>
                                        SPORT MANAGEMENT
                                    </strong>

                                </div>


                                <hr />


                                <div className="d-flex justify-content-between">

                                    <span>
                                        Nội dung CK
                                    </span>

                                    <strong>
                                        {
                                            bookingCode ||
                                            "SPORT-MANAGEMENT"
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* ==================================================
                                PAYMENT PROOF
                            ================================================== */}

                            <div className="mb-4">

                                <label
                                    htmlFor="paymentProof"
                                    className="form-label fw-semibold"
                                >

                                    Ảnh xác nhận chuyển khoản

                                </label>


                                <input
                                    id="paymentProof"
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={
                                        handleProofChange
                                    }
                                    disabled={
                                        submitting
                                    }
                                />


                                <small className="text-muted d-block mt-2">

                                    Chỉ nhận ảnh, tối đa 5MB.

                                </small>


                                {previewUrl && (

                                    <div className="mt-3">

                                        <p className="mb-2 fw-semibold">
                                            Xem trước:
                                        </p>


                                        <img
                                            src={
                                                previewUrl
                                            }
                                            alt="Xác nhận chuyển khoản"
                                            className="img-fluid rounded border"
                                            style={{
                                                maxHeight:
                                                    "300px"
                                            }}
                                        />

                                    </div>
                                )}

                            </div>


                            {/* ==================================================
                                BUTTON
                            ================================================== */}

                            <div className="d-grid gap-3">

                                <button
                                    type="button"
                                    className="btn btn-success btn-lg"
                                    onClick={
                                        handleSuccess
                                    }
                                    disabled={
                                        submitting ||
                                        timeLeft <= 0
                                    }
                                >

                                    {submitting ? (

                                        <>

                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            />

                                            Đang gửi...

                                        </>

                                    ) : (

                                        <>

                                            <i className="bi bi-cloud-upload-fill me-2"></i>

                                            Gửi xác nhận thanh toán

                                        </>
                                    )}

                                </button>


                                <small className="text-muted text-center">

                                    Admin/nhân viên sẽ kiểm tra ảnh
                                    trước khi xác nhận thanh toán.

                                </small>


                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={
                                        handleCancelPayment
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    Hủy thanh toán

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Payment;