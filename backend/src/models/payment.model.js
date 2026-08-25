const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema(
    {
        // ======================================================
        // BOOKING
        // ======================================================

        bookingId: {
            type:
                mongoose.Schema.Types.ObjectId,

            ref:
                "Booking",

            required:
                true,

            unique:
                true
        },


        // ======================================================
        // AMOUNT
        // ======================================================

        amount: {
            type:
                Number,

            required:
                true,

            min:
                0
        },


        // ======================================================
        // PAYMENT METHOD
        // ======================================================

        paymentMethod: {
            type:
                String,

            enum: [
                "cash",
                "bank_transfer"
            ],

            required:
                true
        },


        // ======================================================
        // STATUS
        // ======================================================

        status: {
            type:
                String,

            enum: [
                "pending",
                "paid",
                "failed",
                "cancelled",
                "refunded"
            ],

            default:
                "pending"
        },


        // ======================================================
        // PAYMENT PROOF
        // ======================================================

        paymentProof: {
            type:
                String,

            default:
                ""
        },


        // ======================================================
        // TRANSACTION CODE
        // ======================================================

        transactionCode: {
            type:
                String,

            default:
                ""
        },


        // ======================================================
        // PAID AT
        // ======================================================

        paidAt: {
            type:
                Date,

            default:
                null
        }
    },
    {
        timestamps:
            true
    }
);


module.exports =
    mongoose.model(
        "Payment",
        paymentSchema
    );