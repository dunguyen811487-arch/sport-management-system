import {
    useEffect,
    useMemo,
    useState,
} from "react";

import paymentService
    from "../../services/paymentService";


function PaymentManagement() {

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


    const [
        payments,
        setPayments,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    useEffect(() => {

        loadPayments();

    }, []);


    const loadPayments = async () => {

        try {

            setLoading(true);


            const response =
                await paymentService.getAll();


            const data =
                Array.isArray(
                    response?.data
                )
                    ? response.data
                    : Array.isArray(
                        response
                    )
                        ? response
                        : [];


            setPayments(
                data
            );

        } catch (error) {

            console.error(
                "Lỗi tải thanh toán Staff:",
                error
            );


            setPayments([]);


            alert(
                error?.message ||
                "Không thể tải danh sách thanh toán."
            );

        } finally {

            setLoading(false);
        }
    };


    const getPaymentDate = (
        payment
    ) => {

        return (
            payment?.paidAt ||
            payment?.createdAt ||
            payment?.updatedAt ||
            null
        );
    };


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


    const selectedPayments =
        useMemo(() => {

            return payments
                .filter(
                    payment =>
                        isSameDate(
                            getPaymentDate(
                                payment
                            ),
                            selectedDate
                        )
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            getPaymentDate(
                                b
                            )
                        ).getTime() -
                        new Date(
                            getPaymentDate(
                                a
                            )
                        ).getTime()
                );

        }, [
            payments,
            selectedDate,
        ]);


    // ==========================================================
    // APPROVE
    // ==========================================================

    const handleApprovePayment =
        async (
            payment
        ) => {

            const paymentId =
                payment?._id ||
                payment?.id;


            if (!paymentId) {

                alert(
                    "Không xác định được ID payment."
                );

                return;
            }


            const confirmed =
                window.confirm(
                    "Bạn có chắc chắn xác nhận khoản thanh toán này đã được thanh toán?"
                );


            if (!confirmed) {
                return;
            }


            try {

                setLoading(true);


                await paymentService.update(
                    paymentId,
                    {
                        status:
                            "paid",
                    }
                );


                await loadPayments();


                alert(
                    "Đã xác nhận thanh toán!"
                );

            } catch (error) {

                console.error(
                    "Lỗi xác nhận thanh toán Staff:",
                    error
                );


                alert(
                    error?.message ||
                    "Không thể xác nhận thanh toán."
                );

            } finally {

                setLoading(false);
            }
        };


    // ==========================================================
    // STATUS
    // ==========================================================

    const getPaymentStatus = (
        status
    ) => {

        switch (
            String(
                status ||
                ""
            ).toLowerCase()
        ) {

            case "paid":

                return {
                    text:
                        "Đã thanh toán",
                    className:
                        "bg-success",
                };


            case "pending":

                return {
                    text:
                        "Chờ xác nhận",
                    className:
                        "bg-warning text-dark",
                };


            case "failed":

                return {
                    text:
                        "Thanh toán thất bại",
                    className:
                        "bg-danger",
                };


            case "cancelled":

                return {
                    text:
                        "Đã hủy",
                    className:
                        "bg-danger",
                };


            case "refunded":

                return {
                    text:
                        "Đã hoàn tiền",
                    className:
                        "bg-secondary",
                };


            default:

                return {
                    text:
                        status ||
                        "Chưa xác định",
                    className:
                        "bg-secondary",
                };
        }
    };


    const getCustomerName = (
        payment
    ) => {

        return (
            payment?.bookingId?.customerId?.fullName ||
            payment?.bookingId?.customerId?.name ||
            payment?.bookingId?.customerId?.phone ||
            "-"
        );
    };


    const getFieldName = (
        payment
    ) => {

        return (
            payment?.bookingId?.fieldId?.fieldName ||
            payment?.bookingId?.fieldId?.name ||
            "-"
        );
    };


    const getBookingCode = (
        payment
    ) => {

        const booking =
            payment?.bookingId;


        if (!booking) {
            return "-";
        }


        return (
            booking.bookingCode ||
            `BK${String(
                booking._id ||
                ""
            )
                .slice(-6)
                .toUpperCase()}`
        );
    };


    const getPaymentMethod = (
        method
    ) => {

        switch (
            method
        ) {

            case "cash":

                return "Tiền mặt";


            case "bank_transfer":

                return "Chuyển khoản / VNPay";


            default:

                return (
                    method ||
                    "Không xác định"
                );
        }
    };


    const getPaymentProofUrl = (
        value
    ) => {

        if (!value) {
            return "";
        }


        if (
            value.startsWith(
                "http://"
            ) ||
            value.startsWith(
                "https://"
            )
        ) {

            return value;
        }


        return (
            `http://localhost:5000${value}`
        );
    };


    const formatDate = (
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


    const formatDateTime = (
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


    const totalTransactions =
        selectedPayments.length;


    const pendingCount =
        selectedPayments.filter(
            payment =>
                payment?.status ===
                "pending"
        ).length;


    const paidCount =
        selectedPayments.filter(
            payment =>
                payment?.status ===
                "paid"
        ).length;


    const totalRevenue =
        selectedPayments
            .filter(
                payment =>
                    payment?.status ===
                    "paid"
            )
            .reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment?.amount ||
                        0
                    ),
                0
            );


    const formatMoney =
        value =>
            Number(
                value || 0
            ).toLocaleString(
                "vi-VN"
            ) + " đ";


    return (

        <div>

            <div className="d-flex justify-content-between align-items-end mb-4">

                <div>

                    <h1 className="mb-1">
                        Quản lý thanh toán
                    </h1>

                    <p className="text-muted mb-0">
                        Xem và xác nhận thanh toán theo ngày
                    </p>

                </div>


                <div>

                    <label className="form-label mb-1">
                        Ngày thanh toán
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
                                loadPayments
                            }
                        >

                            <i className="bi bi-arrow-clockwise"></i>

                        </button>

                    </div>

                </div>

            </div>


            <div className="alert alert-light border">

                <i className="bi bi-calendar3 me-2"></i>

                Thanh toán ngày{" "}

                <strong>
                    {
                        formatDate(
                            `${selectedDate}T00:00:00`
                        )
                    }
                </strong>

            </div>


            <div className="row mb-4">

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Tổng giao dịch
                            </h6>

                            <h2>
                                {
                                    totalTransactions
                                }
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Chờ xác nhận
                            </h6>

                            <h2 className="text-warning">
                                {
                                    pendingCount
                                }
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Đã thanh toán
                            </h6>

                            <h2 className="text-success">
                                {
                                    paidCount
                                }
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Doanh thu ngày
                            </h6>

                            <h4 className="text-success">
                                {
                                    formatMoney(
                                        totalRevenue
                                    )
                                }
                            </h4>

                            <small className="text-muted">
                                Chỉ payment đã thanh toán
                            </small>

                        </div>

                    </div>

                </div>

            </div>


            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white">

                    <h5 className="mb-0">
                        Thanh toán ngày đã chọn
                    </h5>

                </div>


                <div className="card-body p-0">

                    {
                        loading ? (

                            <div className="text-center py-5">

                                <div className="spinner-border text-primary" />

                                <p className="text-muted mt-3">
                                    Đang tải dữ liệu...
                                </p>

                            </div>

                        ) : selectedPayments.length ===
                            0 ? (

                            <div className="text-center py-5">

                                <i className="bi bi-calendar-x fs-1 text-muted"></i>

                                <h5 className="mt-3">
                                    Không có giao dịch
                                </h5>

                                <p className="text-muted mb-0">
                                    Không có payment nào trong ngày này.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th>#</th>
                                            <th>Booking</th>
                                            <th>Khách hàng</th>
                                            <th>Sân</th>
                                            <th>Ngày đặt sân</th>
                                            <th>Khung giờ</th>
                                            <th>Số tiền</th>
                                            <th>Phương thức</th>
                                            <th>Chứng từ</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày thanh toán</th>
                                            <th className="text-center">
                                                Thao tác
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            selectedPayments.map(
                                                (
                                                    payment,
                                                    index
                                                ) => {

                                                    const booking =
                                                        payment?.bookingId;


                                                    const status =
                                                        getPaymentStatus(
                                                            payment?.status
                                                        );


                                                    const proofUrl =
                                                        getPaymentProofUrl(
                                                            payment?.paymentProof
                                                        );


                                                    return (

                                                        <tr
                                                            key={
                                                                payment?._id ||
                                                                payment?.id ||
                                                                index
                                                            }
                                                        >

                                                            <td>
                                                                {
                                                                    index + 1
                                                                }
                                                            </td>


                                                            <td>
                                                                <strong>
                                                                    {
                                                                        getBookingCode(
                                                                            payment
                                                                        )
                                                                    }
                                                                </strong>
                                                            </td>


                                                            <td>
                                                                {
                                                                    getCustomerName(
                                                                        payment
                                                                    )
                                                                }
                                                            </td>


                                                            <td>
                                                                {
                                                                    getFieldName(
                                                                        payment
                                                                    )
                                                                }
                                                            </td>


                                                            <td>
                                                                {
                                                                    formatDate(
                                                                        booking?.bookingDate
                                                                    )
                                                                }
                                                            </td>


                                                            <td>

                                                                {
                                                                    booking?.startTime ||
                                                                    "-"
                                                                }

                                                                {" - "}

                                                                {
                                                                    booking?.endTime ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            <td>

                                                                <strong className="text-success">

                                                                    {
                                                                        formatMoney(
                                                                            payment?.amount
                                                                        )
                                                                    }

                                                                </strong>

                                                            </td>


                                                            <td>
                                                                {
                                                                    getPaymentMethod(
                                                                        payment?.paymentMethod
                                                                    )
                                                                }
                                                            </td>


                                                            <td>

                                                                {
                                                                    proofUrl ? (

                                                                        <a
                                                                            href={
                                                                                proofUrl
                                                                            }
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="btn btn-sm btn-outline-primary"
                                                                        >

                                                                            <i className="bi bi-image me-1"></i>

                                                                            Xem ảnh

                                                                        </a>

                                                                    ) : (

                                                                        <span className="text-muted">
                                                                            Không có
                                                                        </span>
                                                                    )
                                                                }

                                                            </td>


                                                            <td>

                                                                <span
                                                                    className={
                                                                        `badge ${status.className}`
                                                                    }
                                                                >

                                                                    {
                                                                        status.text
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>
                                                                {
                                                                    formatDateTime(
                                                                        getPaymentDate(
                                                                            payment
                                                                        )
                                                                    )
                                                                }
                                                            </td>


                                                            <td className="text-center">

                                                                {
                                                                    payment?.status ===
                                                                    "pending" ? (

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-success"
                                                                            onClick={() =>
                                                                                handleApprovePayment(
                                                                                    payment
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                loading
                                                                            }
                                                                        >

                                                                            <i className="bi bi-check-lg me-1"></i>

                                                                            Xác nhận

                                                                        </button>

                                                                    ) : (

                                                                        <span className="text-muted">
                                                                            Đã xử lý
                                                                        </span>
                                                                    )
                                                                }

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


export default PaymentManagement;