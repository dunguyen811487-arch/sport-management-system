const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    fieldTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldType",
      required: true,
    },
    fieldName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Field", fieldSchema);