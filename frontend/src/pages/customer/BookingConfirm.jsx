import {
    useEffect,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import formatCurrency from "../../utils/formatCurrency";

import PaymentModal from "../../components/customer/PaymentModal";

import "../../assets/styles/booking-confirm.css";


function BookingConfirm() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const { user } = useAuth();


    // ==========================================================
    // STATE
    // ==========================================================

    const [note, setNote] =
        useState("");

    const [showPayment, setShowPayment] =
        useState(false);


    // ==========================================================
    // REDIRECT NẾU KHÔNG CÓ STATE
    // ==========================================================

    useEffect(() => {

        if (!state) {

            navigate(
                "/fields",
                {
                    replace: true,
                }
            );

        }

    }, [
        state,
        navigate,
    ]);


    // ==========================================================
    // KHÔNG CÓ STATE
    // ==========================================================

    if (!state) {
        return null;
    }


    // ==========================================================
    // LẤY DỮ LIỆU
    // ==========================================================

    const {
        field,
        bookingDate,
        selectedSlots,
        totalHours,
        totalPrice,
    } = state;


    // ==========================================================
    // KIỂM TRA DỮ LIỆU
    // ==========================================================

    if (
        !field ||
        !bookingDate ||
        !Array.isArray(selectedSlots)
    ) {

        return (
            <div className="container py-5">

                <div className="alert alert-danger">

                    Không tìm thấy đầy đủ thông tin
                    đặt sân.

                </div>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate(
                            "/fields",
                            {
                                replace: true,
                            }
                        )
                    }
                >
                    Quay lại danh sách sân
                </button>

            </div>
        );
    }


    // ==========================================================
    // HIỂN THỊ KHUNG GIỜ
    // ==========================================================

    const bookingTime = () => {

        if (
            selectedSlots.length === 0
        ) {
            return "Chưa chọn";
        }


        const sorted = [
            ...selectedSlots,
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


        const last =
            `${String(lastHour).padStart(
                2,
                "0"
            )}:00`;


        return `${first} - ${last}`;
    };


    // ==========================================================
    // MỞ PAYMENT MODAL
    // ==========================================================

    const openPayment = () => {

        if (!user) {

            alert(
                "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại."
            );

            navigate(
                "/login",
                {
                    replace: true,
                }
            );

            return;
        }


        if (
            selectedSlots.length === 0
        ) {

            alert(
                "Vui lòng chọn ít nhất 1 khung giờ."
            );

            return;
        }


        setShowPayment(true);
    };


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div className="container py-4">

            {/* ==================================================
                HEADER
            ================================================== */}

            <h2 className="fw-bold text-success mb-4">
                Xác nhận đặt sân
            </h2>


            {/* ==================================================
                THÔNG TIN SÂN
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-4">

                            {field.image ? (

                                <img
                                    src={field.image}
                                    alt={
                                        field.fieldName ||
                                        "Sân thể thao"
                                    }
                                    className="confirm-image"
                                />

                            ) : (

                                <div
                                    className="confirm-image bg-light d-flex align-items-center justify-content-center"
                                >

                                    <i
                                        className="bi bi-image text-muted"
                                        style={{
                                            fontSize:
                                                "50px",
                                        }}
                                    ></i>

                                </div>

                            )}

                        </div>


                        <div className="col-md-8">

                            <h3 className="fw-bold">

                                {
                                    field.fieldName ||
                                    "Sân thể thao"
                                }

                            </h3>


                            <span className="badge bg-success mb-3">

                                {
                                    field.fieldType?.name ||
                                    field.fieldType ||
                                    "Sân thể thao"
                                }

                            </span>


                            <p>

                                <i className="bi bi-grid-fill me-2"></i>

                                {
                                    field.subType ||
                                    "-"
                                }

                            </p>


                            <p>

                                <i className="bi bi-geo-alt-fill me-2"></i>

                                {
                                    field.location ||
                                    "-"
                                }

                            </p>


                            <h3 className="text-success fw-bold">

                                {
                                    formatCurrency(
                                        field.pricePerHour ||
                                        0
                                    )
                                }

                                <small className="text-muted">
                                    / giờ
                                </small>

                            </h3>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                THÔNG TIN LỊCH ĐẶT
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-3">
                        📅 Thông tin lịch đặt
                    </h4>


                    <table className="table align-middle">

                        <tbody>

                            <tr>

                                <th width="180">
                                    Ngày đặt
                                </th>

                                <td>
                                    {bookingDate}
                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Khung giờ
                                </th>

                                <td>
                                    {bookingTime()}
                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Số giờ
                                </th>

                                <td>
                                    {totalHours} giờ
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                NGƯỜI ĐẶT
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-3">
                        👤 Người đặt
                    </h4>


                    <table className="table align-middle">

                        <tbody>

                            <tr>

                                <th width="180">
                                    Họ và tên
                                </th>

                                <td>

                                    {
                                        user?.fullName ||
                                        user?.name ||
                                        "-"
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Số điện thoại
                                </th>

                                <td>

                                    {
                                        user?.phone ||
                                        "-"
                                    }

                                </td>

                            </tr>


                            <tr>

                                <th>
                                    Email
                                </th>

                                <td>

                                    {
                                        user?.email ||
                                        "-"
                                    }

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                GHI CHÚ
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-3">
                        📝 Ghi chú
                    </h4>


                    <textarea
                        rows="4"
                        className="form-control"
                        placeholder="Nhập ghi chú (nếu có)..."
                        value={note}
                        onChange={(e) =>
                            setNote(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>


            {/* ==================================================
                TỔNG THANH TOÁN
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-4">
                        💰 Tổng thanh toán
                    </h4>


                    <div className="row">

                        <div className="col-md-8">

                            <table className="table">

                                <tbody>

                                    <tr>

                                        <th width="220">
                                            Đơn giá
                                        </th>

                                        <td>

                                            {
                                                formatCurrency(
                                                    field.pricePerHour ||
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
                                            {totalHours} giờ
                                        </td>

                                    </tr>


                                    <tr>

                                        <th>
                                            Khung giờ
                                        </th>

                                        <td>
                                            {bookingTime()}
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>


                        <div className="col-md-4">

                            <div className="payment-summary">

                                <small className="text-muted">
                                    Thành tiền
                                </small>


                                <h2 className="text-success fw-bold mt-2">

                                    {
                                        formatCurrency(
                                            totalPrice ||
                                            0
                                        )
                                    }

                                </h2>


                                <span className="badge bg-warning text-dark mt-2">
                                    Chưa thanh toán
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                BUTTON
            ================================================== */}

            <div className="d-flex justify-content-between align-items-center">

                <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() =>
                        navigate(-1)
                    }
                >

                    <i className="bi bi-arrow-left me-2"></i>

                    Quay lại

                </button>


                <button
                    type="button"
                    className="btn btn-success btn-lg"
                    onClick={openPayment}
                >

                    <i className="bi bi-credit-card me-2"></i>

                    Thanh toán

                </button>

            </div>


            {/* ==================================================
                PAYMENT MODAL
            ================================================== */}

            <PaymentModal
                show={
                    showPayment
                }

                onClose={() =>
                    setShowPayment(
                        false
                    )
                }

                booking={{

                    field,

                    bookingDate,

                    selectedSlots,

                    totalHours,

                    totalPrice,

                    note,

                }}
            />

        </div>
    );
}


export default BookingConfirm;