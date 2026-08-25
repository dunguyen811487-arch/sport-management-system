import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import useAuth
    from "../../hooks/useAuth";

import FieldDetail
    from "./FieldDetail";

import {
    getFieldsApi,
} from "../../api/fieldApi";

import apiClient
    from "../../api/apiClient";

import formatCurrency
    from "../../utils/formatCurrency";

import "../../assets/styles/home.css";


function Home() {

    const navigate =
        useNavigate();


    const {
        isAuthenticated,
        user,
    } = useAuth();


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        fields,
        setFields,
    ] = useState([]);


    const [
        bookings,
        setBookings,
    ] = useState([]);


    const [
        selectedField,
        setSelectedField,
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
        searchText,
        setSearchText,
    ] = useState("");


    // ==========================================================
    // DATE KEY
    // ==========================================================

    const getDateKey = (
        value
    ) => {

        if (!value) {
            return "";
        }


        // Backend trả trực tiếp YYYY-MM-DD

        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(
                value
            )
        ) {

            return value;
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


        return `${year}-${month}-${day}`;
    };


    // ==========================================================
    // TODAY KEY
    // ==========================================================

    const getTodayKey = () => {

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
    // TOMORROW KEY
    // ==========================================================

    const getTomorrowKey = () => {

        const date =
            new Date();


        date.setHours(
            0,
            0,
            0,
            0
        );


        date.setDate(
            date.getDate() + 1
        );


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
    // LOAD DATA
    // ==========================================================

    useEffect(() => {

        let mounted = true;


        const loadData =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    // ==================================================
                    // FIELDS
                    // ==================================================

                    const fieldsRequest =
                        getFieldsApi();


                    // ==================================================
                    // BOOKINGS
                    // ==================================================

                    const bookingsRequest =
                        isAuthenticated
                            ? apiClient(
                                "/bookings/my",
                                {
                                    method:
                                        "GET",
                                }
                            )
                            : Promise.resolve(
                                null
                            );


                    const [
                        fieldsResponse,
                        bookingsResponse,
                    ] = await Promise.all([
                        fieldsRequest,
                        bookingsRequest,
                    ]);


                    if (!mounted) {
                        return;
                    }


                    // ==================================================
                    // FIELDS DATA
                    // ==================================================

                    const fieldData =
                        Array.isArray(
                            fieldsResponse
                        )
                            ? fieldsResponse
                            : Array.isArray(
                                fieldsResponse?.data
                            )
                                ? fieldsResponse.data
                                : [];


                    setFields(
                        fieldData
                    );


                    // ==================================================
                    // BOOKINGS DATA
                    // ==================================================

                    if (
                        isAuthenticated &&
                        bookingsResponse
                    ) {

                        const bookingData =
                            Array.isArray(
                                bookingsResponse?.data
                            )
                                ? bookingsResponse.data
                                : Array.isArray(
                                    bookingsResponse
                                )
                                    ? bookingsResponse
                                    : [];


                        setBookings(
                            bookingData
                        );

                    } else {

                        setBookings([]);

                    }

                } catch (err) {

                    console.error(
                        "Load home data error:",
                        err
                    );


                    if (!mounted) {
                        return;
                    }


                    setError(
                        err?.data?.message ||
                        err?.message ||
                        "Không thể tải dữ liệu trang chủ."
                    );


                    setFields([]);
                    setBookings([]);

                } finally {

                    if (mounted) {

                        setLoading(
                            false
                        );

                    }
                }
            };


        loadData();


        return () => {

            mounted = false;

        };

    }, [
        isAuthenticated,
    ]);


    // ==========================================================
    // TODAY DISPLAY
    // ==========================================================

    const today =
        new Date().toLocaleDateString(
            "vi-VN",
            {
                weekday:
                    "long",

                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric",
            }
        );


    // ==========================================================
    // DATE KEYS
    // ==========================================================

    const todayKey =
        getTodayKey();


    const tomorrowKey =
        getTomorrowKey();


    // ==========================================================
    // ACTIVE FIELDS
    // ==========================================================

    const activeFields =
        useMemo(() => {

            return fields.filter(
                field =>
                    field?.status ===
                    "active"
            );

        }, [
            fields,
        ]);


    // ==========================================================
    // SEARCH
    // ==========================================================

    const filteredFields =
        useMemo(() => {

            const keyword =
                searchText
                    .trim()
                    .toLowerCase();


            if (!keyword) {

                return activeFields;
            }


            return activeFields.filter(
                field => {

                    const name =
                        field?.fieldName
                            ?.toLowerCase() ||
                        "";


                    const location =
                        field?.location
                            ?.toLowerCase() ||
                        "";


                    const type =
                        field?.fieldTypeId?.name
                            ?.toLowerCase() ||
                        "";


                    const description =
                        field?.description
                            ?.toLowerCase() ||
                        "";


                    return (
                        name.includes(
                            keyword
                        ) ||
                        location.includes(
                            keyword
                        ) ||
                        type.includes(
                            keyword
                        ) ||
                        description.includes(
                            keyword
                        )
                    );
                }
            );

        }, [
            activeFields,
            searchText,
        ]);


    // ==========================================================
    // FEATURED FIELDS
    // ==========================================================

    const featuredFields =
        useMemo(() => {

            return [
                ...filteredFields,
            ]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        Number(
                            b?.rating ||
                            0
                        ) -
                        Number(
                            a?.rating ||
                            0
                        )
                )
                .slice(
                    0,
                    6
                );

        }, [
            filteredFields,
        ]);


    // ==========================================================
    // TOTAL ACTIVE FIELDS
    // ==========================================================

    const totalActiveFields =
        activeFields.length;


    // ==========================================================
    // BOOKINGS TODAY
    // ==========================================================

    const bookingsToday =
        useMemo(() => {

            if (
                !isAuthenticated
            ) {

                return 0;
            }


            return bookings.filter(
                booking => {

                    const status =
                        String(
                            booking?.status ||
                            ""
                        ).toLowerCase();


                    // Không tính booking đã hủy

                    if (
                        status ===
                        "cancelled"
                    ) {

                        return false;
                    }


                    const bookingDate =
                        getDateKey(
                            booking?.bookingDate
                        );


                    return (
                        bookingDate ===
                        todayKey
                    );
                }
            ).length;

        }, [
            bookings,
            isAuthenticated,
            todayKey,
        ]);


    // ==========================================================
    // UPCOMING BOOKINGS
    //
    // Chỉ tính từ ngày mai trở đi
    // Không tính cancelled
    // ==========================================================

    const upcomingBookings =
        useMemo(() => {

            if (
                !isAuthenticated
            ) {

                return 0;
            }


            return bookings.filter(
                booking => {

                    const status =
                        String(
                            booking?.status ||
                            ""
                        ).toLowerCase();


                    if (
                        status ===
                        "cancelled"
                    ) {

                        return false;
                    }


                    const bookingDate =
                        getDateKey(
                            booking?.bookingDate
                        );


                    if (
                        !bookingDate
                    ) {

                        return false;
                    }


                    return (
                        bookingDate >=
                        tomorrowKey
                    );
                }
            ).length;

        }, [
            bookings,
            isAuthenticated,
            tomorrowKey,
        ]);


    // ==========================================================
    // FIELD IMAGE
    // ==========================================================

    const getFieldImage =
        (
            field
        ) => {

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
        };


    // ==========================================================
    // BANNER FIELD
    // ==========================================================

    const bannerField =
        activeFields.find(
            field =>
                field?.image
        );


    const bannerImage =
        getFieldImage(
            bannerField
        );


    // ==========================================================
    // BOOKING
    // ==========================================================

    const handleBooking =
        (
            field
        ) => {

            if (
                !isAuthenticated
            ) {

                alert(
                    "Vui lòng đăng nhập để đặt sân!"
                );


                navigate(
                    "/login"
                );


                return;
            }


            navigate(
                "/booking",
                {
                    state: {
                        field,
                    },
                }
            );
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
                />

                <p className="text-muted mt-3">
                    Đang tải dữ liệu trang chủ...
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
                WELCOME
            ================================================== */}

            {!isAuthenticated ? (

                <div className="hero-banner">

                    <div className="hero-left">

                        <h2>
                            ⚽ Đặt sân chưa bao giờ
                            dễ đến thế
                        </h2>


                        <p>
                            Tìm sân • Đặt lịch •
                            Thanh toán nhanh chóng.
                        </p>


                        <div className="mt-4">

                            <Link
                                to="/fields"
                                className="btn btn-light btn-lg me-3"
                            >
                                Khám phá sân
                            </Link>


                            <Link
                                to="/login"
                                className="btn btn-outline-light btn-lg"
                            >
                                Đăng nhập
                            </Link>

                        </div>

                    </div>


                    {/* ==================================================
                        BANNER IMAGE
                    ================================================== */}

                    <div className="hero-right">

                        {
                            bannerImage ? (

                                <img
                                    src={
                                        bannerImage
                                    }
                                    alt={
                                        bannerField?.fieldName ||
                                        "Sân thể thao"
                                    }
                                    onError={(
                                        e
                                    ) => {

                                        e.currentTarget.style.display =
                                            "none";


                                        const placeholder =
                                            e.currentTarget
                                                .parentElement
                                                ?.querySelector(
                                                    ".hero-image-placeholder"
                                                );


                                        if (
                                            placeholder
                                        ) {

                                            placeholder.style.display =
                                                "flex";
                                        }
                                    }}
                                />

                            ) : null
                        }


                        <div
                            className="hero-image-placeholder"
                            style={{
                                display:
                                    bannerImage
                                        ? "none"
                                        : "flex",
                            }}
                        >

                            <i className="bi bi-trophy-fill"></i>


                            <span>
                                Sport Management
                            </span>

                        </div>

                    </div>

                </div>

            ) : (

                <div className="welcome-banner">

                    <div className="welcome-left">

                        <div className="avatar-circle">

                            {
                                user?.fullName
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                "U"
                            }

                        </div>


                        <div className="welcome-info">

                            <p className="welcome-date">
                                {today}
                            </p>


                            <h2>

                                Xin chào,{" "}

                                {
                                    user?.fullName ||
                                    "bạn"
                                }

                            </h2>


                            <span>
                                Chúc bạn có một ngày tuyệt vời!
                            </span>

                        </div>

                    </div>

                </div>
            )}


            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="search-panel">

                <div className="search-input">

                    <i className="bi bi-search"></i>


                    <input
                        type="text"
                        value={
                            searchText
                        }
                        onChange={
                            e =>
                                setSearchText(
                                    e.target.value
                                )
                        }
                        placeholder="Tìm kiếm sân, địa điểm..."
                    />

                </div>


                <div className="shortcut-menu">

                    <div
                        className="shortcut-item"
                        onClick={() =>
                            alert(
                                "Tính năng bản đồ đang phát triển."
                            )
                        }
                    >

                        <i className="bi bi-map-fill"></i>

                        <span>
                            Bản đồ
                        </span>

                    </div>


                    <div
                        className="shortcut-item"
                        onClick={() =>
                            navigate(
                                isAuthenticated
                                    ? "/booking-history"
                                    : "/login"
                            )
                        }
                    >

                        <i className="bi bi-calendar-check-fill"></i>

                        <span>
                            Đã đặt
                        </span>

                    </div>


                    <div
                        className="shortcut-item"
                        onClick={() =>
                            alert(
                                "Tính năng yêu thích đang phát triển."
                            )
                        }
                    >

                        <i className="bi bi-heart-fill"></i>

                        <span>
                            Yêu thích
                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {
                error && (

                    <div className="alert alert-danger mt-4">

                        <i className="bi bi-exclamation-triangle-fill me-2"></i>

                        {error}


                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm ms-3"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Thử lại
                        </button>

                    </div>
                )
            }


            {/* ==================================================
                DATA
            ================================================== */}

            {
                !error && (

                    <>

                        {/* ==================================================
                            STATISTICS
                        ================================================== */}

                        <div className="row g-4 mb-5">

                            {/* ==============================================
                                ACTIVE FIELDS
                            ============================================== */}

                            <div className="col-lg-4">

                                <div className="stat-card">

                                    <i className="bi bi-grid-fill"></i>


                                    <h3>
                                        {
                                            totalActiveFields
                                        }
                                    </h3>


                                    <p>
                                        Sân đang hoạt động
                                    </p>

                                </div>

                            </div>


                            {/* ==============================================
                                TODAY BOOKINGS
                            ============================================== */}

                            <div className="col-lg-4">

                                <div className="stat-card">

                                    <i className="bi bi-calendar-check-fill"></i>


                                    <h3>
                                        {
                                            isAuthenticated
                                                ? bookingsToday
                                                : "—"
                                        }
                                    </h3>


                                    <p>
                                        Lượt đặt hôm nay
                                    </p>

                                </div>

                            </div>


                            {/* ==============================================
                                UPCOMING BOOKINGS
                            ============================================== */}

                            <div className="col-lg-4">

                                <div className="stat-card">

                                    <i className="bi bi-clock-history"></i>


                                    <h3>
                                        {
                                            isAuthenticated
                                                ? upcomingBookings
                                                : "—"
                                        }
                                    </h3>


                                    <p>
                                        Lịch đặt từ ngày mai
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            FIELD HEADER
                        ================================================== */}

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h3 className="fw-bold">
                                🏟️ Sân đang hoạt động
                            </h3>


                            <Link
                                to="/fields"
                                className="btn btn-success"
                            >
                                Xem tất cả
                            </Link>

                        </div>


                        {/* ==================================================
                            FIELD LIST
                        ================================================== */}

                        {
                            featuredFields.length === 0 ? (

                                <div className="text-center py-5">

                                    <i
                                        className="bi bi-building-x"
                                        style={{
                                            fontSize:
                                                "45px",

                                            color:
                                                "#adb5bd",
                                        }}
                                    />


                                    <h5 className="mt-3">
                                        Không tìm thấy sân
                                    </h5>


                                    <p className="text-muted">
                                        Hiện chưa có sân phù hợp.
                                    </p>

                                </div>

                            ) : (

                                <div className="row">

                                    {
                                        featuredFields.map(
                                            field => (

                                                <div
                                                    className="col-lg-4 col-md-6 mb-4"
                                                    key={
                                                        field._id
                                                    }
                                                >

                                                    <div
                                                        className="field-card"
                                                        onClick={() =>
                                                            setSelectedField(
                                                                field
                                                            )
                                                        }
                                                    >

                                                        <img
                                                            src={
                                                                getFieldImage(
                                                                    field
                                                                )
                                                            }
                                                            alt={
                                                                field.fieldName ||
                                                                "Sân thể thao"
                                                            }
                                                            onError={(
                                                                e
                                                            ) => {

                                                                e.currentTarget.style.display =
                                                                    "none";

                                                            }}
                                                        />


                                                        <div className="p-3">

                                                            <h5>
                                                                {
                                                                    field.fieldName
                                                                }
                                                            </h5>


                                                            <p className="text-muted mb-1">

                                                                {
                                                                    field
                                                                        ?.fieldTypeId
                                                                        ?.name ||
                                                                    "Chưa phân loại"
                                                                }

                                                            </p>


                                                            <p className="text-muted">

                                                                <i className="bi bi-geo-alt-fill me-2"></i>

                                                                {
                                                                    field.location ||
                                                                    "Chưa cập nhật"
                                                                }

                                                            </p>


                                                            {
                                                                Number(
                                                                    field.rating
                                                                ) > 0 && (

                                                                    <div className="text-warning mb-2">

                                                                        ⭐{" "}

                                                                        {
                                                                            Number(
                                                                                field.rating
                                                                            ).toFixed(
                                                                                1
                                                                            )
                                                                        }

                                                                    </div>
                                                                )
                                                            }


                                                            <h4 className="text-success">

                                                                {
                                                                    formatCurrency(
                                                                        field.pricePerHour ||
                                                                        0
                                                                    )
                                                                }


                                                                <small className="text-muted fs-6">

                                                                    {" "}
                                                                    / giờ

                                                                </small>

                                                            </h4>


                                                            <button
                                                                type="button"
                                                                className="btn btn-success w-100 mt-3"
                                                                onClick={(
                                                                    e
                                                                ) => {

                                                                    e.stopPropagation();


                                                                    handleBooking(
                                                                        field
                                                                    );

                                                                }}
                                                            >

                                                                Đặt sân

                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>
                                            )
                                        )
                                    }

                                </div>
                            )
                        }

                    </>
                )
            }


            {/* ==================================================
                DETAIL
            ================================================== */}

            {
                selectedField && (

                    <FieldDetail
                        field={
                            selectedField
                        }

                        onClose={() =>
                            setSelectedField(
                                null
                            )
                        }

                        onBooking={() =>
                            handleBooking(
                                selectedField
                            )
                        }
                    />
                )
            }

        </div>
    );
}


export default Home;