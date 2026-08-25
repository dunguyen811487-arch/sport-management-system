import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    getFieldsApi,
} from "../../api/fieldApi";

import formatCurrency
    from "../../utils/formatCurrency";


function FieldList() {

    // ==========================================================
    // STATE
    // ==========================================================

    const [
        fields,
        setFields,
    ] = useState([]);


    const [
        searchText,
        setSearchText,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ==========================================================
    // LOAD REAL DATA
    // ==========================================================

    useEffect(() => {

        let mounted = true;


        const loadFields =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const data =
                        await getFieldsApi();


                    if (!mounted) {
                        return;
                    }


                    console.log(
                        "REAL FIELDS FROM API:",
                        data
                    );


                    setFields(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                } catch (err) {

                    console.error(
                        "Get fields error:",
                        err
                    );


                    if (!mounted) {
                        return;
                    }


                    setError(
                        err?.message ||
                        "Không thể tải danh sách sân."
                    );

                } finally {

                    if (mounted) {

                        setLoading(false);

                    }
                }
            };


        loadFields();


        return () => {

            mounted = false;

        };

    }, []);


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

                return fields;

            }


            return fields.filter(
                (field) => {

                    const name =
                        field
                            ?.fieldName
                            ?.toLowerCase() ||
                        "";


                    const location =
                        field
                            ?.location
                            ?.toLowerCase() ||
                        "";


                    const type =
                        field
                            ?.fieldTypeId
                            ?.name
                            ?.toLowerCase() ||
                        "";


                    const description =
                        field
                            ?.description
                            ?.toLowerCase() ||
                        "";


                    return (
                        name.includes(keyword) ||
                        location.includes(keyword) ||
                        type.includes(keyword) ||
                        description.includes(keyword)
                    );
                }
            );

        }, [
            fields,
            searchText,
        ]);


    // ==========================================================
    // IMAGE
    // ==========================================================

    const getFieldImage =
        (field) => {

            const image =
                field?.image;


            if (!image) {

                return "";

            }


            const value =
                String(
                    image
                ).trim();


            if (!value) {

                return "";

            }


            // --------------------------------------------------
            // URL đầy đủ
            // --------------------------------------------------

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


            // --------------------------------------------------
            // /uploads/...
            // --------------------------------------------------

            if (
                value.startsWith(
                    "/uploads/"
                )
            ) {

                return (
                    `http://localhost:5000${value}`
                );

            }


            // --------------------------------------------------
            // uploads/...
            // --------------------------------------------------

            if (
                value.startsWith(
                    "uploads/"
                )
            ) {

                return (
                    `http://localhost:5000/${value}`
                );

            }


            // --------------------------------------------------
            // filename
            // --------------------------------------------------

            if (
                value.startsWith(
                    "field-"
                )
            ) {

                return (
                    `http://localhost:5000/uploads/fields/${value}`
                );

            }


            return value;

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

                <p className="mt-3 text-muted">
                    Đang tải danh sách sân...
                </p>

            </div>
        );

    }


    // ==========================================================
    // ERROR
    // ==========================================================

    if (error) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    {error}

                </div>

            </div>
        );

    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div className="container-fluid">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-4">

                <h2 className="fw-bold">
                    Danh sách sân
                </h2>

                <p className="text-muted">
                    Tìm kiếm và lựa chọn sân phù hợp
                    với bạn.
                </p>

            </div>


            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="input-group">

                        <span className="input-group-text bg-white">

                            <i className="bi bi-search text-success"></i>

                        </span>


                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm sân, địa điểm, loại sân..."
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>


            {/* ==================================================
                RESULT COUNT
            ================================================== */}

            <div className="mb-3">

                <strong>
                    {filteredFields.length}
                </strong>{" "}
                sân được tìm thấy

            </div>


            {/* ==================================================
                NO DATA
            ================================================== */}

            {
                filteredFields.length === 0 ? (

                    <div className="text-center py-5">

                        <i
                            className="bi bi-building-x"
                            style={{
                                fontSize: "50px",
                                color: "#adb5bd",
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
                            filteredFields.map(
                                (
                                    field
                                ) => {

                                    const imageUrl =
                                        getFieldImage(
                                            field
                                        );


                                    return (

                                        <div
                                            className="col-lg-4 col-md-6 mb-4"
                                            key={
                                                field._id
                                            }
                                        >

                                            <div className="card h-100 border-0 shadow-sm">

                                                {/* ==================================================
                                                    IMAGE
                                                ================================================== */}

                                                <div
                                                    style={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            "220px",
                                                        background:
                                                            "#f4f4f4",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        overflow:
                                                            "hidden",
                                                    }}
                                                >

                                                    {
                                                        imageUrl ? (

                                                            <img
                                                                src={
                                                                    imageUrl
                                                                }
                                                                alt={
                                                                    field.fieldName ||
                                                                    "Sân thể thao"
                                                                }
                                                                style={{
                                                                    width:
                                                                        "100%",
                                                                    height:
                                                                        "100%",
                                                                    objectFit:
                                                                        "contain",
                                                                }}
                                                                onLoad={(
                                                                    e
                                                                ) => {

                                                                    console.log(
                                                                        "ẢNH SÂN LOAD THÀNH CÔNG:",
                                                                        imageUrl,
                                                                        "width:",
                                                                        e.currentTarget.naturalWidth,
                                                                        "height:",
                                                                        e.currentTarget.naturalHeight
                                                                    );

                                                                }}
                                                                onError={(
                                                                    e
                                                                ) => {

                                                                    console.error(
                                                                        "ẢNH SÂN LOAD THẤT BẠI:",
                                                                        imageUrl
                                                                    );


                                                                    // Không đổi src nữa
                                                                    // để tránh vòng lặp onError
                                                                    e.currentTarget.onerror =
                                                                        null;

                                                                }}
                                                            />

                                                        ) : (

                                                            <div
                                                                className="text-center text-muted"
                                                            >

                                                                <i
                                                                    className="bi bi-image"
                                                                    style={{
                                                                        fontSize:
                                                                            "48px",
                                                                    }}
                                                                />

                                                                <div className="mt-2">
                                                                    Chưa có ảnh
                                                                </div>

                                                            </div>

                                                        )
                                                    }

                                                </div>


                                                {/* ==================================================
                                                    BODY
                                                ================================================== */}

                                                <div className="card-body">

                                                    <h5 className="fw-bold">

                                                        {
                                                            field.fieldName
                                                        }

                                                    </h5>


                                                    <p className="text-muted mb-2">

                                                        <i className="bi bi-grid-fill me-2"></i>

                                                        {
                                                            field
                                                                ?.fieldTypeId
                                                                ?.name ||
                                                            "Chưa phân loại"
                                                        }

                                                    </p>


                                                    <p className="text-muted mb-2">

                                                        <i className="bi bi-geo-alt-fill me-2"></i>

                                                        {
                                                            field.location ||
                                                            "Chưa cập nhật"
                                                        }

                                                    </p>


                                                    {
                                                        field.description && (

                                                            <p className="text-muted">

                                                                {
                                                                    field.description
                                                                }

                                                            </p>

                                                        )
                                                    }


                                                    <div className="d-flex justify-content-between align-items-center">

                                                        <h5 className="text-success mb-0">

                                                            {
                                                                formatCurrency(
                                                                    field.pricePerHour ||
                                                                    0
                                                                )
                                                            }

                                                            <small className="text-muted">
                                                                / giờ
                                                            </small>

                                                        </h5>


                                                        <span
                                                            className={
                                                                field.status ===
                                                                "active"
                                                                    ? "badge bg-success"
                                                                    : "badge bg-secondary"
                                                            }
                                                        >

                                                            {
                                                                field.status ===
                                                                "active"
                                                                    ? "Đang hoạt động"
                                                                    : "Bảo trì"
                                                            }

                                                        </span>

                                                    </div>

                                                </div>


                                                {/* ==================================================
                                                    FOOTER
                                                ================================================== */}

                                                <div className="card-footer bg-white border-0 p-3">

                                                    <Link
                                                        to={
                                                            `/fields/${field._id}`
                                                        }
                                                        className="btn btn-success w-100"
                                                    >

                                                        Xem chi tiết

                                                    </Link>

                                                </div>

                                            </div>

                                        </div>

                                    );

                                }
                            )
                        }

                    </div>

                )
            }

        </div>
    );
}


export default FieldList;