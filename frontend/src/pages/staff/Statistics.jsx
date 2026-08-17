import {
    useEffect,
    useState,
} from "react";

import apiClient
    from "../../api/apiClient";


function Statistics() {

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
        creating,
        setCreating,
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
                    "Staff reports error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tải báo cáo."
                );

            } finally {

                setLoading(false);
            }
        };


    useEffect(() => {

        loadReports();

    }, []);


    // ==========================================================
    // CREATE
    // ==========================================================

    const handleCreateReport =
        async () => {

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

                setCreating(
                    true
                );

                setError("");


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
                    "Create staff report error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể tạo báo cáo."
                );

            } finally {

                setCreating(
                    false
                );
            }
        };


    // ==========================================================
    // VIEW
    // ==========================================================

    const handleView =
        async (
            id
        ) => {

            try {

                const response =
                    await apiClient(
                        `/reports/${id}`,
                        {
                            method:
                                "GET",
                        }
                    );


                setCurrentReport(
                    response?.data ||
                    null
                );

            } catch (err) {

                console.error(
                    "Get staff report error:",
                    err
                );


                setError(
                    err?.data?.message ||
                    err?.message ||
                    "Không thể xem báo cáo."
                );
            }
        };


    // ==========================================================
    // MONEY
    // ==========================================================

    const formatMoney =
        value =>
            Number(
                value || 0
            ).toLocaleString(
                "vi-VN"
            ) + " đ";


    const formatDate =
        value => {

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
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div className="spinner-border text-success" />

                <p className="text-muted mt-3">
                    Đang tải thống kê...
                </p>

            </div>
        );
    }


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div>

            <div className="mb-4">

                <h1 className="mb-1">
                    Thống kê
                </h1>

                <p className="text-muted mb-0">
                    Tạo và xem báo cáo doanh thu, đặt sân và hủy sân
                </p>

            </div>


            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>
            )}


            {/* ==================================================
                CREATE REPORT
            ================================================== */}

            <div className="card border-0 shadow-sm mb-4">

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
                                onChange={
                                    e =>
                                        setFromDate(
                                            e.target.value
                                        )
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
                                onChange={
                                    e =>
                                        setToDate(
                                            e.target.value
                                        )
                                }
                            />

                        </div>


                        <div className="col-md-4">

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={
                                    handleCreateReport
                                }
                                disabled={
                                    creating
                                }
                            >

                                {
                                    creating
                                        ? "Đang tạo..."
                                        : "Tạo báo cáo"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                CURRENT
            ================================================== */}

            {currentReport && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white">

                        <h5 className="mb-0">
                            Báo cáo hiện tại
                        </h5>

                    </div>


                    <div className="card-body">

                        <div className="row g-4">

                            <div className="col-md-3">

                                <div className="border rounded p-3">

                                    <small className="text-muted">
                                        Doanh thu
                                    </small>

                                    <h3 className="text-success">
                                        {
                                            formatMoney(
                                                currentReport.totalRevenue
                                            )
                                        }
                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3">

                                    <small className="text-muted">
                                        Lượt đặt
                                    </small>

                                    <h3>
                                        {
                                            currentReport.totalBookings
                                        }
                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3">

                                    <small className="text-muted">
                                        Đã xác nhận
                                    </small>

                                    <h3 className="text-success">
                                        {
                                            currentReport.confirmedBookings
                                        }
                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3">

                                    <small className="text-muted">
                                        Đã hủy
                                    </small>

                                    <h3 className="text-danger">
                                        {
                                            currentReport.cancelledBookings
                                        }
                                    </h3>

                                </div>

                            </div>

                        </div>


                        <hr />


                        <h5 className="mb-3">
                            Theo ngày
                        </h5>


                        {
                            Array.isArray(
                                currentReport.dailyStats
                            ) &&
                            currentReport.dailyStats.length >
                                0 ? (

                                <div className="table-responsive">

                                    <table className="table table-hover">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Ngày
                                                </th>

                                                <th>
                                                    Lượt đặt
                                                </th>

                                                <th>
                                                    Xác nhận
                                                </th>

                                                <th>
                                                    Chờ xử lý
                                                </th>

                                                <th>
                                                    Hủy
                                                </th>

                                                <th>
                                                    Doanh thu
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {
                                                currentReport.dailyStats.map(
                                                    item => (

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

                                                            <td className="text-success">
                                                                {
                                                                    item.confirmed
                                                                }
                                                            </td>

                                                            <td className="text-warning">
                                                                {
                                                                    item.pending
                                                                }
                                                            </td>

                                                            <td className="text-danger">
                                                                {
                                                                    item.cancelled
                                                                }
                                                            </td>

                                                            <td className="text-success fw-bold">
                                                                {
                                                                    formatMoney(
                                                                        item.revenue
                                                                    )
                                                                }
                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>

                            ) : (

                                <p className="text-muted">
                                    Không có dữ liệu.
                                </p>
                            )
                        }

                    </div>

                </div>
            )}


            {/* ==================================================
                HISTORY
            ================================================== */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white">

                    <h5 className="mb-0">
                        Lịch sử báo cáo
                    </h5>

                </div>


                <div className="card-body p-0">

                    {
                        reports.length ===
                        0 ? (

                            <div className="text-center py-5">

                                <i className="bi bi-bar-chart fs-1 text-muted"></i>

                                <p className="text-muted mt-3">
                                    Chưa có báo cáo.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th>
                                                #
                                            </th>

                                            <th>
                                                Từ ngày
                                            </th>

                                            <th>
                                                Đến ngày
                                            </th>

                                            <th>
                                                Doanh thu
                                            </th>

                                            <th>
                                                Lượt đặt
                                            </th>

                                            <th>
                                                Hủy
                                            </th>

                                            <th>
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
                                                        </td>

                                                        <td>
                                                            {
                                                                formatDate(
                                                                    report.toDate
                                                                )
                                                            }
                                                        </td>

                                                        <td className="text-success fw-bold">
                                                            {
                                                                formatMoney(
                                                                    report.totalRevenue
                                                                )
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                report.totalBookings
                                                            }
                                                        </td>

                                                        <td className="text-danger">
                                                            {
                                                                report.cancelledBookings
                                                            }
                                                        </td>

                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() =>
                                                                    handleView(
                                                                        report._id
                                                                    )
                                                                }
                                                            >

                                                                <i className="bi bi-eye me-1"></i>

                                                                Xem

                                                            </button>

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


export default Statistics;