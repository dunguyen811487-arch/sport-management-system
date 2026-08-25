import {
    useEffect,
    useMemo,
    useState,
} from "react";

import bookingService
    from "../../services/bookingService";


function BookingManagement() {

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
    // STATE
    // ==========================================================

    const [
        selectedDate,
        setSelectedDate,
    ] = useState(
        getToday()
    );


    const [
        bookings,
        setBookings,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    // ==========================================================
    // LOAD BOOKINGS
    // ==========================================================

    useEffect(() => {

        loadBookings();

    }, []);


    const loadBookings = async () => {

        try {

            setLoading(true);


            const response =
                await bookingService.getAll();


            console.log(
                "ADMIN BOOKINGS RESPONSE:",
                response
            );


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


            setBookings(
                data
            );

        } catch (error) {

            console.error(
                "Lỗi tải danh sách đặt sân:",
                error
            );


            setBookings([]);


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Không thể tải danh sách đặt sân."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // SAME DATE
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
    // SELECTED BOOKINGS
    // ==========================================================

    const selectedBookings =
        useMemo(() => {

            return bookings
                .filter(
                    booking =>
                        isSameDate(
                            booking?.bookingDate,
                            selectedDate
                        )
                )
                .sort(
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

        }, [
            bookings,
            selectedDate,
        ]);


    // ==========================================================
    // STATUS
    // ==========================================================

    const getBookingStatus = (
        status
    ) => {

        switch (
            String(
                status ||
                ""
            ).toLowerCase()
        ) {

            case "pending":

                return {
                    text:
                        "Chờ duyệt",

                    className:
                        "bg-warning text-dark",
                };


            case "confirmed":

                return {
                    text:
                        "Đã xác nhận",

                    className:
                        "bg-success",
                };


            case "cancelled":

                return {
                    text:
                        "Đã hủy",

                    className:
                        "bg-danger",
                };


            default:

                return {
                    text:
                        status ||
                        "Không xác định",

                    className:
                        "bg-secondary",
                };
        }
    };


    // ==========================================================
    // CUSTOMER
    // ==========================================================

    const getCustomerName = (
        booking
    ) => {

        if (
            booking?.customerId &&
            typeof booking.customerId ===
                "object"
        ) {

            return (
                booking.customerId.fullName ||
                booking.customerId.name ||
                booking.customerId.phone ||
                "-"
            );
        }


        return (
            booking?.fullName ||
            booking?.customerName ||
            "-"
        );
    };


    const getCustomerPhone = (
        booking
    ) => {

        if (
            booking?.customerId &&
            typeof booking.customerId ===
                "object"
        ) {

            return (
                booking.customerId.phone ||
                "-"
            );
        }


        return (
            booking?.phone ||
            "-"
        );
    };


    // ==========================================================
    // FIELD
    // ==========================================================

    const getFieldName = (
        booking
    ) => {

        if (
            booking?.fieldId &&
            typeof booking.fieldId ===
                "object"
        ) {

            return (
                booking.fieldId.fieldName ||
                booking.fieldId.name ||
                "-"
            );
        }


        return (
            booking?.fieldName ||
            "-"
        );
    };


    // ==========================================================
    // FORMAT MONEY
    // ==========================================================

    const formatMoney =
        value =>
            Number(
                value || 0
            ).toLocaleString(
                "vi-VN"
            ) + " đ";


    // ==========================================================
    // FORMAT DATE
    // ==========================================================

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


    // ==========================================================
    // SELECTED DATE TEXT
    // ==========================================================

    const selectedDateText =
        formatDate(
            `${selectedDate}T00:00:00`
        );


    // ==========================================================
    // STATISTICS
    // ==========================================================

    const totalBookings =
        selectedBookings.length;


    const pendingBookings =
        selectedBookings.filter(
            booking =>
                booking?.status ===
                "pending"
        ).length;


    const confirmedBookings =
        selectedBookings.filter(
            booking =>
                booking?.status ===
                "confirmed"
        ).length;


    const cancelledBookings =
        selectedBookings.filter(
            booking =>
                booking?.status ===
                "cancelled"
        ).length;


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div>

            {/* ==================================================
                HEADER + DATE
            ================================================== */}

            <div className="d-flex justify-content-between align-items-end mb-4">

                <div>

                    <h1 className="mb-1">
                        Quản lý đặt sân
                    </h1>

                    <p className="text-muted mb-0">
                        Quản lý các lượt đặt sân theo ngày
                    </p>

                </div>


                <div>

                    <label className="form-label mb-1">
                        Ngày đặt sân
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
                                loadBookings
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

            <div className="alert alert-light border">

                <i className="bi bi-calendar3 me-2"></i>

                Đặt sân ngày{" "}

                <strong>
                    {selectedDateText}
                </strong>

            </div>


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="row g-4 mb-4">

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Tổng lượt đặt
                            </h6>

                            <h2 className="mb-0">
                                {
                                    totalBookings
                                }
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Chờ duyệt
                            </h6>

                            <h2 className="text-warning mb-0">
                                {
                                    pendingBookings
                                }
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Đã xác nhận
                            </h6>

                            <h2 className="text-success mb-0">
                                {
                                    confirmedBookings
                                }
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Đã hủy
                            </h6>

                            <h2 className="text-danger mb-0">
                                {
                                    cancelledBookings
                                }
                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                TABLE
            ================================================== */}

            <div className="card shadow-sm border-0">

                <div className="card-header bg-white">

                    <h5 className="mb-0">
                        Danh sách đặt sân ngày{" "}
                        {selectedDateText}
                    </h5>

                </div>


                <div className="card-body p-0">

                    {
                        loading ? (

                            <div className="text-center py-5">

                                <div className="spinner-border text-primary" />

                                <p className="text-muted mt-3">
                                    Đang tải dữ liệu đặt sân...
                                </p>

                            </div>

                        ) : selectedBookings.length ===
                            0 ? (

                            <div className="text-center py-5">

                                <i
                                    className="bi bi-calendar-x fs-1 text-muted"
                                ></i>

                                <h5 className="mt-3">
                                    Không có booking
                                </h5>

                                <p className="text-muted mb-0">

                                    Không có lượt đặt sân nào
                                    trong ngày này.

                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th>
                                                #
                                            </th>

                                            <th>
                                                Khách hàng
                                            </th>

                                            <th>
                                                Số điện thoại
                                            </th>

                                            <th>
                                                Sân
                                            </th>

                                            <th>
                                                Ngày đặt
                                            </th>

                                            <th>
                                                Thời gian
                                            </th>

                                            <th>
                                                Tổng tiền
                                            </th>

                                            <th>
                                                Trạng thái
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            selectedBookings.map(
                                                (
                                                    booking,
                                                    index
                                                ) => {

                                                    const status =
                                                        getBookingStatus(
                                                            booking?.status
                                                        );


                                                    return (

                                                        <tr
                                                            key={
                                                                booking?._id ||
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
                                                                        getCustomerName(
                                                                            booking
                                                                        )
                                                                    }
                                                                </strong>

                                                            </td>


                                                            <td>

                                                                {
                                                                    getCustomerPhone(
                                                                        booking
                                                                    )
                                                                }

                                                            </td>


                                                            <td>

                                                                <strong>
                                                                    {
                                                                        getFieldName(
                                                                            booking
                                                                        )
                                                                    }
                                                                </strong>

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
                                                                            booking?.totalPrice
                                                                        )
                                                                    }

                                                                </strong>

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


export default BookingManagement;