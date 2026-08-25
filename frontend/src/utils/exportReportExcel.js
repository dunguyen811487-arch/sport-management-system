import * as XLSX from "xlsx";

// ======================================================
// FORMAT DATE
// ======================================================

const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("vi-VN");
};


// ======================================================
// FORMAT DATETIME
// ======================================================

const formatDateTime = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("vi-VN");
};


// ======================================================
// GET CREATOR NAME
// ======================================================

const getCreatorName = (report) => {

    if (
        report?.createdBy &&
        typeof report.createdBy === "object"
    ) {
        return (
            report.createdBy.fullName ||
            report.createdBy.name ||
            report.createdBy.username ||
            "-"
        );
    }

    return (
        report?.createdBy ||
        report?.creatorName ||
        "-"
    );
};


// ======================================================
// GET DATE RANGE
// ======================================================

const getDateRange = (report) => {

    const startDate =
        report?.startDate ||
        report?.fromDate ||
        report?.dateFrom ||
        report?.periodStart;

    const endDate =
        report?.endDate ||
        report?.toDate ||
        report?.dateTo ||
        report?.periodEnd;

    if (!startDate && !endDate) {
        return "-";
    }

    return `${formatDate(startDate)} → ${formatDate(endDate)}`;
};


// ======================================================
// GET REVENUE
// ======================================================

const getRevenue = (report) => {

    return Number(
        report?.totalRevenue ??
        report?.revenue ??
        report?.totalAmount ??
        0
    );
};


// ======================================================
// GET BOOKING COUNT
// ======================================================

const getBookingCount = (report) => {

    return Number(
        report?.totalBookings ??
        report?.bookingCount ??
        report?.totalBooking ??
        report?.bookingsCount ??
        0
    );
};


// ======================================================
// GET CANCELLED COUNT
// ======================================================

const getCancelledCount = (report) => {

    return Number(
        report?.cancelledBookings ??
        report?.cancelledCount ??
        report?.totalCancelled ??
        report?.cancelled ??
        0
    );
};


// ======================================================
// EXPORT REPORT HISTORY
// ======================================================

export const exportReportHistoryToExcel = (
    reports = []
) => {

    if (!Array.isArray(reports) || reports.length === 0) {

        alert(
            "Không có dữ liệu báo cáo để xuất Excel."
        );

        return;
    }


    // ==================================================
    // CHUYỂN DỮ LIỆU SANG DẠNG EXCEL
    // ==================================================

    const excelData =
        reports.map(
            (
                report,
                index
            ) => {

                return {

                    "#":
                        index + 1,

                    "Khoảng thời gian":
                        getDateRange(
                            report
                        ),

                    "Doanh thu":
                        getRevenue(
                            report
                        ),

                    "Lượt đặt":
                        getBookingCount(
                            report
                        ),

                    "Đã hủy":
                        getCancelledCount(
                            report
                        ),

                    "Người tạo":
                        getCreatorName(
                            report
                        ),

                    "Tạo lúc":
                        formatDateTime(
                            report?.createdAt
                        )
                };
            }
        );


    // ==================================================
    // TẠO WORKSHEET
    // ==================================================

    const worksheet =
        XLSX.utils.json_to_sheet(
            excelData
        );


    // ==================================================
    // ĐỘ RỘNG CỘT
    // ==================================================

    worksheet["!cols"] = [

        {
            wch: 6
        },

        {
            wch: 28
        },

        {
            wch: 18
        },

        {
            wch: 12
        },

        {
            wch: 12
        },

        {
            wch: 22
        },

        {
            wch: 22
        }
    ];


    // ==================================================
    // TẠO WORKBOOK
    // ==================================================

    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Lịch sử báo cáo"
    );


    // ==================================================
    // TÊN FILE
    // ==================================================

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    const fileName =
        `Lich_su_bao_cao_${year}-${month}-${day}.xlsx`;


    // ==================================================
    // DOWNLOAD
    // ==================================================

    XLSX.writeFile(
        workbook,
        fileName
    );
};