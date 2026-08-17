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

        location: {
            type: String
        },

        pricePerHour: {
            type: Number
        },

        image: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "active",
                "maintenance"
            ],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Field",
        fieldSchema
    );