const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        // Booking được thanh toán
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true
        },

        // Số tiền thanh toán
        amount: {
            type: Number,
            required: true,
            min: 0
        },

        // Phương thức thanh toán
        paymentMethod: {
            type: String,
            enum: [
                "cash",
                "bank_transfer"
            ],
            required: true
        },

        // Trạng thái thanh toán
        status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        // Mã giao dịch - dùng cho chuyển khoản
        transactionCode: {
            type: String,
            default: ""
        },

        // Thời gian thanh toán
        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Payment",
    paymentSchema
);