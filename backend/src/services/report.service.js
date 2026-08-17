const Report =
    require("../models/report.model");

const Booking =
    require("../models/booking.model");

const Payment =
    require("../models/payment.model");


// ======================================================
// NORMALIZE DATE
// ======================================================

const normalizeDate = (
    value
) => {

    if (!value) {

        throw new Error(
            "Ngày không được để trống"
        );
    }


    const stringValue =
        String(
            value
        ).trim();


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            stringValue
        )
    ) {

        const date =
            new Date(
                `${stringValue}T00:00:00.000Z`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            throw new Error(
                "Ngày không hợp lệ"
            );
        }


        return date;
    }


    const date =
        new Date(
            stringValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        throw new Error(
            "Ngày không hợp lệ"
        );
    }


    return date;
};


// ======================================================
// END OF DAY
// ======================================================

const endOfDay = (
    date
) => {

    const result =
        new Date(
            date
        );


    result.setUTCHours(
        23,
        59,
        59,
        999
    );


    return result;
};


// ======================================================
// DATE KEY
// ======================================================

const getDateKey = (
    value
) => {

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
        date.getUTCFullYear();


    const month =
        String(
            date.getUTCMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getUTCDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}`
    );
};


// ======================================================
// CREATE REPORT
// ======================================================

const createReport =
    async ({
        reportType =
            "booking_revenue",

        fromDate,

        toDate,

        createdBy
    }) => {

        const startDate =
            normalizeDate(
                fromDate
            );


        const rawEndDate =
            normalizeDate(
                toDate
            );


        const finishDate =
            endOfDay(
                rawEndDate
            );


        if (
            startDate >
            finishDate
        ) {

            throw new Error(
                "Từ ngày phải nhỏ hơn hoặc bằng đến ngày"
            );
        }


        if (
            reportType !==
            "booking_revenue"
        ) {

            throw new Error(
                "Loại báo cáo không hợp lệ"
            );
        }


        // ==================================================
        // LOAD BOOKINGS + PAID PAYMENTS
        // ==================================================

        const [
            bookings,
            paidPayments
        ] = await Promise.all([

            Booking.find({
                bookingDate: {
                    $gte:
                        startDate,

                    $lte:
                        finishDate
                }
            })
                .select(
                    "_id bookingDate startTime endTime status totalPrice fieldId customerId createdAt"
                )
                .lean(),


            Payment.find({
                status:
                    "paid",

                paidAt: {
                    $gte:
                        startDate,

                    $lte:
                        finishDate
                }
            })
                .select(
                    "_id bookingId amount paymentMethod paidAt createdAt"
                )
                .lean()
        ]);


        // ==================================================
        // BOOKING STATISTICS
        // ==================================================

        const totalBookings =
            bookings.length;


        const confirmedBookings =
            bookings.filter(
                (
                    booking
                ) =>
                    booking.status ===
                    "confirmed"
            ).length;


        const pendingBookings =
            bookings.filter(
                (
                    booking
                ) =>
                    booking.status ===
                    "pending"
            ).length;


        const cancelledBookings =
            bookings.filter(
                (
                    booking
                ) =>
                    booking.status ===
                    "cancelled"
            ).length;


        // ==================================================
        // PAYMENT STATISTICS
        // ==================================================

        const totalPaidPayments =
            paidPayments.length;


        const totalRevenue =
            paidPayments.reduce(
                (
                    total,
                    payment
                ) => {

                    return (
                        total +
                        Number(
                            payment.amount ||
                            0
                        )
                    );

                },
                0
            );


        // ==================================================
        // DAILY STATS
        // ==================================================

        const dailyMap =
            new Map();


        // --------------------------------------------------
        // BOOKING
        // --------------------------------------------------

        bookings.forEach(
            (
                booking
            ) => {

                const dateKey =
                    getDateKey(
                        booking.bookingDate
                    );


                if (!dateKey) {
                    return;
                }


                if (
                    !dailyMap.has(
                        dateKey
                    )
                ) {

                    dailyMap.set(
                        dateKey,
                        {
                            date:
                                dateKey,

                            bookings:
                                0,

                            confirmed:
                                0,

                            pending:
                                0,

                            cancelled:
                                0,

                            revenue:
                                0
                        }
                    );
                }


                const daily =
                    dailyMap.get(
                        dateKey
                    );


                daily.bookings += 1;


                switch (
                    booking.status
                ) {

                    case "confirmed":

                        daily.confirmed += 1;

                        break;


                    case "pending":

                        daily.pending += 1;

                        break;


                    case "cancelled":

                        daily.cancelled += 1;

                        break;


                    default:
                        break;
                }

            }
        );


        // --------------------------------------------------
        // REVENUE
        // --------------------------------------------------

        paidPayments.forEach(
            (
                payment
            ) => {

                const dateKey =
                    getDateKey(
                        payment.paidAt ||
                        payment.createdAt
                    );


                if (!dateKey) {
                    return;
                }


                if (
                    !dailyMap.has(
                        dateKey
                    )
                ) {

                    dailyMap.set(
                        dateKey,
                        {
                            date:
                                dateKey,

                            bookings:
                                0,

                            confirmed:
                                0,

                            pending:
                                0,

                            cancelled:
                                0,

                            revenue:
                                0
                        }
                    );
                }


                const daily =
                    dailyMap.get(
                        dateKey
                    );


                daily.revenue +=
                    Number(
                        payment.amount ||
                        0
                    );
            }
        );


        const dailyStats =
            Array.from(
                dailyMap.values()
            ).sort(
                (
                    a,
                    b
                ) =>
                    a.date.localeCompare(
                        b.date
                    )
            );


        // ==================================================
        // SAVE REPORT
        // ==================================================

        const report =
            await Report.create({

                reportType:
                    reportType,

                fromDate:
                    startDate,

                toDate:
                    finishDate,

                totalRevenue:
                    totalRevenue,

                totalPaidPayments:
                    totalPaidPayments,

                totalBookings:
                    totalBookings,

                confirmedBookings:
                    confirmedBookings,

                pendingBookings:
                    pendingBookings,

                cancelledBookings:
                    cancelledBookings,

                dailyStats:
                    dailyStats,

                createdBy:
                    createdBy
            });


        return await Report
            .findById(
                report._id
            )
            .populate({
                path:
                    "createdBy",

                select:
                    "fullName name email role"
            });
};


// ======================================================
// GET ALL REPORTS
// ======================================================

const getAllReports =
    async () => {

        return await Report
            .find()
            .populate({
                path:
                    "createdBy",

                select:
                    "fullName name email role"
            })
            .sort({
                createdAt:
                    -1
            });
    };


// ======================================================
// GET REPORT BY ID
// ======================================================

const getReportById =
    async (
        id
    ) => {

        const report =
            await Report.findById(
                id
            )
            .populate({
                path:
                    "createdBy",

                select:
                    "fullName name email role"
            });


        if (!report) {

            throw new Error(
                "Không tìm thấy báo cáo"
            );
        }


        return report;
    };


// ======================================================
// DELETE REPORT
// ======================================================

const deleteReport =
    async (
        id
    ) => {

        const report =
            await Report.findById(
                id
            );


        if (!report) {

            throw new Error(
                "Không tìm thấy báo cáo"
            );
        }


        await Report.findByIdAndDelete(
            id
        );


        return report;
    };


module.exports = {

    createReport,

    getAllReports,

    getReportById,

    deleteReport
};