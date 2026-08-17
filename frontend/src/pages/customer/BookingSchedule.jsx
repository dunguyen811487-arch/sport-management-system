import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    getBookedSlotsApi,
} from "../../api/bookingApi";

import formatCurrency
    from "../../utils/formatCurrency";

import "../../assets/styles/booking-schedule.css";


function BookingSchedule() {

    const navigate =
        useNavigate();


    const location =
        useLocation();


    // ==========================================================
    // FIELD
    // ==========================================================

    const field =
        location?.state?.field;


    // ==========================================================
    // DATE
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


        return (
            `${year}-${month}-${day}`
        );
    };


    const [
        bookingDate,
        setBookingDate,
    ] = useState(
        getToday()
    );


    // ==========================================================
    // TIME SLOTS
    // ==========================================================

    const timeSlots = useMemo(() => {

        const slots = [];


        for (
            let hour = 6;
            hour <= 21;
            hour++
        ) {

            slots.push(
                `${String(
                    hour
                ).padStart(
                    2,
                    "0"
                )}:00`
            );
        }


        return slots;

    }, []);


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        selectedSlots,
        setSelectedSlots,
    ] = useState([]);


    const [
        bookedSlots,
        setBookedSlots,
    ] = useState([]);


    const [
        loadingAvailability,
        setLoadingAvailability,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        bookingLoading,
        setBookingLoading,
    ] = useState(false);


    // ==========================================================
    // FIELD SAFETY
    // ==========================================================

    useEffect(() => {

        if (!field?._id) {

            navigate(
                "/fields",
                {
                    replace: true,
                }
            );
        }

    }, [
        field,
        navigate,
    ]);


    // ==========================================================
    // RESET SELECTED SLOT
    // khi đổi ngày
    // ==========================================================

    useEffect(() => {

        setSelectedSlots([]);

    }, [
        bookingDate,
    ]);


    // ==========================================================
    // LOAD BOOKED SLOTS
    // ==========================================================

    useEffect(() => {

        if (
            !field?._id ||
            !bookingDate
        ) {

            setBookedSlots([]);

            return;
        }


        let mounted = true;


        const loadBookedSlots =
            async () => {

                try {

                    setLoadingAvailability(
                        true
                    );

                    setError("");


                    const response =
                        await getBookedSlotsApi(
                            field._id,
                            bookingDate
                        );


                    if (
                        !mounted
                    ) {

                        return;
                    }


                    const bookings =
                        Array.isArray(
                            response?.data
                        )
                            ? response.data
                            : [];


                    const slots = [];


                    // ==================================================
                    // TÁCH TỪNG KHUNG GIỜ ĐÃ BỊ CHIẾM
                    // ==================================================

                    bookings.forEach(
                        booking => {

                            if (
                                String(
                                    booking?.status ||
                                    ""
                                ).toLowerCase() ===
                                "cancelled"
                            ) {

                                return;
                            }


                            const startTime =
                                booking?.startTime;


                            const endTime =
                                booking?.endTime;


                            if (
                                !startTime ||
                                !endTime
                            ) {

                                return;
                            }


                            const startHour =
                                Number(
                                    startTime
                                        .split(":")[0]
                                );


                            const endHour =
                                Number(
                                    endTime
                                        .split(":")[0]
                                );


                            if (
                                Number.isNaN(
                                    startHour
                                ) ||
                                Number.isNaN(
                                    endHour
                                )
                            ) {

                                return;
                            }


                            for (
                                let hour =
                                    startHour;
                                hour <
                                    endHour;
                                hour++
                            ) {

                                slots.push(
                                    `${String(
                                        hour
                                    ).padStart(
                                        2,
                                        "0"
                                    )}:00`
                                );
                            }

                        }
                    );


                    setBookedSlots(
                        [
                            ...new Set(
                                slots
                            ),
                        ]
                    );

                } catch (err) {

                    console.error(
                        "Load booked slots error:",
                        err
                    );


                    if (
                        mounted
                    ) {

                        setBookedSlots([]);

                        setError(
                            err?.data?.message ||
                            err?.message ||
                            "Không thể kiểm tra khung giờ đã đặt."
                        );
                    }

                } finally {

                    if (
                        mounted
                    ) {

                        setLoadingAvailability(
                            false
                        );
                    }
                }
            };


        loadBookedSlots();


        return () => {

            mounted = false;

        };

    }, [
        field?._id,
        bookingDate,
    ]);


    // ==========================================================
    // CHECK SLOT BOOKED
    // ==========================================================

    const isSlotBooked =
        (
            slot
        ) => {

            return bookedSlots.includes(
                slot
            );
        };


    // ==========================================================
    // CHECK SLOT SELECTED
    // ==========================================================

    const isSlotSelected =
        (
            slot
        ) => {

            return selectedSlots.includes(
                slot
            );
        };


    // ==========================================================
    // SLOT NUMBER
    // ==========================================================

    const getHourFromSlot =
        (
            slot
        ) => {

            return Number(
                slot.split(":")[0]
            );
        };


    // ==========================================================
    // CHECK CONSECUTIVE
    // ==========================================================

    const areSlotsConsecutive =
        (
            slots
        ) => {

            if (
                slots.length <= 1
            ) {

                return true;
            }


            const sorted =
                [...slots].sort(
                    (
                        a,
                        b
                    ) =>
                        getHourFromSlot(a) -
                        getHourFromSlot(b)
                );


            for (
                let i = 1;
                i < sorted.length;
                i++
            ) {

                const previous =
                    getHourFromSlot(
                        sorted[i - 1]
                    );


                const current =
                    getHourFromSlot(
                        sorted[i]
                    );


                if (
                    current -
                    previous !==
                    1
                ) {

                    return false;
                }
            }


            return true;
        };


    // ==========================================================
    // HANDLE SLOT CLICK
    // ==========================================================

    const handleSlotClick =
        (
            slot
        ) => {

            if (
                isSlotBooked(slot)
            ) {

                return;
            }


            // --------------------------------------------------
            // BỎ CHỌN
            // --------------------------------------------------

            if (
                isSlotSelected(slot)
            ) {

                setSelectedSlots(
                    previous =>
                        previous.filter(
                            item =>
                                item !==
                                slot
                        )
                );

                return;
            }


            // --------------------------------------------------
            // THÊM SLOT
            // --------------------------------------------------

            const nextSlots = [
                ...selectedSlots,
                slot,
            ].sort(
                (
                    a,
                    b
                ) =>
                    getHourFromSlot(a) -
                    getHourFromSlot(b)
            );


            // --------------------------------------------------
            // KHÔNG CHO CHỌN RỜI RẠC
            // --------------------------------------------------

            if (
                !areSlotsConsecutive(
                    nextSlots
                )
            ) {

                alert(
                    "Bạn chỉ có thể chọn các khung giờ liên tiếp."
                );

                return;
            }


            setSelectedSlots(
                nextSlots
            );
        };


    // ==========================================================
    // START TIME
    // ==========================================================

    const startTime =
        selectedSlots.length > 0
            ? [...selectedSlots].sort(
                (
                    a,
                    b
                ) =>
                    getHourFromSlot(a) -
                    getHourFromSlot(b)
            )[0]
            : "";


    // ==========================================================
    // END TIME
    // ==========================================================

    const endTime =
        selectedSlots.length > 0
            ? (() => {

                const sorted =
                    [...selectedSlots].sort(
                        (
                            a,
                            b
                        ) =>
                            getHourFromSlot(a) -
                            getHourFromSlot(b)
                    );


                const last =
                    getHourFromSlot(
                        sorted[
                            sorted.length - 1
                        ]
                    );


                return (
                    `${String(
                        last + 1
                    ).padStart(
                        2,
                        "0"
                    )}:00`
                );

            })()
            : "";


    // ==========================================================
    // TOTAL HOURS
    // ==========================================================

    const totalHours =
        selectedSlots.length;


    // ==========================================================
    // TOTAL PRICE
    // ==========================================================

    const totalPrice =
        totalHours *
        Number(
            field?.pricePerHour ||
            0
        );


    // ==========================================================
    // BOOKING CONFIRM
    // ==========================================================

    const handleContinue =
        () => {

            if (
                !field?._id
            ) {

                alert(
                    "Không xác định được sân."
                );

                return;
            }


            if (
                !bookingDate
            ) {

                alert(
                    "Vui lòng chọn ngày đặt sân."
                );

                return;
            }


            if (
                selectedSlots.length ===
                0
            ) {

                alert(
                    "Vui lòng chọn ít nhất một khung giờ."
                );

                return;
            }


            if (
                selectedSlots.some(
                    slot =>
                        isSlotBooked(
                            slot
                        )
                )
            ) {

                alert(
                    "Một trong các khung giờ bạn chọn vừa được người khác đặt."
                );

                return;
            }


            if (
                !areSlotsConsecutive(
                    selectedSlots
                )
            ) {

                alert(
                    "Các khung giờ phải liên tiếp."
                );

                return;
            }


            setBookingLoading(
                true
            );


            navigate(
                "/booking-confirm",
                {
                    state: {

                        field,

                        bookingDate,

                        startTime,

                        endTime,

                        selectedSlots,

                        totalHours,

                        totalPrice,

                    },
                }
            );


            setBookingLoading(
                false
            );
        };


    // ==========================================================
    // FORMAT DATE
    // ==========================================================

    const formatSelectedDate =
        (
            value
        ) => {

            if (!value) {
                return "-";
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
    // FIELD IMAGE
    // ==========================================================

    const fieldImage =
        (() => {

            if (
                !field?.image
            ) {

                return "";
            }


            if (
                field.image.startsWith(
                    "http://"
                ) ||
                field.image.startsWith(
                    "https://"
                )
            ) {

                return field.image;
            }


            return (
                `http://localhost:5000${field.image}`
            );

        })();


    // ==========================================================
    // FIELD SAFETY
    // ==========================================================

    if (!field) {

        return null;
    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div className="container-fluid py-4">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Đặt sân
                    </h2>


                    <p className="text-muted mb-0">
                        Chọn ngày và khung giờ bạn muốn đặt
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate(
                            "/fields"
                        )
                    }
                >

                    <i className="bi bi-arrow-left me-2"></i>

                    Quay lại

                </button>

            </div>


            {/* ==================================================
                FIELD INFORMATION
            ================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="row align-items-center">

                        {/* IMAGE */}

                        <div className="col-md-3">

                            {
                                fieldImage ? (

                                    <img
                                        src={
                                            fieldImage
                                        }
                                        alt={
                                            field?.fieldName ||
                                            "Sân"
                                        }
                                        className="img-fluid rounded"
                                        style={{
                                            height:
                                                "180px",

                                            width:
                                                "100%",

                                            objectFit:
                                                "cover",
                                        }}
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
                                                "180px",
                                        }}
                                    >

                                        <i
                                            className="bi bi-building text-muted"
                                            style={{
                                                fontSize:
                                                    "60px",
                                            }}
                                        ></i>

                                    </div>
                                )
                            }

                        </div>


                        {/* INFO */}

                        <div className="col-md-9">

                            <h3 className="fw-bold">
                                {
                                    field?.fieldName ||
                                    "Sân thể thao"
                                }
                            </h3>


                            <p className="text-muted mb-2">

                                <i className="bi bi-geo-alt-fill me-2"></i>

                                {
                                    field?.location ||
                                    "Chưa cập nhật"
                                }

                            </p>


                            <p className="text-muted mb-2">

                                {
                                    field?.fieldTypeId?.name ||
                                    "Chưa phân loại"
                                }

                            </p>


                            <h4 className="text-success mb-0">

                                {
                                    formatCurrency(
                                        field?.pricePerHour ||
                                        0
                                    )
                                }

                                <small className="text-muted">
                                    {" "} / giờ
                                </small>

                            </h4>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                DATE
            ================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-3">

                        📅 Chọn ngày đặt sân

                    </h4>


                    <input
                        type="date"
                        className="form-control form-control-lg"
                        value={
                            bookingDate
                        }
                        min={
                            getToday()
                        }
                        onChange={
                            e =>
                                setBookingDate(
                                    e.target.value
                                )
                        }
                    />


                    <div className="text-muted mt-2">

                        Ngày đã chọn:

                        {" "}

                        <strong>
                            {
                                formatSelectedDate(
                                    bookingDate
                                )
                            }
                        </strong>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {
                error && (

                    <div className="alert alert-danger">

                        <i className="bi bi-exclamation-triangle-fill me-2"></i>

                        {error}

                    </div>
                )
            }


            {/* ==================================================
                TIME SLOTS
            ================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h4 className="fw-bold mb-0">

                            🕐 Chọn khung giờ

                        </h4>


                        {
                            loadingAvailability && (

                                <div className="d-flex align-items-center text-muted">

                                    <div
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    />

                                    Đang kiểm tra lịch sân...

                                </div>
                            )
                        }

                    </div>


                    <div className="row g-3">

                        {
                            timeSlots.map(
                                (
                                    time
                                ) => {

                                    const booked =
                                        isSlotBooked(
                                            time
                                        );


                                    const selected =
                                        isSlotSelected(
                                            time
                                        );


                                    return (

                                        <div
                                            className="col-6 col-md-4 col-lg-3"
                                            key={
                                                time
                                            }
                                        >

                                            <button
                                                type="button"

                                                className={
                                                    booked
                                                        ? "booking-time-slot booked"
                                                        : selected
                                                        ? "booking-time-slot selected"
                                                        : "booking-time-slot"
                                                }

                                                disabled={
                                                    booked ||
                                                    loadingAvailability
                                                }

                                                onClick={() =>
                                                    handleSlotClick(
                                                        time
                                                    )
                                                }
                                            >

                                                <span className="booking-time">

                                                    {
                                                        time
                                                    }

                                                </span>


                                                <span className="booking-time-status">

                                                    {
                                                        booked
                                                            ? "Đã đặt"
                                                            : selected
                                                            ? "Đang chọn"
                                                            : "Còn trống"
                                                    }

                                                </span>

                                            </button>

                                        </div>

                                    );
                                }
                            )
                        }

                    </div>


                    {/* ==================================================
                        LEGEND
                    ================================================== */}

                    <div className="d-flex flex-wrap gap-4 mt-4">

                        <div className="d-flex align-items-center">

                            <span
                                className="booking-legend-box available"
                            ></span>

                            <span>
                                Còn trống
                            </span>

                        </div>


                        <div className="d-flex align-items-center">

                            <span
                                className="booking-legend-box selected"
                            ></span>

                            <span>
                                Đang chọn
                            </span>

                        </div>


                        <div className="d-flex align-items-center">

                            <span
                                className="booking-legend-box booked"
                            ></span>

                            <span>
                                Đã có người đặt
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <h4 className="fw-bold mb-4">

                        📝 Thông tin đặt sân

                    </h4>


                    <div className="row">

                        <div className="col-md-4 mb-3">

                            <small className="text-muted d-block">
                                Ngày
                            </small>

                            <strong>
                                {
                                    formatSelectedDate(
                                        bookingDate
                                    )
                                }
                            </strong>

                        </div>


                        <div className="col-md-4 mb-3">

                            <small className="text-muted d-block">
                                Khung giờ
                            </small>

                            <strong>

                                {
                                    startTime ||
                                    "-"
                                }

                                {" - "}

                                {
                                    endTime ||
                                    "-"
                                }

                            </strong>

                        </div>


                        <div className="col-md-4 mb-3">

                            <small className="text-muted d-block">
                                Thời lượng
                            </small>

                            <strong>
                                {
                                    totalHours
                                }{" "}
                                giờ
                            </strong>

                        </div>


                        <div className="col-md-4">

                            <small className="text-muted d-block">
                                Đơn giá
                            </small>

                            <strong>

                                {
                                    formatCurrency(
                                        field?.pricePerHour ||
                                        0
                                    )
                                }

                                {" / giờ"}

                            </strong>

                        </div>


                        <div className="col-md-4">

                            <small className="text-muted d-block">
                                Tổng tiền
                            </small>

                            <h4 className="text-success mb-0">

                                {
                                    formatCurrency(
                                        totalPrice
                                    )
                                }

                            </h4>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                BUTTON
            ================================================== */}

            <div className="d-flex justify-content-end gap-2">

                <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() =>
                        navigate(
                            "/fields"
                        )
                    }
                >

                    Hủy

                </button>


                <button
                    type="button"
                    className="btn btn-success btn-lg"
                    disabled={
                        bookingLoading ||
                        loadingAvailability ||
                        selectedSlots.length ===
                            0 ||
                        selectedSlots.some(
                            slot =>
                                isSlotBooked(
                                    slot
                                )
                        )
                    }
                    onClick={
                        handleContinue
                    }
                >

                    {
                        bookingLoading ? (

                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                />

                                Đang xử lý...

                            </>

                        ) : (

                            <>
                                Tiếp tục

                                <i className="bi bi-arrow-right ms-2"></i>
                            </>
                        )
                    }

                </button>

            </div>

        </div>
    );
}


export default BookingSchedule;