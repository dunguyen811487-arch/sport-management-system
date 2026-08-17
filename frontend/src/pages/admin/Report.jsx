import {
    useEffect,
    useState,
} from "react";

import apiClient
    from "../../api/apiClient";


function Report() {

    const [
        reports,
        setReports,
    ] = useState([]);


    const [
        currentReport,
        setCurrentReport,
    ] = useState(null);


    const [
        fromDate,
        setFromDate,
    ] = useState("");


    const [
        toDate,
        setToDate,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        generating,
        setGenerating,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    // ==========================================================
    // LOAD REPORTS
    // ==========================================================

    const loadReports =
        async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await apiClient(
                        "/reports",
                        {
                            method:
                                "GET",
                        }
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


                setReports(
                    data
                );


                if (
                    data.length > 0
                ) {

                    setCurrentReport(
                        data[0]
                    );
                }

            } catch (err) {

                console.error(
                    "Lỗi tải danh sách báo cáo:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tải danh sách báo cáo."
                );


                setReports([]);

            } finally {

                setLoading(false);
            }
        };


    // ==========================================================
    // LOAD
    // ==========================================================

    useEffect(() => {

        loadReports();

    }, []);


    // ==========================================================
    // CREATE REPORT
    // ==========================================================

    const handleCreateReport =
        async () => {

            setError("");


            if (!fromDate) {

                setError(
                    "Vui lòng chọn từ ngày."
                );

                return;
            }


            if (!toDate) {

                setError(
                    "Vui lòng chọn đến ngày."
                );

                return;
            }


            if (
                fromDate >
                toDate
            ) {

                setError(
                    "Từ ngày phải nhỏ hơn hoặc bằng đến ngày."
                );

                return;
            }


            try {

                setGenerating(
                    true
                );


                const response =
                    await apiClient(
                        "/reports",
                        {
                            method:
                                "POST",

                            body:
                                JSON.stringify({
                                    reportType:
                                        "booking_revenue",

                                    fromDate:
                                        fromDate,

                                    toDate:
                                        toDate,
                                }),
                        }
                    );


                if (
                    !response?.success ||
                    !response?.data
                ) {

                    throw new Error(
                        response?.message ||
                        "Không thể tạo báo cáo."
                    );
                }


                setCurrentReport(
                    response.data
                );


                await loadReports();

            } catch (err) {

                console.error(
                    "Create report error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tạo báo cáo."
                );

            } finally {

                setGenerating(false);
            }
        };


    // ==========================================================
    // VIEW REPORT
    // ==========================================================

    const handleViewReport =
        async (
            id
        ) => {

            try {

                setError("");


                const response =
                    await apiClient(
                        `/reports/${id}`,
                        {
                            method:
                                "GET",
                        }
                    );


                if (
                    !response?.success ||
                    !response?.data
                ) {

                    throw new Error(
                        response?.message ||
                        "Không thể tải báo cáo."
                    );
                }


                setCurrentReport(
                    response.data
                );

            } catch (err) {

                console.error(
                    "Get report detail error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tải báo cáo."
                );
            }
        };


    // ==========================================================
    // DELETE REPORT
    // ==========================================================

    const handleDeleteReport =
        async (
            id
        ) => {

            const confirmed =
                window.confirm(
                    "Bạn có chắc muốn xóa báo cáo này không?"
                );


            if (!confirmed) {
                return;
            }


            try {

                setError("");


                await apiClient(
                    `/reports/${id}`,
                    {
                        method:
                            "DELETE",
                    }
                );


                if (
                    currentReport?._id ===
                    id
                ) {

                    setCurrentReport(
                        null
                    );
                }


                await loadReports();

            } catch (err) {

                console.error(
                    "Delete report error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể xóa báo cáo."
                );
            }
        };


    // ==========================================================
    // RESET
    // ==========================================================

    const handleReset =
        () => {

            setFromDate("");
            setToDate("");

        };


    // ==========================================================
    // FORMAT MONEY
    // ==========================================================

    const formatCurrency =
        (
            value
        ) => {

            return (
                Number(
                    value || 0
                ).toLocaleString(
                    "vi-VN"
                ) +
                " đ"
            );
        };


    // ==========================================================
    // FORMAT DATE
    // ==========================================================

    const formatDate =
        (
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
    // FORMAT DATETIME
    // ==========================================================

    const formatDateTime =
        (
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


    // ==========================================================
    // CREATOR
    // ==========================================================

    const getCreatorName =
        (
            report
        ) => {

            const user =
                report?.createdBy;


            if (
                user &&
                typeof user ===
                    "object"
            ) {

                return (
                    user.fullName ||
                    user.name ||
                    user.email ||
                    "-"
                );
            }


            return "-";
        };


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div className="container-fluid">

                <h1 className="mb-1">
                    Báo cáo thống kê
                </h1>

                <p className="text-muted">
                    Đang tải báo cáo...
                </p>

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

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

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="mb-1">
                        Báo cáo thống kê
                    </h1>

                    <p className="text-muted mb-0">
                        Báo cáo doanh thu và tình hình đặt sân
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={
                        loadReports
                    }
                >

                    <i className="bi bi-arrow-clockwise me-2"></i>

                    Làm mới

                </button>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="alert alert-danger">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    {error}

                </div>
            )}


            {/* ==================================================
                CREATE
            ================================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-header bg-white">

                    <h5 className="mb-0">
                        Tạo báo cáo doanh thu và đặt sân
                    </h5>

                </div>


                <div className="card-body">

                    <div className="row g-3 align-items-end">

                        <div className="col-md-4">

                            <label className="form-label">
                                Từ ngày
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={
                                    fromDate
                                }
                                onChange={(
                                    e
                                ) =>
                                    setFromDate(
                                        e.target.value
                                    )
                                }
                                disabled={
                                    generating
                                }
                            />

                        </div>


                        <div className="col-md-4">

                            <label className="form-label">
                                Đến ngày
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={
                                    toDate
                                }
                                onChange={(
                                    e
                                ) =>
                                    setToDate(
                                        e.target.value
                                    )
                                }
                                disabled={
                                    generating
                                }
                            />

                        </div>


                        <div className="col-md-4">

                            <div className="d-flex gap-2">

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={
                                        handleCreateReport
                                    }
                                    disabled={
                                        generating
                                    }
                                >

                                    {generating ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            />

                                            Đang tạo...
                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-file-earmark-bar-graph me-2"></i>
                                            Tạo báo cáo
                                        </>
                                    )}

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={
                                        handleReset
                                    }
                                    disabled={
                                        generating
                                    }
                                >
                                    Đặt lại
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                CURRENT REPORT
            ================================================== */}

            {currentReport && (

                <div className="card shadow-sm border-0 mb-4">

                    <div className="card-header bg-white">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h5 className="mb-1">
                                    Báo cáo hiện tại
                                </h5>

                                <small className="text-muted">

                                    {
                                        formatDate(
                                            currentReport.fromDate
                                        )
                                    }

                                    {" → "}

                                    {
                                        formatDate(
                                            currentReport.toDate
                                        )
                                    }

                                </small>

                            </div>


                            <span className="badge bg-success">
                                Đã lưu
                            </span>

                        </div>

                    </div>


                    <div className="card-body">

                        {/* ==================================================
                            SUMMARY
                        ================================================== */}

                        <div className="row g-4 mb-4">

                            <div className="col-md-3">

                                <div className="border rounded p-3 h-100">

                                    <div className="text-muted">
                                        Tổng doanh thu
                                    </div>

                                    <h3 className="text-success mb-0">

                                        {
                                            formatCurrency(
                                                currentReport.totalRevenue
                                            )
                                        }

                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3 h-100">

                                    <div className="text-muted">
                                        Giao dịch đã thanh toán
                                    </div>

                                    <h3 className="text-primary mb-0">

                                        {
                                            currentReport.totalPaidPayments
                                        }

                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3 h-100">

                                    <div className="text-muted">
                                        Tổng lượt đặt sân
                                    </div>

                                    <h3 className="mb-0">

                                        {
                                            currentReport.totalBookings
                                        }

                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3 h-100">

                                    <div className="text-muted">
                                        Booking bị hủy
                                    </div>

                                    <h3 className="text-danger mb-0">

                                        {
                                            currentReport.cancelledBookings
                                        }

                                    </h3>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            BOOKING STATUS
                        ================================================== */}

                        <div className="row g-4 mb-4">

                            <div className="col-md-6">

                                <div className="border rounded p-3">

                                    <div className="text-muted">
                                        Đã xác nhận
                                    </div>

                                    <h4 className="text-success mb-0">

                                        {
                                            currentReport.confirmedBookings
                                        }

                                    </h4>

                                </div>

                            </div>


                            <div className="col-md-6">

                                <div className="border rounded p-3">

                                    <div className="text-muted">
                                        Chờ xử lý
                                    </div>

                                    <h4 className="text-warning mb-0">

                                        {
                                            currentReport.pendingBookings
                                        }

                                    </h4>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            REPORT INFO
                        ================================================== */}

                        <div className="alert alert-light">

                            <div className="row">

                                <div className="col-md-6">

                                    <strong>
                                        Người tạo:
                                    </strong>

                                    {" "}

                                    {
                                        getCreatorName(
                                            currentReport
                                        )
                                    }

                                </div>


                                <div className="col-md-6">

                                    <strong>
                                        Thời gian tạo:
                                    </strong>

                                    {" "}

                                    {
                                        formatDateTime(
                                            currentReport.createdAt
                                        )
                                    }

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            DAILY REPORT
                        ================================================== */}

                        <h5 className="mb-3">
                            Thống kê theo ngày
                        </h5>


                        {
                            Array.isArray(
                                currentReport.dailyStats
                            ) &&
                            currentReport.dailyStats.length >
                                0 ? (

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle">

                                        <thead className="table-light">

                                            <tr>

                                                <th>
                                                    Ngày
                                                </th>

                                                <th>
                                                    Tổng lượt đặt
                                                </th>

                                                <th>
                                                    Đã xác nhận
                                                </th>

                                                <th>
                                                    Chờ xử lý
                                                </th>

                                                <th>
                                                    Đã hủy
                                                </th>

                                                <th>
                                                    Doanh thu
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {
                                                currentReport.dailyStats.map(
                                                    (
                                                        item
                                                    ) => (

                                                        <tr
                                                            key={
                                                                item.date
                                                            }
                                                        >

                                                            <td>

                                                                {
                                                                    formatDate(
                                                                        item.date
                                                                    )
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    item.bookings
                                                                }

                                                            </td>


                                                            <td>

                                                                <span className="badge bg-success">

                                                                    {
                                                                        item.confirmed
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <span className="badge bg-warning text-dark">

                                                                    {
                                                                        item.pending
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <span className="badge bg-danger">

                                                                    {
                                                                        item.cancelled
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <strong className="text-success">

                                                                    {
                                                                        formatCurrency(
                                                                            item.revenue
                                                                        )
                                                                    }

                                                                </strong>

                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>

                            ) : (

                                <div className="text-center py-4">

                                    <p className="text-muted mb-0">
                                        Không có dữ liệu trong khoảng thời gian này.
                                    </p>

                                </div>
                            )
                        }

                    </div>

                </div>
            )}


            {/* ==================================================
                REPORT HISTORY
            ================================================== */}

            <div className="card shadow-sm border-0">

                <div className="card-header bg-white">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h5 className="mb-0">
                                Lịch sử báo cáo
                            </h5>

                            <small className="text-muted">
                                Các báo cáo đã được lưu trong hệ thống
                            </small>

                        </div>


                        <span className="badge bg-secondary">

                            {
                                reports.length
                            }{" "}
                            báo cáo

                        </span>

                    </div>

                </div>


                <div className="card-body p-0">

                    {
                        reports.length ===
                        0 ? (

                            <div className="text-center py-5">

                                <i
                                    className="bi bi-file-earmark-bar-graph text-muted"
                                    style={{
                                        fontSize:
                                            "50px",
                                    }}
                                />

                                <h5 className="mt-3">
                                    Chưa có báo cáo
                                </h5>

                                <p className="text-muted mb-0">
                                    Hãy chọn khoảng thời gian và tạo báo cáo đầu tiên.
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
                                                Khoảng thời gian
                                            </th>

                                            <th>
                                                Doanh thu
                                            </th>

                                            <th>
                                                Lượt đặt
                                            </th>

                                            <th>
                                                Đã hủy
                                            </th>

                                            <th>
                                                Người tạo
                                            </th>

                                            <th>
                                                Tạo lúc
                                            </th>

                                            <th className="text-center">
                                                Thao tác
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            reports.map(
                                                (
                                                    report,
                                                    index
                                                ) => (

                                                    <tr
                                                        key={
                                                            report._id
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                index + 1
                                                            }
                                                        </td>


                                                        <td>

                                                            {
                                                                formatDate(
                                                                    report.fromDate
                                                                )
                                                            }

                                                            {" → "}

                                                            {
                                                                formatDate(
                                                                    report.toDate
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            <strong className="text-success">

                                                                {
                                                                    formatCurrency(
                                                                        report.totalRevenue
                                                                    )
                                                                }

                                                            </strong>

                                                        </td>


                                                        <td>

                                                            {
                                                                report.totalBookings
                                                            }

                                                        </td>


                                                        <td>

                                                            <span className="badge bg-danger">

                                                                {
                                                                    report.cancelledBookings
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            {
                                                                getCreatorName(
                                                                    report
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                formatDateTime(
                                                                    report.createdAt
                                                                )
                                                            }

                                                        </td>


                                                        <td className="text-center">

                                                            <div className="d-flex justify-content-center gap-2">

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() =>
                                                                        handleViewReport(
                                                                            report._id
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-eye me-1"></i>

                                                                    Xem

                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() =>
                                                                        handleDeleteReport(
                                                                            report._id
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-trash me-1"></i>

                                                                    Xóa

                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )
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


export default Report;