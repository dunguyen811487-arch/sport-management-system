import { useState } from "react";

import {
    Modal,
    Button,
    Form,
} from "react-bootstrap";

import {
    useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import formatCurrency from "../../utils/formatCurrency";

import {
    createBookingApi,
} from "../../api/bookingApi";

import paymentService from "../../services/paymentService";


function PaymentModal({
    show,
    onClose,
    booking,
}) {

    const navigate =
        useNavigate();

    const {
        user,
    } = useAuth();


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        method,
        setMethod,
    ] = useState("cash");


    const [
        loading,
        setLoading,
    ] = useState(false);


    // ==========================================================
    // HANDLE CONTINUE
    // ==========================================================

    const handleContinue = async () => {

        // ======================================================
        // 1. KIỂM TRA BOOKING
        // ======================================================

        if (
            !booking ||
            !booking.field
        ) {

            alert(
                "Không tìm thấy thông tin đặt sân."
            );

            return;
        }


        // ======================================================
        // 2. KIỂM TRA KHUNG GIỜ
        // ======================================================

        if (
            !Array.isArray(
                booking.selectedSlots
            ) ||
            booking.selectedSlots.length === 0
        ) {

            alert(
                "Không tìm thấy khung giờ đặt sân."
            );

            return;
        }


        // ======================================================
        // 3. KIỂM TRA USER
        // ======================================================

        if (!user) {

            alert(
                "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại."
            );

            onClose();

            navigate(
                "/login"
            );

            return;
        }


        // ======================================================
        // 4. USER ID
        // ======================================================

        const userId =
            user?._id ||
            user?.id;


        if (!userId) {

            console.error(
                "USER KHÔNG CÓ ID:",
                user
            );

            alert(
                "Không xác định được tài khoản đang đăng nhập."
            );

            return;
        }


        // ======================================================
        // 5. MOMO CHƯA HỖ TRỢ
        // ======================================================

        if (
            method === "momo"
        ) {

            alert(
                "MoMo chưa được triển khai. Vui lòng chọn Tiền mặt hoặc VNPay."
            );

            return;
        }


        // ======================================================
        // 6. SORT SLOT
        // ======================================================

        const sortedSlots = [
            ...booking.selectedSlots,
        ].sort();


        const startTime =
            sortedSlots[0];


        // ======================================================
        // 7. END TIME
        // ======================================================

        const lastHour =
            parseInt(
                sortedSlots[
                    sortedSlots.length - 1
                ].split(":")[0],
                10
            ) + 1;


        const endTime =
            `${String(
                lastHour
            ).padStart(
                2,
                "0"
            )}:00`;


        // ======================================================
        // 8. VALIDATE TIME
        // ======================================================

        if (
            !startTime ||
            !endTime
        ) {

            alert(
                "Khung giờ đặt sân không hợp lệ."
            );

            return;
        }


        // ======================================================
        // 9. HIỂN THỊ PHƯƠNG THỨC
        // ======================================================

        const displayPaymentMethod =
            method === "cash"
                ? "Tiền mặt"
                : "VNPay";


        try {

            setLoading(
                true
            );


            // ==================================================
            // 10. CREATE BOOKING
            // ==================================================

            const bookingRequest = {

                fieldId:
                    booking.field._id,

                bookingDate:
                    booking.bookingDate,

                startTime,

                endTime,

                note:
                    booking.note ||
                    "",
            };


            console.log(
                "POST /api/bookings:",
                bookingRequest
            );


            const bookingResponse =
                await createBookingApi(
                    bookingRequest
                );


            console.log(
                "CREATE BOOKING RESPONSE:",
                bookingResponse
            );


            // ==================================================
            // 11. KIỂM TRA BOOKING
            // ==================================================

            if (
                !bookingResponse ||
                bookingResponse.success !== true ||
                !bookingResponse.data
            ) {

                throw new Error(
                    bookingResponse?.message ||
                    "Không thể tạo booking."
                );
            }


            // ==================================================
            // 12. BOOKING ĐÃ LƯU
            // ==================================================

            const savedBooking =
                bookingResponse.data;


            const bookingId =
                savedBooking?._id;


            if (!bookingId) {

                throw new Error(
                    "Backend không trả về ID booking."
                );
            }


            console.log(
                "BOOKING ĐÃ LƯU:",
                savedBooking
            );


            // ==================================================
            // 13. DỮ LIỆU DÙNG CHUNG
            // ==================================================

            const bookingData = {

                bookingId,

                bookingCode:
                    savedBooking.bookingCode ||
                    `BK${String(
                        bookingId
                    )
                        .slice(-6)
                        .toUpperCase()}`,

                customerId:
                    userId,

                field:
                    booking.field,

                fieldId:
                    savedBooking.fieldId,

                bookingDate:
                    savedBooking.bookingDate,

                startTime:
                    savedBooking.startTime,

                endTime:
                    savedBooking.endTime,

                selectedSlots:
                    booking.selectedSlots,

                totalHours:
                    booking.totalHours,

                totalPrice:
                    savedBooking.totalPrice,

                status:
                    savedBooking.status ||
                    "pending",

                note:
                    savedBooking.note ||
                    "",

                paymentMethod:
                    displayPaymentMethod,

                paymentStatus:
                    "pending",

                user: {

                    _id:
                        user?._id,

                    fullName:
                        user?.fullName,

                    phone:
                        user?.phone,

                    email:
                        user?.email,
                },
            };


            // ==================================================
            // 14. TIỀN MẶT
            // ==================================================

            if (
                method === "cash"
            ) {

                console.log(
                    "POST /api/payments CASH:",
                    {
                        bookingId,
                        paymentMethod:
                            "cash",
                    }
                );


                const paymentResponse =
                    await paymentService.create(
                        {
                            bookingId,

                            paymentMethod:
                                "cash",

                            transactionCode:
                                "",
                        }
                    );


                console.log(
                    "CREATE CASH PAYMENT RESPONSE:",
                    JSON.stringify(
                        paymentResponse,
                        null,
                        2
                    )
                );


                // ------------------------------------------------
                // PAYMENT THÀNH CÔNG
                // ------------------------------------------------

                if (
                    paymentResponse?.success ===
                    true
                ) {

                    const savedPayment =
                        paymentResponse.data;


                    console.log(
                        "PAYMENT ĐÃ LƯU:",
                        savedPayment
                    );


                    const successBooking = {

                        ...bookingData,

                        paymentId:
                            savedPayment?._id ||
                            null,

                        paymentStatus:
                            savedPayment?.status ||
                            "pending",

                        status:
                            savedBooking.status ||
                            "pending",
                    };


                    onClose();


                    navigate(
                        "/booking-success",
                        {
                            state: {
                                booking:
                                    successBooking,
                            },
                        }
                    );


                    return;
                }


                // ------------------------------------------------
                // PAYMENT THẤT BẠI
                // ------------------------------------------------

                throw new Error(
                    paymentResponse?.message ||
                    "Không thể tạo payment."
                );
            }


            // ==================================================
            // 15. VNPAY
            // ==================================================
            //
            // Booking đã được tạo.
            // Payment sẽ được tạo ở Payment.jsx
            // sau khi khách nhập transactionCode.
            // ==================================================

            if (
                method === "vnpay"
            ) {

                onClose();


                navigate(
                    "/payment",
                    {
                        state:
                            bookingData,
                    }
                );


                return;
            }

        } catch (error) {

            console.error(
                "Create booking/payment error:",
                error
            );


            alert(
                error?.response
                    ?.data
                    ?.message ||
                error?.message ||
                "Không thể hoàn tất đặt sân."
            );

        } finally {

            setLoading(
                false
            );
        }
    };


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <Modal
            show={show}
            onHide={() => {

                if (!loading) {
                    onClose();
                }

            }}
            centered
            size="lg"
            backdrop="static"
        >

            <Modal.Header
                closeButton={!loading}
            >

                <Modal.Title>
                    💳 Chọn phương thức thanh toán
                </Modal.Title>

            </Modal.Header>


            <Modal.Body>

                {/* ==================================================
                    TOTAL
                ================================================== */}

                <div className="alert alert-success">

                    <div className="d-flex justify-content-between">

                        <span>
                            Tổng thanh toán
                        </span>

                        <strong>

                            {
                                formatCurrency(
                                    booking?.totalPrice ||
                                    0
                                )
                            }

                        </strong>

                    </div>

                </div>


                <Form>

                    {/* ==================================================
                        CASH
                    ================================================== */}

                    <div className="payment-method mb-3">

                        <Form.Check

                            type="radio"

                            id="cash"

                            name="payment"

                            checked={
                                method === "cash"
                            }

                            disabled={
                                loading
                            }

                            onChange={() =>
                                setMethod(
                                    "cash"
                                )
                            }

                            label={

                                <div>

                                    <h6 className="mb-1">
                                        💵 Thanh toán tại quầy
                                    </h6>

                                    <small className="text-muted">

                                        Thanh toán trực tiếp khi đến sân.
                                        Nhân viên/Admin sẽ xác nhận thanh toán.

                                    </small>

                                </div>
                            }

                        />

                    </div>


                    {/* ==================================================
                        VNPAY
                    ================================================== */}

                    <div className="payment-method mb-3">

                        <Form.Check

                            type="radio"

                            id="vnpay"

                            name="payment"

                            checked={
                                method === "vnpay"
                            }

                            disabled={
                                loading
                            }

                            onChange={() =>
                                setMethod(
                                    "vnpay"
                                )
                            }

                            label={

                                <div>

                                    <h6 className="mb-1">
                                        💳 VNPay / Chuyển khoản
                                    </h6>

                                    <small className="text-muted">

                                        Sau khi chuyển khoản,
                                        bạn sẽ nhập mã giao dịch
                                        để gửi yêu cầu xác nhận.

                                    </small>

                                </div>
                            }

                        />

                    </div>


                    {/* ==================================================
                        MOMO
                    ================================================== */}

                    <div className="payment-method">

                        <Form.Check

                            type="radio"

                            id="momo"

                            name="payment"

                            checked={
                                method === "momo"
                            }

                            disabled={
                                loading
                            }

                            onChange={() =>
                                setMethod(
                                    "momo"
                                )
                            }

                            label={

                                <div className="d-flex justify-content-between align-items-center w-100">

                                    <div>

                                        <h6 className="mb-1">
                                            📱 MoMo
                                        </h6>

                                        <small className="text-muted">
                                            Chưa triển khai.
                                        </small>

                                    </div>

                                    <span className="badge bg-warning text-dark">
                                        Soon
                                    </span>

                                </div>
                            }

                        />

                    </div>

                </Form>

            </Modal.Body>


            <Modal.Footer>

                <Button
                    variant="secondary"
                    disabled={
                        loading
                    }
                    onClick={
                        onClose
                    }
                >
                    Hủy
                </Button>


                <Button
                    variant="success"
                    disabled={
                        loading
                    }
                    onClick={
                        handleContinue
                    }
                >

                    {loading ? (

                        <>
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                            />

                            Đang xử lý...
                        </>

                    ) : (

                        "Tiếp tục"
                    )}

                </Button>

            </Modal.Footer>

        </Modal>
    );
}


export default PaymentModal;