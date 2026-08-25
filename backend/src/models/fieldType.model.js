const mongoose = require("mongoose");

const fieldTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FieldType", fieldTypeSchema);