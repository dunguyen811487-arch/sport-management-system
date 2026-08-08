const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
    {
        fieldName: {
            type: String,
            required: true
        },

        fieldTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FieldType",
            required: true
        },

        location: String,

        pricePerHour: Number,

        status: {
            type: String,
            enum: ["active", "maintenance"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Field", fieldSchema);