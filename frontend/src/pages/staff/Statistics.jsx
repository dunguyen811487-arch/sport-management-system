import {
    useEffect,
    useState,
} from "react";

import apiClient
    from "../../api/apiClient";

import * as XLSX
    from "xlsx";


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

                } else {

                    setCurrentReport(
                        null
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


                setReports([]);

                setCurrentReport(null);


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

                setCreating(
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
    // VIEW REPORT
    // ==========================================================

    const handleView =
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
                    !response?.data
                ) {

                    throw new Error(
                        response?.message ||
                        "Không thể xem báo cáo."
                    );
                }


                setCurrentReport(
                    response.data
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


    // ==========================================================
    // DATE
    // ==========================================================

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
    // DATETIME
    // ==========================================================

    const formatDateTime =
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


            return date.toLocaleString(
                "vi-VN"
            );
        };


    // ==========================================================
    // GET CREATOR
    // ==========================================================

    const getCreatorName =
        report => {

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
    // EXPORT CURRENT REPORT TO EXCEL
    // ==========================================================

    const handleExportCurrentReport =
        () => {

            if (
                !currentReport
            ) {

                setError(
                    "Chưa có báo cáo để xuất Excel."
                );

                return;
            }


            try {

                setError("");


                // ==================================================
                // SHEET 1: TỔNG QUAN
                // ==================================================

                const summaryData = [

                    [
                        "BÁO CÁO THỐNG KÊ DOANH THU VÀ ĐẶT SÂN"
                    ],

                    [],

                    [
                        "Từ ngày",
                        formatDate(
                            currentReport.fromDate
                        )
                    ],

                    [
                        "Đến ngày",
                        formatDate(
                            currentReport.toDate
                        )
                    ],

                    [
                        "Tổng doanh thu",
                        Number(
                            currentReport.totalRevenue || 0
                        )
                    ],

                    [
                        "Giao dịch đã thanh toán",
                        Number(
                            currentReport.totalPaidPayments || 0
                        )
                    ],

                    [
                        "Tổng lượt đặt sân",
                        Number(
                            currentReport.totalBookings || 0
                        )
                    ],

                    [
                        "Booking đã xác nhận",
                        Number(
                            currentReport.confirmedBookings || 0
                        )
                    ],

                    [
                        "Booking chờ xử lý",
                        Number(
                            currentReport.pendingBookings || 0
                        )
                    ],

                    [
                        "Booking bị hủy",
                        Number(
                            currentReport.cancelledBookings || 0
                        )
                    ],

                    [],

                    [
                        "Người tạo",
                        getCreatorName(
                            currentReport
                        )
                    ],

                    [
                        "Thời gian tạo",
                        formatDateTime(
                            currentReport.createdAt
                        )
                    ],

                ];


                const summarySheet =
                    XLSX.utils.aoa_to_sheet(
                        summaryData
                    );


                // ==================================================
                // SHEET 2: THỐNG KÊ THEO NGÀY
                // ==================================================

                const dailyData = [

                    [
                        "Ngày",
                        "Tổng lượt đặt",
                        "Đã xác nhận",
                        "Chờ xử lý",
                        "Đã hủy",
                        "Doanh thu"
                    ],

                ];


                if (
                    Array.isArray(
                        currentReport.dailyStats
                    )
                ) {

                    currentReport.dailyStats.forEach(
                        item => {

                            dailyData.push([
                                formatDate(
                                    item.date
                                ),

                                Number(
                                    item.bookings || 0
                                ),

                                Number(
                                    item.confirmed || 0
                                ),

                                Number(
                                    item.pending || 0
                                ),

                                Number(
                                    item.cancelled || 0
                                ),

                                Number(
                                    item.revenue || 0
                                ),
                            ]);

                        }
                    );
                }


                const dailySheet =
                    XLSX.utils.aoa_to_sheet(
                        dailyData
                    );


                // ==================================================
                // COLUMN WIDTH
                // ==================================================

                summarySheet["!cols"] = [

                    {
                        wch: 30
                    },

                    {
                        wch: 25
                    },

                ];


                dailySheet["!cols"] = [

                    {
                        wch: 18
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 15
                    },

                    {
                        wch: 20
                    },

                ];


                // ==================================================
                // CREATE WORKBOOK
                // ==================================================

                const workbook =
                    XLSX.utils.book_new();


                XLSX.utils.book_append_sheet(
                    workbook,
                    summarySheet,
                    "Tổng quan"
                );


                XLSX.utils.book_append_sheet(
                    workbook,
                    dailySheet,
                    "Theo ngày"
                );


                // ==================================================
                // FILE NAME
                // ==================================================

                const from =
                    currentReport.fromDate
                        ? String(
                            currentReport.fromDate
                        ).substring(
                            0,
                            10
                        )
                        : "from";


                const to =
                    currentReport.toDate
                        ? String(
                            currentReport.toDate
                        ).substring(
                            0,
                            10
                        )
                        : "to";


                const fileName =
                    `BaoCao_${from}_${to}.xlsx`;


                // ==================================================
                // DOWNLOAD
                // ==================================================

                XLSX.writeFile(
                    workbook,
                    fileName
                );


            } catch (err) {

                console.error(
                    "Export current report error:",
                    err
                );


                setError(
                    "Không thể xuất báo cáo Excel."
                );
            }
        };


    // ==========================================================
    // EXPORT ONE REPORT FROM HISTORY
    // ==========================================================

    const handleExportReport =
        async (
            report
        ) => {

            try {

                setError("");


                let reportData =
                    report;


                // ==================================================
                // LẤY CHI TIẾT BÁO CÁO
                // ==================================================

                if (
                    report?._id
                ) {

                    try {

                        const response =
                            await apiClient(
                                `/reports/${report._id}`,
                                {
                                    method:
                                        "GET",
                                }
                            );


                        if (
                            response?.data
                        ) {

                            reportData =
                                response.data;

                        }

                    } catch (
                        detailError
                    ) {

                        console.warn(
                            "Không lấy được chi tiết report, dùng dữ liệu hiện tại:",
                            detailError
                        );

                    }
                }


                // ==================================================
                // SUMMARY
                // ==================================================

                const summaryData = [

                    [
                        "BÁO CÁO THỐNG KÊ DOANH THU VÀ ĐẶT SÂN"
                    ],

                    [],

                    [
                        "Từ ngày",
                        formatDate(
                            reportData.fromDate
                        )
                    ],

                    [
                        "Đến ngày",
                        formatDate(
                            reportData.toDate
                        )
                    ],

                    [
                        "Tổng doanh thu",
                        Number(
                            reportData.totalRevenue || 0
                        )
                    ],

                    [
                        "Giao dịch đã thanh toán",
                        Number(
                            reportData.totalPaidPayments || 0
                        )
                    ],

                    [
                        "Tổng lượt đặt sân",
                        Number(
                            reportData.totalBookings || 0
                        )
                    ],

                    [
                        "Booking đã xác nhận",
                        Number(
                            reportData.confirmedBookings || 0
                        )
                    ],

                    [
                        "Booking chờ xử lý",
                        Number(
                            reportData.pendingBookings || 0
                        )
                    ],

                    [
                        "Booking bị hủy",
                        Number(
                            reportData.cancelledBookings || 0
                        )
                    ],

                    [],

                    [
                        "Người tạo",
                        getCreatorName(
                            reportData
                        )
                    ],

                    [
                        "Thời gian tạo",
                        formatDateTime(
                            reportData.createdAt
                        )
                    ],

                ];


                const summarySheet =
                    XLSX.utils.aoa_to_sheet(
                        summaryData
                    );


                // ==================================================
                // DAILY
                // ==================================================

                const dailyData = [

                    [
                        "Ngày",
                        "Tổng lượt đặt",
                        "Đã xác nhận",
                        "Chờ xử lý",
                        "Đã hủy",
                        "Doanh thu"
                    ],

                ];


                if (
                    Array.isArray(
                        reportData.dailyStats
                    )
                ) {

                    reportData.dailyStats.forEach(
                        item => {

                            dailyData.push([

                                formatDate(
                                    item.date
                                ),

                                Number(
                                    item.bookings || 0
                                ),

                                Number(
                                    item.confirmed || 0
                                ),

                                Number(
                                    item.pending || 0
                                ),

                                Number(
                                    item.cancelled || 0
                                ),

                                Number(
                                    item.revenue || 0
                                ),

                            ]);

                        }
                    );
                }


                const dailySheet =
                    XLSX.utils.aoa_to_sheet(
                        dailyData
                    );


                summarySheet["!cols"] = [

                    {
                        wch: 30
                    },

                    {
                        wch: 25
                    },

                ];


                dailySheet["!cols"] = [

                    {
                        wch: 18
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 15
                    },

                    {
                        wch: 20
                    },

                ];


                // ==================================================
                // WORKBOOK
                // ==================================================

                const workbook =
                    XLSX.utils.book_new();


                XLSX.utils.book_append_sheet(
                    workbook,
                    summarySheet,
                    "Tổng quan"
                );


                XLSX.utils.book_append_sheet(
                    workbook,
                    dailySheet,
                    "Theo ngày"
                );


                const from =
                    reportData.fromDate
                        ? String(
                            reportData.fromDate
                        ).substring(
                            0,
                            10
                        )
                        : "from";


                const to =
                    reportData.toDate
                        ? String(
                            reportData.toDate
                        ).substring(
                            0,
                            10
                        )
                        : "to";


                const fileName =
                    `BaoCao_${from}_${to}.xlsx`;


                XLSX.writeFile(
                    workbook,
                    fileName
                );


            } catch (err) {

                console.error(
                    "Export report error:",
                    err
                );


                setError(
                    "Không thể xuất báo cáo Excel."
                );
            }
        };


    // ==========================================================
    // EXPORT ALL REPORTS
    // ==========================================================

    const handleExportAllReports =
        () => {

            if (
                !Array.isArray(
                    reports
                ) ||
                reports.length === 0
            ) {

                setError(
                    "Không có báo cáo để xuất Excel."
                );

                return;
            }


            try {

                setError("");


                const data = [

                    [
                        "STT",
                        "Từ ngày",
                        "Đến ngày",
                        "Doanh thu",
                        "Giao dịch đã thanh toán",
                        "Tổng lượt đặt",
                        "Đã xác nhận",
                        "Chờ xử lý",
                        "Đã hủy",
                        "Người tạo",
                        "Tạo lúc"
                    ],

                ];


                reports.forEach(
                    (
                        report,
                        index
                    ) => {

                        data.push([

                            index + 1,

                            formatDate(
                                report.fromDate
                            ),

                            formatDate(
                                report.toDate
                            ),

                            Number(
                                report.totalRevenue || 0
                            ),

                            Number(
                                report.totalPaidPayments || 0
                            ),

                            Number(
                                report.totalBookings || 0
                            ),

                            Number(
                                report.confirmedBookings || 0
                            ),

                            Number(
                                report.pendingBookings || 0
                            ),

                            Number(
                                report.cancelledBookings || 0
                            ),

                            getCreatorName(
                                report
                            ),

                            formatDateTime(
                                report.createdAt
                            ),

                        ]);

                    }
                );


                const worksheet =
                    XLSX.utils.aoa_to_sheet(
                        data
                    );


                worksheet["!cols"] = [

                    {
                        wch: 8
                    },

                    {
                        wch: 15
                    },

                    {
                        wch: 15
                    },

                    {
                        wch: 20
                    },

                    {
                        wch: 25
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 18
                    },

                    {
                        wch: 15
                    },

                    {
                        wch: 25
                    },

                    {
                        wch: 25
                    },

                ];


                const workbook =
                    XLSX.utils.book_new();


                XLSX.utils.book_append_sheet(
                    workbook,
                    worksheet,
                    "Lịch sử báo cáo"
                );


                XLSX.writeFile(
                    workbook,
                    "LichSuBaoCao.xlsx"
                );


            } catch (err) {

                console.error(
                    "Export all reports error:",
                    err
                );


                setError(
                    "Không thể xuất lịch sử báo cáo Excel."
                );
            }
        };


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-success"
                    role="status"
                />

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

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="d-flex justify-content-between align-items-start mb-4">

                <div>

                    <h1 className="mb-1">
                        Thống kê
                    </h1>

                    <p className="text-muted mb-0">
                        Tạo và xem báo cáo doanh thu, đặt sân và hủy sân
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={
                        loadReports
                    }
                    disabled={
                        loading
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
                CREATE REPORT
            ================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white">

                    <h5 className="mb-0">

                        <i className="bi bi-file-earmark-bar-graph me-2"></i>

                        Tạo báo cáo

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
                                onChange={
                                    e =>
                                        setFromDate(
                                            e.target.value
                                        )
                                }
                                disabled={
                                    creating
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
                                disabled={
                                    creating
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

                                {creating ? (

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

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                CURRENT REPORT
            ================================================== */}

            {currentReport && (

                <div className="card border-0 shadow-sm mb-4">

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


                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={
                                    handleExportCurrentReport
                                }
                            >

                                <i className="bi bi-file-earmark-excel me-2"></i>

                                Xuất Excel

                            </button>

                        </div>

                    </div>


                    <div className="card-body">

                        {/* ==================================================
                            SUMMARY
                        ================================================== */}

                        <div className="row g-4">

                            <div className="col-md-3">

                                <div className="border rounded p-3 h-100">

                                    <small className="text-muted">
                                        Doanh thu
                                    </small>

                                    <h3 className="text-success mb-0">

                                        {
                                            formatMoney(
                                                currentReport.totalRevenue
                                            )
                                        }

                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3 h-100">

                                    <small className="text-muted">
                                        Giao dịch đã thanh toán
                                    </small>

                                    <h3 className="text-primary mb-0">

                                        {
                                            currentReport.totalPaidPayments ??
                                            0
                                        }

                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3 h-100">

                                    <small className="text-muted">
                                        Lượt đặt
                                    </small>

                                    <h3 className="mb-0">

                                        {
                                            currentReport.totalBookings
                                        }

                                    </h3>

                                </div>

                            </div>


                            <div className="col-md-3">

                                <div className="border rounded p-3 h-100">

                                    <small className="text-muted">
                                        Đã hủy
                                    </small>

                                    <h3 className="text-danger mb-0">

                                        {
                                            currentReport.cancelledBookings
                                        }

                                    </h3>

                                </div>

                            </div>

                        </div>


                        <hr className="my-4" />


                        {/* ==================================================
                            DAILY
                        ================================================== */}

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

                                    <table className="table table-hover align-middle">

                                        <thead className="table-light">

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


                                                            <td className="text-success fw-bold">

                                                                {
                                                                    item.confirmed
                                                                }

                                                            </td>


                                                            <td className="text-warning fw-bold">

                                                                {
                                                                    item.pending
                                                                }

                                                            </td>


                                                            <td className="text-danger fw-bold">

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

                                <p className="text-muted mb-0">
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

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h5 className="mb-1">
                                Lịch sử báo cáo
                            </h5>

                            <small className="text-muted">
                                Các báo cáo đã được lưu trong hệ thống
                            </small>

                        </div>


                        <div className="d-flex align-items-center gap-2">

                            <span className="badge bg-secondary">

                                {
                                    reports.length
                                }{" "}
                                báo cáo

                            </span>


                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={
                                    handleExportAllReports
                                }
                                disabled={
                                    reports.length === 0
                                }
                            >

                                <i className="bi bi-file-earmark-excel me-1"></i>

                                Xuất tất cả Excel

                            </button>

                        </div>

                    </div>

                </div>


                <div className="card-body p-0">

                    {
                        reports.length ===
                        0 ? (

                            <div className="text-center py-5">

                                <i
                                    className="bi bi-bar-chart fs-1 text-muted"
                                />

                                <p className="text-muted mt-3 mb-0">
                                    Chưa có báo cáo.
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

                                                            <div className="d-flex gap-2">

                                                                {/* XEM */}

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


                                                                {/* XUẤT EXCEL */}

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-success"
                                                                    onClick={() =>
                                                                        handleExportReport(
                                                                            report
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-file-earmark-excel me-1"></i>

                                                                    Excel

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


export default Statistics;