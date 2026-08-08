const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fieldId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field",
            required: true
        },

        bookingDate: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        totalPrice: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "cancelled",
                "completed"
            ],
            default: "pending"
        },

        note: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);