import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getFieldApi,
} from "../../api/fieldApi";

import useAuth
    from "../../hooks/useAuth";

import formatCurrency
    from "../../utils/formatCurrency";


function FieldDetail() {

    const {
        id,
    } = useParams();


    const navigate =
        useNavigate();


    const {
        isAuthenticated,
    } = useAuth();


    // ==========================================================
    // STATE
    // ==========================================================

    const [
        field,
        setField,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ==========================================================
    // LOAD FIELD
    // ==========================================================

    useEffect(() => {

        let mounted = true;


        const loadField =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const data =
                        await getFieldApi(id);


                    if (!mounted) {
                        return;
                    }


                    console.log(
                        "REAL FIELD FROM API:",
                        data
                    );


                    setField(data);

                } catch (err) {

                    console.error(
                        "Get field detail error:",
                        err
                    );


                    if (!mounted) {
                        return;
                    }


                    setError(
                        err?.message ||
                        "Không thể tải thông tin sân."
                    );

                } finally {

                    if (mounted) {

                        setLoading(false);

                    }

                }

            };


        if (id) {

            loadField();

        }


        return () => {

            mounted = false;

        };

    }, [
        id,
    ]);


    // ==========================================================
    // KHÓA SCROLL KHI MODAL MỞ
    // ==========================================================

    useEffect(() => {

        if (!field) {
            return;
        }


        const oldOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                oldOverflow;

        };

    }, [
        field,
    ]);


    // ==========================================================
    // ESC ĐỂ ĐÓNG MODAL
    // ==========================================================

    useEffect(() => {

        if (!field) {
            return;
        }


        const handleKeyDown =
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    navigate("/fields");

                }

            };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        field,
        navigate,
    ]);


    // ==========================================================
    // BOOKING
    // ==========================================================

    const handleBooking =
        () => {

            if (!isAuthenticated) {

                navigate("/login");

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
    // IMAGE
    // ==========================================================

    const getFieldImage =
        () => {

            const image =
                field?.image;


            if (!image) {

                return "/images/default-field.jpg";

            }


            // FULL URL
            if (
                image.startsWith("http://") ||
                image.startsWith("https://")
            ) {

                return image;

            }


            // /uploads/...
            if (
                image.startsWith("/uploads/")
            ) {

                return `http://localhost:5000${image}`;

            }


            // uploads/...
            if (
                image.startsWith("uploads/")
            ) {

                return `http://localhost:5000/${image}`;

            }


            return image;

        };


    // ==========================================================
    // CLOSE
    // ==========================================================

    const handleClose =
        () => {

            navigate("/fields");

        };


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div
                className="container-fluid"
                style={{
                    minHeight: "70vh",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",
                }}
            >

                <div className="text-center">

                    <div
                        className="spinner-border text-success"
                        role="status"
                        style={{
                            width: "3rem",
                            height: "3rem",
                        }}
                    />

                    <p
                        className="mt-3 text-muted mb-0"
                    >
                        Đang tải thông tin sân...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================================
    // ERROR
    // ==========================================================

    if (
        error ||
        !field
    ) {

        return (

            <div
                className="container py-5"
            >

                <div
                    className="alert alert-danger"
                >
                    {
                        error ||
                        "Không tìm thấy sân."
                    }
                </div>


                <Link
                    to="/fields"
                    className="btn btn-success"
                >

                    <i className="bi bi-arrow-left me-2"></i>

                    Quay lại danh sách sân

                </Link>

            </div>

        );

    }


    // ==========================================================
    // IMAGE URL
    // ==========================================================

    const imageUrl =
        getFieldImage();


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div
            className="field-detail-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    handleClose();

                }

            }}
        >

            {/* ==================================================
                MODAL
            ================================================== */}

            <div
                className="field-detail-modal"
                onMouseDown={(event) => {

                    event.stopPropagation();

                }}
            >

                {/* ==================================================
                    CLOSE
                ================================================== */}

                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Đóng"
                    className="field-detail-close"
                >

                    <i className="bi bi-x-lg"></i>

                </button>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="field-detail-content">

                    {/* ==================================================
                        IMAGE
                    ================================================== */}

                    <div className="field-detail-image-section">

                        <div className="field-detail-image-wrapper">

                            <img
                                src={imageUrl}
                                alt={
                                    field.fieldName
                                }
                                className="field-detail-image"

                                onError={(event) => {

                                    console.error(
                                        "Không tải được ảnh chi tiết sân:",
                                        imageUrl
                                    );


                                    event.currentTarget.src =
                                        "/images/default-field.jpg";

                                }}
                            />


                            {/* IMAGE LABEL */}

                            <div className="field-detail-image-label">

                                <i className="bi bi-image"></i>

                                <span>
                                    Hình ảnh sân
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        INFORMATION
                    ================================================== */}

                    <div className="field-detail-info">

                        {/* STATUS */}

                        <div className="field-detail-status">

                            <span
                                className={
                                    field.status === "active"
                                        ? "status-active"
                                        : "status-maintenance"
                                }
                            >

                                <span className="status-dot"></span>

                                {
                                    field.status === "active"
                                        ? "Đang hoạt động"
                                        : "Bảo trì"
                                }

                            </span>

                        </div>


                        {/* NAME */}

                        <h1 className="field-detail-title">

                            {
                                field.fieldName
                            }

                        </h1>


                        {/* TYPE */}

                        <div className="field-detail-meta">

                            <div className="field-detail-meta-item">

                                <span className="meta-icon">

                                    <i className="bi bi-grid-fill"></i>

                                </span>

                                <span>

                                    {
                                        field
                                            ?.fieldTypeId
                                            ?.name ||
                                        "Chưa phân loại"
                                    }

                                </span>

                            </div>


                            {/* LOCATION */}

                            <div className="field-detail-meta-item">

                                <span className="meta-icon">

                                    <i className="bi bi-geo-alt-fill"></i>

                                </span>

                                <span>

                                    {
                                        field.location ||
                                        "Chưa cập nhật"
                                    }

                                </span>

                            </div>

                        </div>


                        {/* DESCRIPTION */}

                        {
                            field.description && (

                                <div className="field-detail-description">

                                    <div className="description-title">

                                        <i className="bi bi-file-earmark-text"></i>

                                        <strong>
                                            Mô tả
                                        </strong>

                                    </div>


                                    <p>

                                        {
                                            field.description
                                        }

                                    </p>

                                </div>

                            )
                        }


                        {/* PRICE */}

                        <div className="field-detail-price">

                            <div className="price-label">
                                Giá thuê
                            </div>


                            <div className="price-value">

                                <span>
                                    {
                                        formatCurrency(
                                            field.pricePerHour ||
                                            0
                                        )
                                    }
                                </span>

                                <small>
                                    / giờ
                                </small>

                            </div>

                        </div>


                        {/* INFORMATION CARDS */}

                        <div className="field-detail-cards">

                            {/* STATUS */}

                            <div className="field-detail-card">

                                <i className="bi bi-shield-check"></i>

                                <strong>
                                    Trạng thái
                                </strong>

                                <small>

                                    {
                                        field.status === "active"
                                            ? "Hoạt động"
                                            : "Bảo trì"
                                    }

                                </small>

                            </div>


                            {/* LOCATION */}

                            <div className="field-detail-card">

                                <i className="bi bi-geo"></i>

                                <strong>
                                    Khu vực
                                </strong>

                                <small>

                                    {
                                        field.location ||
                                        "-"
                                    }

                                </small>

                            </div>


                            {/* PRICE */}

                            <div className="field-detail-card">

                                <i className="bi bi-cash-stack"></i>

                                <strong>
                                    Đơn giá
                                </strong>

                                <small>
                                    Theo giờ
                                </small>

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div className="field-detail-actions">

                            <button
                                type="button"
                                className="field-detail-back-button"
                                onClick={handleClose}
                            >

                                <i className="bi bi-arrow-left"></i>

                                <span>
                                    Quay lại
                                </span>

                            </button>


                            <button
                                type="button"
                                className="field-detail-book-button"
                                disabled={
                                    field.status !== "active"
                                }
                                onClick={handleBooking}
                            >

                                <i className="bi bi-calendar-check"></i>

                                <span>

                                    {
                                        field.status === "active"
                                            ? "Đặt sân"
                                            : "Sân đang bảo trì"
                                    }

                                </span>

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                CSS
            ================================================== */}

            <style>
                {`

                    /* ==================================================
                       OVERLAY
                    ================================================== */

                    .field-detail-overlay {

                        position: fixed;

                        inset: 0;

                        z-index: 1050;

                        background:
                            rgba(15, 23, 42, 0.68);

                        backdrop-filter:
                            blur(5px);

                        -webkit-backdrop-filter:
                            blur(5px);

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        padding: 20px;

                        overflow-y: auto;

                    }


                    /* ==================================================
                       MODAL
                    ================================================== */

                    .field-detail-modal {

                        position: relative;

                        width: 100%;

                        max-width: 880px;

                        max-height:
                            calc(100vh - 60px);

                        background: #ffffff;

                        border-radius: 18px;

                        overflow: hidden;

                        box-shadow:
                            0 25px 70px
                            rgba(0, 0, 0, 0.28);

                        animation:
                            fieldDetailModalShow
                            0.22s
                            ease-out;

                    }


                    /* ==================================================
                       CLOSE BUTTON
                    ================================================== */

                    .field-detail-close {

                        position: absolute;

                        top: 14px;

                        right: 14px;

                        z-index: 20;

                        width: 38px;

                        height: 38px;

                        border: none;

                        border-radius: 50%;

                        background:
                            rgba(255,255,255,0.95);

                        color: #334155;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        font-size: 17px;

                        box-shadow:
                            0 5px 16px
                            rgba(0,0,0,0.16);

                        cursor: pointer;

                        transition:
                            all 0.2s ease;

                    }


                    .field-detail-close:hover {

                        background: #f1f5f9;

                        color: #111827;

                        transform: scale(1.05);

                    }


                    /* ==================================================
                       CONTENT
                    ================================================== */

                    .field-detail-content {

                        display: grid;

                        grid-template-columns:
                            43% 57%;

                        min-height: 480px;

                    }


                    /* ==================================================
                       IMAGE SECTION
                    ================================================== */

                    .field-detail-image-section {

                        padding: 22px;

                        background:
                            linear-gradient(
                                135deg,
                                #f1f5f9,
                                #e2e8f0
                            );

                        display: flex;

                        align-items: center;

                        justify-content: center;

                    }


                    .field-detail-image-wrapper {

                        width: 100%;

                        aspect-ratio: 4 / 3;

                        max-height: 390px;

                        position: relative;

                        overflow: hidden;

                        border-radius: 14px;

                        background: #e5e7eb;

                        box-shadow:
                            0 8px 25px
                            rgba(15,23,42,0.12);

                    }


                    .field-detail-image {

                        width: 100%;

                        height: 100%;

                        display: block;

                        object-fit: cover;

                    }


                    .field-detail-image-label {

                        position: absolute;

                        left: 12px;

                        bottom: 12px;

                        display: inline-flex;

                        align-items: center;

                        gap: 7px;

                        padding:
                            7px 12px;

                        border-radius: 999px;

                        background:
                            rgba(15,23,42,0.78);

                        color: #ffffff;

                        font-size: 12px;

                        font-weight: 600;

                        backdrop-filter: blur(5px);

                    }


                    /* ==================================================
                       INFORMATION
                    ================================================== */

                    .field-detail-info {

                        padding:
                            30px 32px 26px;

                        overflow-y: auto;

                        display: flex;

                        flex-direction: column;

                    }


                    /* ==================================================
                       STATUS
                    ================================================== */

                    .field-detail-status {

                        margin-bottom: 10px;

                    }


                    .field-detail-status span {

                        display: inline-flex;

                        align-items: center;

                        gap: 7px;

                        padding:
                            6px 11px;

                        border-radius: 999px;

                        font-size: 12px;

                        font-weight: 600;

                    }


                    .status-active {

                        background: #dcfce7;

                        color: #15803d;

                        border:
                            1px solid #bbf7d0;

                    }


                    .status-maintenance {

                        background: #f1f5f9;

                        color: #475569;

                        border:
                            1px solid #cbd5e1;

                    }


                    .status-dot {

                        width: 7px;

                        height: 7px;

                        border-radius: 50%;

                        background: currentColor;

                    }


                    /* ==================================================
                       TITLE
                    ================================================== */

                    .field-detail-title {

                        margin: 0 0 13px;

                        font-size: 34px;

                        font-weight: 800;

                        line-height: 1.15;

                        color: #111827;

                        letter-spacing: -0.6px;

                    }


                    /* ==================================================
                       META
                    ================================================== */

                    .field-detail-meta {

                        display: flex;

                        flex-direction: column;

                        gap: 8px;

                        margin-bottom: 18px;

                    }


                    .field-detail-meta-item {

                        display: flex;

                        align-items: center;

                        gap: 9px;

                        color: #64748b;

                        font-size: 14px;

                    }


                    .meta-icon {

                        width: 30px;

                        height: 30px;

                        flex-shrink: 0;

                        border-radius: 9px;

                        background: #f0fdf4;

                        color: #15803d;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                    }


                    /* ==================================================
                       DESCRIPTION
                    ================================================== */

                    .field-detail-description {

                        padding: 14px 15px;

                        margin-bottom: 18px;

                        border-radius: 13px;

                        background:
                            linear-gradient(
                                135deg,
                                #f0fdf4,
                                #f8fafc
                            );

                        border:
                            1px solid #dcfce7;

                    }


                    .description-title {

                        display: flex;

                        align-items: center;

                        gap: 8px;

                        margin-bottom: 6px;

                        color: #1f2937;

                        font-size: 14px;

                    }


                    .description-title i {

                        color: #15803d;

                        font-size: 17px;

                    }


                    .field-detail-description p {

                        margin: 0;

                        color: #64748b;

                        font-size: 13px;

                        line-height: 1.55;

                    }


                    /* ==================================================
                       PRICE
                    ================================================== */

                    .field-detail-price {

                        padding-top: 16px;

                        margin-bottom: 17px;

                        border-top:
                            1px solid #e5e7eb;

                    }


                    .price-label {

                        color: #64748b;

                        font-size: 12px;

                        margin-bottom: 2px;

                    }


                    .price-value {

                        display: flex;

                        align-items: baseline;

                        gap: 7px;

                    }


                    .price-value span {

                        color: #15803d;

                        font-size: 30px;

                        font-weight: 800;

                        line-height: 1.2;

                    }


                    .price-value small {

                        color: #64748b;

                        font-size: 14px;

                    }


                    /* ==================================================
                       INFORMATION CARDS
                    ================================================== */

                    .field-detail-cards {

                        display: grid;

                        grid-template-columns:
                            repeat(3, 1fr);

                        gap: 8px;

                        margin-bottom: 18px;

                    }


                    .field-detail-card {

                        min-width: 0;

                        padding:
                            10px 6px;

                        border:
                            1px solid #e5e7eb;

                        border-radius: 12px;

                        text-align: center;

                        display: flex;

                        flex-direction: column;

                        align-items: center;

                        justify-content: center;

                    }


                    .field-detail-card i {

                        color: #16a34a;

                        font-size: 18px;

                        margin-bottom: 4px;

                    }


                    .field-detail-card strong {

                        color: #374151;

                        font-size: 11px;

                        margin-bottom: 2px;

                    }


                    .field-detail-card small {

                        color: #64748b;

                        font-size: 10px;

                        white-space: nowrap;

                        overflow: hidden;

                        text-overflow: ellipsis;

                        max-width: 100%;

                    }


                    /* ==================================================
                       ACTIONS
                    ================================================== */

                    .field-detail-actions {

                        display: grid;

                        grid-template-columns:
                            150px 1fr;

                        gap: 8px;

                        margin-top: auto;

                    }


                    .field-detail-back-button,
                    .field-detail-book-button {

                        height: 48px;

                        border-radius: 11px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        gap: 8px;

                        font-size: 14px;

                        font-weight: 700;

                        cursor: pointer;

                        transition:
                            all 0.2s ease;

                    }


                    .field-detail-back-button {

                        border:
                            1px solid #e5e7eb;

                        background: #ffffff;

                        color: #1f2937;

                    }


                    .field-detail-back-button:hover {

                        background: #f8fafc;

                        border-color: #cbd5e1;

                    }


                    .field-detail-book-button {

                        border: none;

                        background: #198754;

                        color: #ffffff;

                        box-shadow:
                            0 7px 18px
                            rgba(25,135,84,0.22);

                    }


                    .field-detail-book-button:hover:not(:disabled) {

                        background: #157347;

                        transform: translateY(-1px);

                        box-shadow:
                            0 9px 22px
                            rgba(25,135,84,0.28);

                    }


                    .field-detail-book-button:disabled {

                        background: #94a3b8;

                        cursor: not-allowed;

                        box-shadow: none;

                    }


                    /* ==================================================
                       ANIMATION
                    ================================================== */

                    @keyframes fieldDetailModalShow {

                        from {

                            opacity: 0;

                            transform:
                                translateY(15px)
                                scale(0.98);

                        }

                        to {

                            opacity: 1;

                            transform:
                                translateY(0)
                                scale(1);

                        }

                    }


                    /* ==================================================
                       TABLET
                    ================================================== */

                    @media (max-width: 900px) {

                        .field-detail-modal {

                            max-width: 760px;

                        }


                        .field-detail-content {

                            grid-template-columns:
                                42% 58%;

                        }


                        .field-detail-info {

                            padding:
                                26px 25px 24px;

                        }


                        .field-detail-title {

                            font-size: 30px;

                        }


                        .price-value span {

                            font-size: 27px;

                        }

                    }


                    /* ==================================================
                       MOBILE
                    ================================================== */

                    @media (max-width: 700px) {

                        .field-detail-overlay {

                            padding: 10px;

                            align-items: flex-start;

                        }


                        .field-detail-modal {

                            max-height:
                                calc(100vh - 20px);

                            margin-top: 10px;

                            border-radius: 16px;

                        }


                        .field-detail-content {

                            display: block;

                            min-height: auto;

                        }


                        .field-detail-image-section {

                            padding: 14px;

                        }


                        .field-detail-image-wrapper {

                            max-height: none;

                            aspect-ratio: 16 / 10;

                        }


                        .field-detail-info {

                            padding:
                                22px 18px 18px;

                            max-height:
                                calc(100vh - 330px);

                        }


                        .field-detail-title {

                            font-size: 28px;

                        }


                        .field-detail-actions {

                            grid-template-columns:
                                120px 1fr;

                        }

                    }


                    /* ==================================================
                       SMALL MOBILE
                    ================================================== */

                    @media (max-width: 480px) {

                        .field-detail-overlay {

                            padding: 0;

                        }


                        .field-detail-modal {

                            width: 100%;

                            max-height: 100vh;

                            margin: 0;

                            border-radius: 0;

                        }


                        .field-detail-close {

                            top: 10px;

                            right: 10px;

                            width: 36px;

                            height: 36px;

                        }


                        .field-detail-image-section {

                            padding: 10px;

                        }


                        .field-detail-image-wrapper {

                            border-radius: 11px;

                            aspect-ratio: 16 / 10;

                        }


                        .field-detail-info {

                            padding:
                                18px 14px 14px;

                            max-height:
                                calc(100vh - 280px);

                        }


                        .field-detail-title {

                            font-size: 25px;

                        }


                        .field-detail-cards {

                            gap: 5px;

                        }


                        .field-detail-actions {

                            grid-template-columns:
                                1fr 1.5fr;

                        }


                        .field-detail-back-button,
                        .field-detail-book-button {

                            height: 45px;

                            font-size: 13px;

                        }

                    }

                `}
            </style>

        </div>

    );

}


export default FieldDetail;