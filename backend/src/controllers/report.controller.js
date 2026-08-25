const reportService =
    require(
        "../services/report.service"
    );


// ======================================================
// CREATE REPORT
// ADMIN + STAFF
// ======================================================

const createReport =
    async (
        req,
        res
    ) => {

        try {

            const report =
                await reportService.createReport({
                    reportType:
                        req.body.reportType ||
                        "booking_revenue",

                    fromDate:
                        req.body.fromDate,

                    toDate:
                        req.body.toDate,

                    createdBy:
                        req.user.id
                });


            res.status(
                201
            ).json({

                success:
                    true,

                message:
                    "Tạo báo cáo thành công",

                data:
                    report
            });

        } catch (error) {

            console.error(
                "Create report error:",
                error
            );


            res.status(
                400
            ).json({

                success:
                    false,

                message:
                    error.message
            });
        }
    };


// ======================================================
// GET ALL REPORTS
// ADMIN + STAFF
// ======================================================

const getAllReports =
    async (
        req,
        res
    ) => {

        try {

            const reports =
                await reportService
                    .getAllReports();


            res.json({

                success:
                    true,

                data:
                    reports
            });

        } catch (error) {

            console.error(
                "Get reports error:",
                error
            );


            res.status(
                500
            ).json({

                success:
                    false,

                message:
                    error.message
            });
        }
    };


// ======================================================
// GET REPORT BY ID
// ADMIN + STAFF
// ======================================================

const getReportById =
    async (
        req,
        res
    ) => {

        try {

            const report =
                await reportService
                    .getReportById(
                        req.params.id
                    );


            res.json({

                success:
                    true,

                data:
                    report
            });

        } catch (error) {

            console.error(
                "Get report detail error:",
                error
            );


            const status =
                error.message ===
                "Không tìm thấy báo cáo"
                    ? 404
                    : 500;


            res.status(
                status
            ).json({

                success:
                    false,

                message:
                    error.message
            });
        }
    };


// ======================================================
// DELETE REPORT
// ADMIN
// ======================================================

const deleteReport =
    async (
        req,
        res
    ) => {

        try {

            await reportService
                .deleteReport(
                    req.params.id
                );


            res.json({

                success:
                    true,

                message:
                    "Xóa báo cáo thành công"
            });

        } catch (error) {

            console.error(
                "Delete report error:",
                error
            );


            const status =
                error.message ===
                "Không tìm thấy báo cáo"
                    ? 404
                    : 400;


            res.status(
                status
            ).json({

                success:
                    false,

                message:
                    error.message
            });
        }
    };


module.exports = {

    createReport,

    getAllReports,

    getReportById,

    deleteReport
};