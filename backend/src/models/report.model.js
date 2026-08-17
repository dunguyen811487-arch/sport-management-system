const mongoose =
    require("mongoose");


const reportSchema =
    new mongoose.Schema(
        {
            // ==================================================
            // LOẠI BÁO CÁO
            // ==================================================

            reportType: {
                type: String,

                enum: [
                    "booking_revenue"
                ],

                default:
                    "booking_revenue",

                required:
                    true
            },


            // ==================================================
            // KHOẢNG THỜI GIAN
            // ==================================================

            fromDate: {
                type: Date,
                required: true
            },


            toDate: {
                type: Date,
                required: true
            },


            // ==================================================
            // DOANH THU
            // ==================================================

            totalRevenue: {
                type:
                    Number,

                default:
                    0,

                min:
                    0
            },


            totalPaidPayments: {
                type:
                    Number,

                default:
                    0,

                min:
                    0
            },


            // ==================================================
            // BOOKING
            // ==================================================

            totalBookings: {
                type:
                    Number,

                default:
                    0,

                min:
                    0
            },


            confirmedBookings: {
                type:
                    Number,

                default:
                    0,

                min:
                    0
            },


            pendingBookings: {
                type:
                    Number,

                default:
                    0,

                min:
                    0
            },


            cancelledBookings: {
                type:
                    Number,

                default:
                    0,

                min:
                    0
            },


            // ==================================================
            // THEO NGÀY
            // ==================================================

            dailyStats: [

                {
                    date: {
                        type:
                            String,

                        required:
                            true
                    },


                    bookings: {
                        type:
                            Number,

                        default:
                            0
                    },


                    confirmed: {
                        type:
                            Number,

                        default:
                            0
                    },


                    pending: {
                        type:
                            Number,

                        default:
                            0
                    },


                    cancelled: {
                        type:
                            Number,

                        default:
                            0
                    },


                    revenue: {
                        type:
                            Number,

                        default:
                            0
                    }
                }
            ],


            // ==================================================
            // NGƯỜI TẠO
            // ==================================================

            createdBy: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref:
                    "User",

                required:
                    true
            }
        },
        {
            timestamps:
                true
        }
    );


module.exports =
    mongoose.model(
        "Report",
        reportSchema
    );