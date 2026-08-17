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

                    setLoading(
                        true
                    );

                    setError("");


                    const data =
                        await getFieldApi(
                            id
                        );


                    if (!mounted) {
                        return;
                    }


                    console.log(
                        "REAL FIELD FROM API:",
                        data
                    );


                    setField(
                        data
                    );

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

                        setLoading(
                            false
                        );
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
    // BOOKING
    // ==========================================================

    const handleBooking =
        () => {

            if (!isAuthenticated) {

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
    // IMAGE
    // ==========================================================

    const getFieldImage =
        () => {

            const image =
                field?.image;


            if (!image) {

                return "/images/default-field.jpg";
            }


            // --------------------------------------------------
            // FULL URL
            // --------------------------------------------------

            if (
                image.startsWith(
                    "http://"
                ) ||
                image.startsWith(
                    "https://"
                )
            ) {

                return image;
            }


            // --------------------------------------------------
            // /uploads/...
            // --------------------------------------------------

            if (
                image.startsWith(
                    "/uploads/"
                )
            ) {

                return `http://localhost:5000${image}`;
            }


            // --------------------------------------------------
            // uploads/...
            // --------------------------------------------------

            if (
                image.startsWith(
                    "uploads/"
                )
            ) {

                return `http://localhost:5000/${image}`;
            }


            return image;
        };


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div
                className="container py-5 text-center"
            >

                <div
                    className="spinner-border text-success"
                    role="status"
                />

                <p className="mt-3 text-muted">
                    Đang tải thông tin sân...
                </p>

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

            <div className="container py-5">

                <div className="alert alert-danger">

                    {
                        error ||
                        "Không tìm thấy sân."
                    }

                </div>


                <Link
                    to="/fields"
                    className="btn btn-success"
                >
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

        <div className="container-fluid">

            {/* ==================================================
                BACK
            ================================================== */}

            <div className="mb-4">

                <Link
                    to="/fields"
                    className="text-success text-decoration-none"
                >

                    <i className="bi bi-arrow-left me-2"></i>

                    Quay lại danh sách sân

                </Link>

            </div>


            {/* ==================================================
                DETAIL
            ================================================== */}

            <div className="card border-0 shadow-sm">

                <div className="row g-0">

                    {/* ==================================================
                        IMAGE
                    ================================================== */}

                    <div className="col-lg-6">

                        <img
                            src={
                                imageUrl
                            }
                            alt={
                                field.fieldName
                            }
                            style={{
                                width:
                                    "100%",
                                height:
                                    "450px",
                                objectFit:
                                    "contain",
                                background:
                                    "#f4f4f4",
                            }}
                            onError={(
                                e
                            ) => {

                                console.error(
                                    "Không tải được ảnh chi tiết sân:",
                                    imageUrl
                                );


                                e.currentTarget.src =
                                    "/images/default-field.jpg";

                            }}
                        />

                    </div>


                    {/* ==================================================
                        INFO
                    ================================================== */}

                    <div className="col-lg-6">

                        <div className="card-body p-4 p-lg-5">

                            <span
                                className={
                                    field.status ===
                                    "active"
                                        ? "badge bg-success mb-3"
                                        : "badge bg-secondary mb-3"
                                }
                            >

                                {
                                    field.status ===
                                    "active"
                                        ? "Đang hoạt động"
                                        : "Bảo trì"
                                }

                            </span>


                            <h1 className="fw-bold mb-3">

                                {
                                    field.fieldName
                                }

                            </h1>


                            <p className="text-muted">

                                <i className="bi bi-grid-fill me-2"></i>

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
                                field.description && (

                                    <div className="mt-4">

                                        <h5 className="fw-bold">
                                            Mô tả
                                        </h5>

                                        <p className="text-muted">

                                            {
                                                field.description
                                            }

                                        </p>

                                    </div>
                                )
                            }


                            <hr />


                            <div className="mb-4">

                                <small className="text-muted">
                                    Giá thuê
                                </small>


                                <h2 className="text-success fw-bold">

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

                                </h2>

                            </div>


                            <button
                                type="button"
                                className="btn btn-success btn-lg w-100"
                                disabled={
                                    field.status !==
                                    "active"
                                }
                                onClick={
                                    handleBooking
                                }
                            >

                                <i className="bi bi-calendar-check me-2"></i>


                                {
                                    field.status ===
                                    "active"
                                        ? "Đặt sân"
                                        : "Sân đang bảo trì"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default FieldDetail;